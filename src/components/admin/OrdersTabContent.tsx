
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "./StatusBadge";
import { OrderDetailView } from "./OrderDetailView";
import { BatchOrderProcessor } from "./BatchOrderProcessor";
import { Order, OrderStatus } from "@/types";
import { processBatchOrders } from "@/utils/bulkProcessing";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/integrations/firebase/client";
import { doc, updateDoc } from "firebase/firestore";

interface OrdersTabContentProps {
  orders: Order[];
  setViewingOrder: (order: Order | null) => void;
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
  isLoading?: boolean;
}

export const OrdersTabContent = ({ 
  orders, 
  setViewingOrder, 
  onUpdateOrder,
  isLoading = false
}: OrdersTabContentProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [processingAction, setProcessingAction] = useState(false);
  const { toast } = useToast();

  // Filter orders based on search query and status
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Filter by search query
      const matchesSearch = 
        searchQuery === "" ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.customerEmail && order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by status
      const matchesStatus = 
        statusFilter === "all" || 
        order.status?.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Handle view order
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  // Handle close order detail
  const handleCloseOrderDetail = () => {
    setSelectedOrder(null);
  };

  // Handle batch processing
  const handleBatchProcess = async (orderIds: string[], action: string, value?: string) => {
    setProcessingAction(true);
    try {
      // Process orders in batch
      const result = await processBatchOrders(orders, orderIds, action, value);
      
      // Update orders in Firestore
      for (const updatedOrder of result) {
        if (updatedOrder.firestoreId) {
          try {
            const orderRef = doc(db, "orders", updatedOrder.firestoreId);
            await updateDoc(orderRef, {
              status: updatedOrder.status,
              updatedAt: new Date().toISOString()
            });
            console.log(`Updated order ${updatedOrder.id} in Firestore`);
          } catch (error) {
            console.error(`Error updating order ${updatedOrder.id}:`, error);
          }
        }
        
        // Update orders in state
        onUpdateOrder(updatedOrder.id, updatedOrder);
      }
      
      // Show success message
      toast({
        title: "Batch processing complete",
        description: `Successfully processed ${orderIds.length} orders`,
      });
    } catch (error) {
      console.error("Batch processing error:", error);
      
      toast({
        title: "Error",
        description: "An error occurred during batch processing",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  };

  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                View and manage customer orders and shipments.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="return requested">Return Requested</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-2">
            <BatchOrderProcessor
              orders={orders}
              onBatchProcess={handleBatchProcess}
              isProcessing={processingAction}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-auto max-h-[500px]">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3">Order ID</th>
                    <th className="text-left p-3">Customer</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Fulfillment</th>
                    <th className="text-left p-3">Total</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="text-muted-foreground">Loading orders...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="border-t hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <div className="font-medium">#{order.id}</div>
                        </td>
                        <td className="p-3">
                          <div>
                            {order.customer?.name || order.customerName || "Unknown"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.customer?.email || order.customerEmail || ""}
                          </div>
                          {order.userId && (
                            <div className="text-xs text-muted-foreground mt-1">
                              User: {order.userId.slice(0, 8)}...
                            </div>
                          )}
                        </td>
                        <td className="p-3">{new Date(order.date || order.createdAt).toLocaleDateString()}</td>
                        <td className="p-3">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="p-3">
                          {order.fulfillmentStatus || "Pending"}
                        </td>
                        <td className="p-3">₹{(order.total / 100).toFixed(2)}</td>
                        <td className="p-3 text-right">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="hover:bg-primary/10"
                            onClick={() => handleViewOrder(order)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-10">
                        <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-2" />
                        <p className="text-muted-foreground">No orders found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Order Detail View */}
      {selectedOrder && (
        <OrderDetailView
          order={selectedOrder}
          onClose={handleCloseOrderDetail}
          onUpdateOrder={onUpdateOrder}
        />
      )}
    </>
  );
};
