
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order, Product } from "@/types";

interface DashboardCardsProps {
  orders: Order[];
  products: Product[];
  categories: { name: string; slug: string }[];
  customers: any[];
}

export const DashboardCards = ({ orders, products, categories, customers }: DashboardCardsProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
    >
      <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {orders.length} orders processed
          </p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden bg-gradient-to-br from-orange-500/5 to-orange-500/10 hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{orders.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {orders.filter(o => o.status === "Processing").length} pending
          </p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden bg-gradient-to-br from-blue-500/5 to-blue-500/10 hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{products.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            In {categories.length} categories
          </p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden bg-gradient-to-br from-green-500/5 to-green-500/10 hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{customers.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {customers.filter(c => c.orders > 0).length} active
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
