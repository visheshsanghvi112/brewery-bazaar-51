
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { OrderStatus } from "@/types";
import { useAdmin } from "@/hooks/use-admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

export default function Returns() {
  const { orders, requestReturn, returnRequests } = useCart();
  const { toast } = useToast();
  const { isAdmin } = useAdmin();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [returnReason, setReturnReason] = useState("wrong_size");
  const [additionalComments, setAdditionalComments] = useState("");
  const [adminJustification, setAdminJustification] = useState("");
  const [showAdminDialog, setShowAdminDialog] = useState(false);

  const nonCancelledOrders = orders.filter(order => 
    order.status !== 'Cancelled' && 
    order.status !== 'Return Requested' && 
    order.status !== 'Returned'
  );

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrder(orderId);
    setSelectedItems([]);
  };

  const handleItemToggle = (item: any) => {
    if (selectedItems.some(i => i.product.id === item.product.id && i.variant.id === item.variant.id)) {
      setSelectedItems(selectedItems.filter(i => 
        !(i.product.id === item.product.id && i.variant.id === item.variant.id)
      ));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const validateAdminJustification = () => {
    if (adminJustification.trim().length < 25) {
      toast({
        title: "Insufficient Justification",
        description: "Admin must provide a detailed explanation (minimum 25 characters) for processing a return.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleInitiateReturn = () => {
    if (!selectedOrder || selectedItems.length === 0) {
      toast({
        title: "Error",
        description: "Please select an order and at least one item to return",
        variant: "destructive",
      });
      return;
    }

    // If user is admin, show justification dialog instead of submitting directly
    if (isAdmin) {
      setShowAdminDialog(true);
      return;
    }

    // For regular users, process normally
    handleSubmitReturn();
  };

  const handleSubmitReturn = async () => {
    if (!selectedOrder) {
      toast({
        title: "Error",
        description: "Please select an order to return",
        variant: "destructive",
      });
      return;
    }

    if (selectedItems.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one item to return",
        variant: "destructive",
      });
      return;
    }

    // For admins, validate justification
    if (isAdmin) {
      if (!validateAdminJustification()) {
        return;
      }
    }

    // Combine reason and additional comments
    let fullReason = getReasonText(returnReason);
    
    // For regular users
    if (!isAdmin && additionalComments) {
      fullReason += ': ' + additionalComments;
    }
    
    // For admin users, include their justification
    if (isAdmin) {
      fullReason += `: ${additionalComments || ''}\n\nADMIN OVERRIDE: ${adminJustification}`;
    }
    
    try {
      // Request the return and await the promise
      const returnData = await requestReturn(selectedOrder, selectedItems, fullReason);
      
      if (returnData && returnData.id) {
        setSelectedOrder(null);
        setSelectedItems([]);
        setReturnReason("wrong_size");
        setAdditionalComments("");
        setAdminJustification("");
        setShowAdminDialog(false);
      }
    } catch (error) {
      console.error("Error submitting return request:", error);
      toast({
        title: "Error",
        description: "Failed to submit return request",
        variant: "destructive",
      });
    }
  };

  const getReasonText = (code: string) => {
    switch (code) {
      case "wrong_size": return "Wrong size";
      case "damaged": return "Item damaged/defective";
      case "not_as_described": return "Item not as described";
      case "changed_mind": return "Changed mind";
      default: return "Other";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Returns & Exchanges</h1>
        
        <div className="grid gap-8 grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Return Policy</CardTitle>
              <CardDescription>
                You can return items within 30 days of delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How to return an item</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Select the order containing the item(s) you want to return</li>
                      <li>Choose the specific items to return</li>
                      <li>Select a reason for your return</li>
                      <li>Submit your return request</li>
                      <li>Package your item(s) for return</li>
                      <li>Our pick-up team will collect the package on the scheduled date</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Refund Process</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Refunds are processed within 5-7 business days after we receive your return. The money will be returned to your original payment method.</p>
                    <p>For store credit or exchanges, processing time may be shorter.</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Non-Returnable Items</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Items marked as final sale</li>
                      <li>Personalized or custom-made products</li>
                      <li>Intimate apparel for hygiene reasons</li>
                      <li>Items damaged after delivery through customer misuse</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Return Request Form */}
          <Card>
            <CardHeader>
              <CardTitle>Request a Return</CardTitle>
              <CardDescription>
                Select an order and the items you want to return
                {isAdmin && (
                  <span className="block mt-1 text-amber-600 font-medium">
                    ⚠️ Admin users: Special justification required for returns
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {nonCancelledOrders.length > 0 ? (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Step 1: Select Order
                    </label>
                    <Select 
                      value={selectedOrder || ""} 
                      onValueChange={handleOrderSelect}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an order" />
                      </SelectTrigger>
                      <SelectContent>
                        {nonCancelledOrders.map((order) => (
                          <SelectItem key={order.id} value={order.id}>
                            Order #{order.id} - {new Date(order.date).toLocaleDateString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedOrder && (
                    <>
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                          Step 2: Select Items to Return
                        </label>
                        <div className="space-y-3 max-h-60 overflow-y-auto border rounded p-3">
                          {orders
                            .find(order => order.id === selectedOrder)
                            ?.items.map((item, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <Checkbox 
                                  id={`item-${idx}`} 
                                  checked={selectedItems.some(
                                    i => i.product.id === item.product.id && i.variant.id === item.variant.id
                                  )} 
                                  onCheckedChange={() => handleItemToggle(item)}
                                />
                                <div className="grid gap-1.5">
                                  <label
                                    htmlFor={`item-${idx}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {item.product.name} - {item.variant.size}, {item.variant.color}
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    Quantity: {item.quantity} | Price: ${(item.price / 100).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                          Step 3: Return Reason
                        </label>
                        <Select 
                          value={returnReason} 
                          onValueChange={setReturnReason}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wrong_size">Wrong size</SelectItem>
                            <SelectItem value="damaged">Item damaged/defective</SelectItem>
                            <SelectItem value="not_as_described">Item not as described</SelectItem>
                            <SelectItem value="changed_mind">Changed mind</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                          Additional Comments (optional)
                        </label>
                        <Textarea 
                          placeholder="Please provide any additional details about your return"
                          value={additionalComments}
                          onChange={(e) => setAdditionalComments(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="mb-4">You don't have any eligible orders for return</p>
                  <Button asChild>
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </div>
              )}
            </CardContent>
            {selectedOrder && (
              <CardFooter>
                <Button 
                  disabled={selectedItems.length === 0} 
                  onClick={handleInitiateReturn}
                  className="ml-auto"
                >
                  Submit Return Request
                </Button>
              </CardFooter>
            )}
          </Card>

          {/* Admin Return Justification Dialog */}
          <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                  Admin Return Justification Required
                </DialogTitle>
                <DialogDescription>
                  As an administrator, you must provide a detailed explanation for processing this return.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="justification" className="text-left font-medium">
                    Detailed Justification <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="justification"
                    placeholder="Please explain in detail why this return needs to be processed by an admin (minimum 25 characters)"
                    value={adminJustification}
                    onChange={(e) => setAdminJustification(e.target.value)}
                    rows={5}
                    className={`${adminJustification.length < 25 ? 'border-red-300' : ''}`}
                  />
                  {adminJustification.length < 25 && (
                    <p className="text-xs text-red-500">
                      {adminJustification.length} / 25 characters minimum
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAdminDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitReturn}
                  disabled={adminJustification.trim().length < 25}
                >
                  Submit with Justification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Previous Return Requests */}
          {returnRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Return Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="overflow-auto max-h-[300px]">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3">Return ID</th>
                          <th className="text-left p-3">Order ID</th>
                          <th className="text-left p-3">Date</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">Pickup Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {returnRequests.map((request) => (
                          <tr key={request.id} className="border-t hover:bg-muted/30 transition-colors">
                            <td className="p-3">
                              <div className="font-medium">#{request.id}</div>
                            </td>
                            <td className="p-3">#{request.orderId}</td>
                            <td className="p-3">{new Date(request.createdAt).toLocaleDateString()}</td>
                            <td className="p-3">
                              <StatusBadge status={request.status} />
                            </td>
                            <td className="p-3">{new Date(request.scheduledDate).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
