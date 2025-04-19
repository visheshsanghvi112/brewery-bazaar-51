
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import DashboardCharts from "@/components/admin/DashboardCharts";
import CheckoutIntegration from "@/components/admin/CheckoutIntegration";
import { ShoppingCart } from "lucide-react";
import { Order } from "@/types";

interface DashboardTabContentProps {
  orders: Order[];
  setActiveTab: (tab: string) => void;
}

export const DashboardTabContent = ({ orders, setActiveTab }: DashboardTabContentProps) => {
  return (
    <div className="space-y-8">
      <DashboardCharts />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CheckoutIntegration />
        
        {/* Recent Orders */}
        <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              onClick={() => setActiveTab("orders")}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-muted/20 rounded-md">
                  <div>
                    <div className="font-medium">#{order.id}</div>
                    <div className="text-sm text-muted-foreground">{order.customer.name}</div>
                  </div>
                  <div className="text-right">
                    <div>₹{(order.total / 100).toFixed(2)}</div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
              
              {orders.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>No orders yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
