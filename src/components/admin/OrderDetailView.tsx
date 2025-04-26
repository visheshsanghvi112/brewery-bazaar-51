
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XCircle, Printer, Mail, FileText, RefreshCw } from "lucide-react";
import { Order } from "@/types";
import { OrderStatusHandler } from "./OrderStatusHandler";
import { OrderFulfillmentTracker } from "./OrderFulfillmentTracker";
import { StatusBadge } from "./StatusBadge";
import { sendOrderStatusUpdateEmail } from "@/utils/emailService";
import { useToast } from "@/hooks/use-toast";
import { generateShippingLabel } from "@/utils/shippingLabels";

interface OrderDetailViewProps {
  order: Order;
  onClose: () => void;
  onUpdateOrder: (
    orderId: string, 
    updates: Partial<Order>
  ) => void;
}

export function OrderDetailView({ 
  order, 
  onClose,
  onUpdateOrder
}: OrderDetailViewProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [notes, setNotes] = useState(order.notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  // Handle status update
  const handleStatusUpdate = (orderId: string, status: string) => {
    onUpdateOrder(orderId, { status: status as any });
    
    toast({
      title: "Order updated",
      description: `Order status changed to ${status}`,
    });
  };
  
  // Handle fulfillment update
  const handleFulfillmentUpdate = (
    orderId: string, 
    fulfillmentStatus: string, 
    trackingNumber?: string
  ) => {
    const updates: Partial<Order> = {
      fulfillmentStatus: fulfillmentStatus as any
    };
    
    if (trackingNumber) {
      updates.trackingNumber = trackingNumber;
    }
    
    onUpdateOrder(orderId, updates);
    
    toast({
      title: "Fulfillment updated",
      description: `Order fulfillment status updated to ${fulfillmentStatus}`,
    });
  };
  
  // Handle inventory update
  const handleInventoryUpdate = () => {
    onUpdateOrder(order.id, { inventoryUpdated: true });
    
    toast({
      title: "Inventory updated",
      description: "Inventory has been updated for this order",
    });
  };
  
  // Handle notes update
  const handleUpdateNotes = () => {
    setIsSaving(true);
    
    try {
      onUpdateOrder(order.id, { notes });
      
      toast({
        title: "Notes updated",
        description: "Order notes have been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Generate shipping label
  const handleGenerateLabel = async () => {
    try {
      const labelUrl = await generateShippingLabel(order);
      
      onUpdateOrder(order.id, { 
        shippingLabelGenerated: true,
        trackingNumber: labelUrl.split("-").pop() || order.trackingNumber
      });
      
      toast({
        title: "Label generated",
        description: "Shipping label has been generated successfully",
      });
      
      // Open label in new window
      window.open(labelUrl, "_blank");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate shipping label",
        variant: "destructive",
      });
    }
  };
  
  // Send order status notification
  const handleSendNotification = async () => {
    setIsSendingEmail(true);
    
    try {
      const result = await sendOrderStatusUpdateEmail(order);
      
      if (result.success) {
        onUpdateOrder(order.id, {
          lastEmailNotification: {
            status: order.status,
            date: new Date().toISOString()
          }
        });
        
        toast({
          title: "Email sent",
          description: "Status notification email has been sent",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email notification",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto">
      <div className="relative bg-background rounded-lg shadow-lg border max-w-4xl w-full mx-4">
        <div className="sticky top-0 z-20 bg-background rounded-t-lg border-b flex items-center justify-between p-4">
          <div>
            <h2 className="text-xl font-semibold">Order #{order.id}</h2>
            <p className="text-sm text-muted-foreground">
              {new Date(order.date).toLocaleDateString()} · {order.customer.name} · ₹{(order.total / 100).toFixed(2)}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XCircle className="h-5 w-5" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="fulfillment">Fulfillment</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="notes">Notes & History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Order Status</h3>
                    <OrderStatusHandler
                      orderId={order.id}
                      currentStatus={order.status}
                      onUpdateStatus={handleStatusUpdate}
                    />
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Order Items</h3>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.variant.size}, {item.variant.color} (x{item.quantity})
                            </p>
                          </div>
                          <p className="font-medium">₹{(item.price / 100).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{(order.subtotal / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>₹{(order.shipping / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1">
                      <span>Total</span>
                      <span>₹{(order.total / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground pt-1">
                      <span>Payment Method</span>
                      <span>{order.paymentMethod}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <div className="text-sm">
                      <p>{order.shippingAddress.street}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Billing Address</h3>
                    <div className="text-sm">
                      <p>{order.billingAddress.street}</p>
                      <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</p>
                      <p>{order.billingAddress.country}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex gap-1 items-center"
                      onClick={handleGenerateLabel}
                      disabled={order.shippingLabelGenerated}
                    >
                      <Printer className="h-4 w-4" />
                      {order.shippingLabelGenerated ? "Label Generated" : "Generate Label"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex gap-1 items-center"
                      onClick={handleInventoryUpdate}
                      disabled={order.inventoryUpdated}
                    >
                      <RefreshCw className="h-4 w-4" />
                      {order.inventoryUpdated ? "Inventory Updated" : "Update Inventory"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex gap-1 items-center"
                      onClick={handleSendNotification}
                      disabled={isSendingEmail}
                    >
                      <Mail className="h-4 w-4" />
                      {isSendingEmail ? "Sending..." : "Send Notification"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex gap-1 items-center"
                    >
                      <FileText className="h-4 w-4" />
                      Print Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="fulfillment" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <OrderFulfillmentTracker 
                  order={order}
                  onUpdate={handleFulfillmentUpdate}
                />
              </CardContent>
            </Card>

            {order.trackingNumber && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">Tracking Information</h3>
                  <div className="space-y-2">
                    <div>
                      <Label>Tracking Number</Label>
                      <div className="text-lg font-mono">{order.trackingNumber}</div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleGenerateLabel}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print Shipping Label
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Email Notifications</h3>
                {order.lastEmailNotification ? (
                  <div className="space-y-2">
                    <p><strong>Last Sent:</strong> {new Date(order.lastEmailNotification.date).toLocaleString()}</p>
                    <p><strong>Status:</strong> <StatusBadge status={order.lastEmailNotification.status} /></p>
                    <Button 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={handleSendNotification}
                      disabled={isSendingEmail}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      {isSendingEmail ? "Sending..." : "Send Status Update Email"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-muted-foreground">No notification emails have been sent yet.</p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleSendNotification}
                      disabled={isSendingEmail}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      {isSendingEmail ? "Sending..." : "Send Initial Notification"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customer" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  <div className="space-y-1">
                    <p><strong>Name:</strong> {order.customer.name}</p>
                    <p><strong>Email:</strong> {order.customer.email}</p>
                    <p><strong>Phone:</strong> {order.customer.phone || "Not provided"}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium mb-2">Customer History</h3>
                  {order.customer.purchaseCount ? (
                    <div className="space-y-1">
                      <p><strong>Total Orders:</strong> {order.customer.purchaseCount}</p>
                      <p><strong>Customer Since:</strong> {order.customer.joinedDate ? new Date(order.customer.joinedDate).toLocaleDateString() : "Unknown"}</p>
                      <p><strong>Last Purchase:</strong> {order.customer.lastPurchaseDate ? new Date(order.customer.lastPurchaseDate).toLocaleDateString() : "N/A"}</p>
                      <p><strong>Lifetime Value:</strong> ₹{order.customer.lifetimeValue ? (order.customer.lifetimeValue / 100).toFixed(2) : "0.00"}</p>
                      {order.customer.segment && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Customer Segment</p>
                          <div className="mt-1">
                            {order.customer.segment === "new" && (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                New Customer
                              </Badge>
                            )}
                            {order.customer.segment === "regular" && (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                Regular Customer
                              </Badge>
                            )}
                            {order.customer.segment === "loyal" && (
                              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                                Loyal Customer
                              </Badge>
                            )}
                            {order.customer.segment === "vip" && (
                              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                                VIP Customer
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No purchase history available for this customer.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Order Notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[150px] resize-none mt-1"
                      placeholder="Add notes about this order..."
                    />
                    <div className="flex justify-end mt-2">
                      <Button 
                        onClick={handleUpdateNotes} 
                        disabled={isSaving || notes === order.notes}
                      >
                        {isSaving ? "Saving..." : "Save Notes"}
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Order Timeline</h3>
                    <div className="space-y-4">
                      <div className="border-l-2 border-border pl-4 relative">
                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px]"></div>
                        <p className="font-medium">Order Created</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleString()}
                        </p>
                      </div>
                      
                      {order.fulfillmentStatus && order.fulfillmentStatus !== "Pending" && (
                        <div className="border-l-2 border-border pl-4 relative">
                          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px]"></div>
                          <p className="font-medium">Fulfillment Status: {order.fulfillmentStatus}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date().toLocaleString()}
                          </p>
                        </div>
                      )}
                      
                      {order.shippingLabelGenerated && (
                        <div className="border-l-2 border-border pl-4 relative">
                          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px]"></div>
                          <p className="font-medium">Shipping Label Generated</p>
                          <p className="text-sm text-muted-foreground">
                            Tracking #: {order.trackingNumber}
                          </p>
                        </div>
                      )}
                      
                      {order.inventoryUpdated && (
                        <div className="border-l-2 border-border pl-4 relative">
                          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px]"></div>
                          <p className="font-medium">Inventory Updated</p>
                        </div>
                      )}
                      
                      {order.lastEmailNotification && (
                        <div className="border-l-2 border-border pl-4 relative">
                          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px]"></div>
                          <p className="font-medium">Notification Email Sent</p>
                          <p className="text-sm text-muted-foreground">
                            Status: {order.lastEmailNotification.status}, 
                            Date: {new Date(order.lastEmailNotification.date).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
