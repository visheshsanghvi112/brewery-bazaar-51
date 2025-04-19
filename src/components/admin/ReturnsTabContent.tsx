
import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ReturnsTabContent = () => {
  const [returnRequests, setReturnRequests] = useLocalStorage<any[]>("returnRequests", []);
  const [orders, setOrders] = useLocalStorage<any[]>("orders", []);
  const [viewingReturn, setViewingReturn] = useState<any | null>(null);
  const { toast } = useToast();

  const handleUpdateReturnStatus = (returnId: string, newStatus: string) => {
    // Update the return request status
    const updatedRequests = returnRequests.map(req => {
      if (req.id === returnId) {
        return { ...req, status: newStatus };
      }
      return req;
    });

    setReturnRequests(updatedRequests);
    
    // If the return is complete, also update the order status
    if (newStatus === "Completed") {
      const returnRequest = returnRequests.find(req => req.id === returnId);
      if (returnRequest) {
        const updatedOrders = orders.map(order => {
          if (order.id === returnRequest.orderId) {
            return { ...order, status: "Returned" };
          }
          return order;
        });
        setOrders(updatedOrders);
      }
    }

    toast({
      title: "Return status updated",
      description: `Return #${returnId} status has been updated to ${newStatus}`,
    });
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Returns</CardTitle>
            <CardDescription>
              Manage customer return requests and exchanges.
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search returns..."
                className="pl-8 w-full md:w-[200px] lg:w-[300px]"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="requested">Requested</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewingReturn ? (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium">Return #{viewingReturn.id}</h3>
              <Button variant="outline" onClick={() => setViewingReturn(null)} size="sm">
                Back to List
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Return Details</h4>
                <div className="border rounded-md p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-medium">#{viewingReturn.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Request Date:</span>
                    <span>{new Date(viewingReturn.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pickup Date:</span>
                    <span>{new Date(viewingReturn.scheduledDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <StatusBadge status={viewingReturn.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reason:</span>
                    <span>{viewingReturn.reason}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Customer Information</h4>
                <div className="border rounded-md p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{viewingReturn.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{viewingReturn.customerEmail}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Return Items</h4>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3">Product</th>
                      <th className="text-left p-3">Variant</th>
                      <th className="text-left p-3">Quantity</th>
                      <th className="text-left p-3">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingReturn.items.map((item: any, idx: number) => (
                      <tr key={idx} className="border-t">
                        <td className="p-3">{item.product.name}</td>
                        <td className="p-3">{item.variant.size}, {item.variant.color}</td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3">${(item.price / 100).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h4 className="text-sm font-medium mb-4">Update Return Status</h4>
              <div className="flex gap-3">
                <Select defaultValue={viewingReturn.status}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Requested">Requested</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => handleUpdateReturnStatus(viewingReturn.id, "Approved")}>
                  Update Status
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="overflow-auto max-h-[500px]">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3">Return ID</th>
                    <th className="text-left p-3">Order ID</th>
                    <th className="text-left p-3">Customer</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Pickup Date</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {returnRequests.length > 0 ? (
                    returnRequests.map((request) => (
                      <tr key={request.id} className="border-t hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <div className="font-medium">#{request.id}</div>
                        </td>
                        <td className="p-3">#{request.orderId}</td>
                        <td className="p-3">{request.customerName}</td>
                        <td className="p-3">{new Date(request.createdAt).toLocaleDateString()}</td>
                        <td className="p-3">
                          <StatusBadge status={request.status} />
                        </td>
                        <td className="p-3">{new Date(request.scheduledDate).toLocaleDateString()}</td>
                        <td className="p-3 text-right">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="hover:bg-primary/10"
                            onClick={() => setViewingReturn(request)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-10">
                        <RefreshCw className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-2" />
                        <p className="text-muted-foreground">No return requests found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
