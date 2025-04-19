
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
import { Clock, ArrowRight, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TrackOrder = () => {
  const { toast } = useToast();
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid tracking number",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would connect to a shipping API
    toast({
      title: "Order Found",
      description: `Tracking information for order #${trackingNumber} is being fetched.`,
    });
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
              Enter your order number to track your shipment status.
            </motion.p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-10 w-24 h-24 rounded-full bg-primary/5 animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-primary/5 animate-float"></div>
      </section>

      {/* Track Order Content */}
      <section className="py-16 container mx-auto px-4">
        <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Track Your Order</CardTitle>
            <CardDescription>Enter your order number to track your shipment.</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemAnimation} className="max-w-md mx-auto p-6 border rounded-lg bg-card/80">
                <form onSubmit={handleTrackOrder} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="tracking-number" className="text-sm font-medium">
                      Order/Tracking Number
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="tracking-number"
                        placeholder="e.g., ORD1234567890"
                        className="pl-10"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 transition-colors"
                  >
                    Track Order
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                
                <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
                  <p>
                    Don't have your order number? Please check your order confirmation email or contact our customer service team.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={itemAnimation} className="space-y-4">
                <h3 className="text-lg font-semibold">Tracking FAQs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-card/80">
                    <h4 className="font-medium mb-2">When will I receive tracking information?</h4>
                    <p className="text-sm text-muted-foreground">You will receive tracking information via email once your order has been shipped, typically within 24-48 hours after placing your order.</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card/80">
                    <h4 className="font-medium mb-2">My tracking doesn't show any updates</h4>
                    <p className="text-sm text-muted-foreground">It may take 24-48 hours after shipping for tracking information to become active. If you continue to see no updates after this time, please contact us.</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card/80">
                    <h4 className="font-medium mb-2">I didn't receive a tracking number</h4>
                    <p className="text-sm text-muted-foreground">Please check your spam or junk folder. If you still can't find it, you can view your tracking information in your account or contact our support team.</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card/80">
                    <h4 className="font-medium mb-2">My package shows delivered but I don't have it</h4>
                    <p className="text-sm text-muted-foreground">Please check with neighbors and around your delivery location. If you still can't locate it, contact our support team within 48 hours.</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default TrackOrder;
