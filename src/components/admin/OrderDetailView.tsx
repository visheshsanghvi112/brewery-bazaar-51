
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Package, MapPin, CreditCard, Truck, Calendar, Mail, Send } from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { OrderStatusHandler } from "./OrderStatusHandler";
import { OrderActions } from "./OrderUtils";
import { db } from "@/integrations/firebase/client";
import { doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { sendOrderStatusUpdateEmail } from "@/utils/emailService";

interface OrderDetailViewProps {
  order: Order;
  onClose: () => void;
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
}

export const OrderDetailView = ({ order, onClose, onUpdateOrder }: OrderDetailViewProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [notes, setNotes] = useState(order.notes || "");
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const { toast } = useToast();

  const handleOrderUpdate = async (field: string, value: any) => {
    if (!order.firestoreId) {
      toast({
        title: "Error",
        description: "Cannot update order: Firestore ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const orderRef = doc(db, "orders", order.firestoreId);
      const updateData = {
        [field]: value,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(orderRef, updateData);
      
      // Update local state
      onUpdateOrder(order.id, { [field]: value });
      
      toast({
        title: "Order updated",
        description: `Order #${order.id} ${field} has been updated`,
      });
    } catch (error) {
      console.error(`Error updating order ${field}:`, error);
      toast({
        title: "Update failed",
        description: `Failed to update order ${field}`,
        variant: "destructive"
      });
    }
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    onUpdateOrder(orderId, { status });
  };

  const handleDeleteOrder = (orderId: string) => {
    onClose();
  };

  const handleSendManualNotification = async () => {
    if (!order.customer?.email && !order.customerEmail) {
      toast({
        title: "Cannot send notification",
        description: "Customer email address is missing",
        variant: "destructive"
      });
      return;
    }
    
    setIsSendingNotification(true);
    
    try {
      const emailResult = await sendOrderStatusUpdateEmail(order);
      
      if (emailResult.success) {
        // Update the order with email notification status
        if (order.firestoreId) {
          const orderRef = doc(db, "orders", order.firestoreId);
          await updateDoc(orderRef, {
            lastEmailNotification: {
              status: "Sent",
              date: new Date().toISOString()
            },
            updatedAt: new Date().toISOString()
          });
          
          onUpdateOrder(order.id, {
            lastEmailNotification: {
              status: "Sent",
              date: new Date().toISOString()
            }
          });
        }
        
        toast({
          title: "Notification sent",
          description: `Status update email sent to ${order.customer?.email || order.customerEmail}`,
        });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending notification email:", error);
      toast({
        title: "Email notification failed",
        description: "Could not send status update email to customer",
        variant: "destructive"
      });
    } finally {
      setIsSendingNotification(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Order #{order.id}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            {new Date(order.date || order.createdAt || Date.now()).toLocaleDateString()} | 
            {order.customer?.name || order.customerName || "Unknown Customer"}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">Order Details</TabsTrigger>
            <TabsTrigger value="shipping" className="flex-1">Shipping & Delivery</TabsTrigger>
            <TabsTrigger value="customer" className="flex-1">Customer Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Status</h3>
                <OrderStatusHandler 
                  orderId={order.id} 
                  firestoreId={order.firestoreId} 
                  currentStatus={order.status} 
                  customerEmail={order.customer?.email || order.customerEmail}
                  customerName={order.customer?.name || order.customerName}
                  onUpdateStatus={handleUpdateStatus} 
                />
              </div>
              <OrderActions 
                order={order} 
                onStatusChange={handleUpdateStatus} 
                onOrderDelete={handleDeleteOrder} 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-1">
                    <Package className="h-4 w-4" /> Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y">
                    {order.items?.map((item, idx) => (
                      <li key={idx} className="py-2">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.variant.size}, {item.variant.color} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">₹{(item.price / 100).toFixed(2)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-1">
                    <CreditCard className="h-4 w-4" /> Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{(order.subtotal / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>₹{(order.shipping / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total:</span>
                      <span>₹{(order.total / 100).toFixed(2)}</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm">Payment Method: {order.paymentMethod || "Not specified"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Add notes about this order..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <Button 
                  className="mt-2"
                  size="sm"
                  onClick={() => handleOrderUpdate("notes", notes)}
                >
                  Save Notes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shipping" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {order.shippingAddress ? (
                    <div className="space-y-1">
                      <p>{order.customer?.name || order.customerName || ""}</p>
                      <p>{order.shippingAddress.street}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No shipping address available</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-1">
                    <Truck className="h-4 w-4" /> Tracking Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="trackingNumber" className="text-sm font-medium">
                        Tracking Number
                      </label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="trackingNumber"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Enter tracking number..."
                        />
                        <Button onClick={() => handleOrderUpdate("trackingNumber", trackingNumber)}>
                          Save
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <p className="text-sm mb-2">
                        <span className="font-medium">Fulfillment Status:</span> {order.fulfillmentStatus || "Pending"}
                      </p>
                      <p className="text-sm">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        <span className="font-medium">Order Date:</span> {new Date(order.date || order.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-1">
                  <Mail className="h-4 w-4" /> Notification History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Last Notification Status</p>
                      <p className="text-sm text-muted-foreground">
                        {order.lastEmailNotification ? 
                          `${order.lastEmailNotification.status} on ${new Date(order.lastEmailNotification.date).toLocaleString()}` : 
                          "No notifications sent"}
                      </p>
                    </div>
                    <Button 
                      onClick={handleSendManualNotification} 
                      disabled={isSendingNotification || !order.customer?.email && !order.customerEmail}
                      size="sm"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      {isSendingNotification ? "Sending..." : "Send Notification"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customer" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p>{order.customer?.name || order.customerName || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p>{order.customer?.email || order.customerEmail || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p>{order.customer?.phone || "Not provided"}</p>
                  </div>
                  {order.userId && (
                    <div>
                      <p className="text-sm font-medium">User ID</p>
                      <p className="font-mono text-sm">{order.userId}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                {order.billingAddress ? (
                  <div className="space-y-1">
                    <p>{order.customer?.name || order.customerName || ""}</p>
                    <p>{order.billingAddress.street}</p>
                    <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</p>
                    <p>{order.billingAddress.country}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No billing address available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
