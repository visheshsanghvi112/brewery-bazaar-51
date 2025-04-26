
import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { OrdersTabContent } from "@/components/admin/OrdersTabContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order } from "@/types";
import { BarChart, ShoppingCart, Package, Truck } from "lucide-react";

export default function AdminOrders() {
  const { orders, setOrders, setViewingOrder } = useAdmin();
  const [activeTab, setActiveTab] = useState("all");

  // Order counts by status
  const orderCounts = {
    processing: orders.filter(order => order.status === "Processing").length,
    shipped: orders.filter(order => order.status === "Shipped").length,
    delivered: orders.filter(order => order.status === "Delivered").length,
    returned: orders.filter(order => 
      order.status === "Return Requested" || order.status === "Returned"
    ).length
  };
  
  // Filter orders based on active tab
  const getFilteredOrders = () => {
    switch (activeTab) {
      case "processing":
        return orders.filter(order => order.status === "Processing");
      case "shipped":
        return orders.filter(order => order.status === "Shipped");
      case "delivered":
        return orders.filter(order => order.status === "Delivered");
      case "returned":
        return orders.filter(order => 
          order.status === "Return Requested" || order.status === "Returned"
        );
      default:
        return orders;
    }
  };
  
  // Update an order
  const handleUpdateOrder = (orderId: string, updates: Partial<Order>) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, ...updates } : order
    );
    
    setOrders(updatedOrders);
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Orders</h2>
        <div className="flex space-x-2">
          <Card className="shadow-sm bg-white dark:bg-gray-800 p-3">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-lg font-semibold">{orders.length}</p>
              </div>
            </div>
          </Card>
          <Card className="shadow-sm bg-white dark:bg-gray-800 p-3">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-lg font-semibold">{orderCounts.processing}</p>
              </div>
            </div>
          </Card>
          <Card className="shadow-sm bg-white dark:bg-gray-800 p-3">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Shipped</p>
                <p className="text-lg font-semibold">{orderCounts.shipped}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>All Orders ({orders.length})</span>
          </TabsTrigger>
          <TabsTrigger value="processing" className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span>Processing ({orderCounts.processing})</span>
          </TabsTrigger>
          <TabsTrigger value="shipped" className="flex items-center gap-1">
            <Truck className="h-4 w-4" />
            <span>Shipped ({orderCounts.shipped})</span>
          </TabsTrigger>
          <TabsTrigger value="delivered">
            <span>Delivered ({orderCounts.delivered})</span>
          </TabsTrigger>
          <TabsTrigger value="returned">
            <span>Returns ({orderCounts.returned})</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          <OrdersTabContent
            orders={getFilteredOrders()}
            setViewingOrder={setViewingOrder}
            onUpdateOrder={handleUpdateOrder}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
