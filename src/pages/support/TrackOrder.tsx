
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowRight, Search, Package, Truck, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/integrations/firebase/client";
import { collection, query, where, getDocs } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/constants";

const TrackOrder = () => {
  const { toast } = useToast();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderState, setOrderState] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid tracking number",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    try {
      const ordersRef = collection(db, COLLECTIONS.ORDERS);
      // Query where the 'id' field matches the tracking number
      const q = query(ordersRef, where("id", "==", trackingNumber.trim()));
      const snap = await getDocs(q);

      if (snap.empty) {
        setOrderState(null);
        toast({
          title: "Order Not Found",
          description: "We couldn't find an order with that tracking number.",
          variant: "destructive",
        });
      } else {
        const orderDoc = snap.docs[0].data();
        setOrderState(orderDoc);
        toast({
          title: "Order Found",
          description: `Tracking information for order #${trackingNumber} retrieved.`,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Tracker Offline",
        description: "Unable to reach tracking systems. Try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderTrackerState = (status: string) => {
    const isShipped = status === "Shipped" || status === "Delivered";
    const isDelivered = status === "Delivered";
    const isCancelled = status === "Cancelled";

    if (isCancelled) {
      return (
        <div className="p-4 rounded-lg border-red-500/50 bg-red-500/10 text-red-500 text-center font-semibold">
          This order has been cancelled.
        </div>
      );
    }

    return (
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 space-y-6 md:space-y-0 relative">
         <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 z-0" />
         
         <div className="relative z-10 flex flex-col items-center bg-card p-2 rounded-full text-primary">
           <div className={`h-12 w-12 rounded-full flex items-center justify-center border-2 border-primary bg-primary/10`}>
             <Package className="h-6 w-6" />
           </div>
           <span className="mt-2 text-sm font-medium">Processing</span>
         </div>

         <div className={`relative z-10 flex flex-col items-center bg-card p-2 rounded-full ${isShipped ? 'text-primary' : 'text-muted-foreground'}`}>
           <div className={`h-12 w-12 rounded-full flex items-center justify-center border-2 ${isShipped ? 'border-primary bg-primary/10' : 'border-muted bg-muted'}`}>
             <Truck className="h-6 w-6" />
           </div>
           <span className="mt-2 text-sm font-medium">Shipped</span>
         </div>

         <div className={`relative z-10 flex flex-col items-center bg-card p-2 rounded-full ${isDelivered ? 'text-primary' : 'text-muted-foreground'}`}>
           <div className={`h-12 w-12 rounded-full flex items-center justify-center border-2 ${isDelivered ? 'border-primary bg-primary/10' : 'border-muted bg-muted'}`}>
             <CheckCircle2 className="h-6 w-6" />
           </div>
           <span className="mt-2 text-sm font-medium">Delivered</span>
         </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-background to-secondary/30 border-b border-border">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            >
              Track Your Order
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Enter your order number to track your shipment status perfectly.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Track Order Content */}
      <section className="py-16 container mx-auto px-4">
        <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Search Gateway</CardTitle>
            <CardDescription>Enter your exact BREW- order tag below.</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div variants={itemAnimation} className="p-6 border rounded-lg bg-card/80 flex flex-col justify-center">
                  <form onSubmit={handleTrackOrder} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="tracking-number" className="text-sm font-medium">
                        Tracking Number
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="tracking-number"
                          placeholder="e.g., BREW-1234..."
                          className="pl-10"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full transition-colors"
                      disabled={isSearching}
                    >
                      {isSearching ? 'Scanning Network...' : 'Track Package'}
                      {!isSearching && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>
                </motion.div>

                {orderState && (
                  <motion.div variants={itemAnimation} className="p-6 border rounded-lg bg-card/80">
                    <h3 className="text-lg font-bold mb-4 border-b pb-2">Status Timeline</h3>
                    <p className="text-sm text-muted-foreground">Order Date: {new Date(orderState.date || orderState.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm font-medium mt-1">Current Status: <span className="text-primary">{orderState.status}</span></p>
                    
                    {renderTrackerState(orderState.status)}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default TrackOrder;
