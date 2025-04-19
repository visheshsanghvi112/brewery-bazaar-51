
import React from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Truck } from "lucide-react";

const ShippingInfo = () => {
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
              Shipping Information
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Learn about our shipping policies and delivery times.
            </motion.p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-10 w-24 h-24 rounded-full bg-primary/5 animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-primary/5 animate-float"></div>
      </section>

      {/* Shipping Info Content */}
      <section className="py-16 container mx-auto px-4">
        <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Shipping Information</CardTitle>
            <CardDescription>Everything you need to know about our shipping process.</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemAnimation} className="space-y-4">
                <h3 className="text-lg font-semibold">Delivery Times</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-card/80">
                    <h4 className="font-medium mb-2">Domestic (India)</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>Standard Shipping</span>
                        <span className="text-muted-foreground">3-5 business days</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Express Shipping</span>
                        <span className="text-muted-foreground">1-2 business days</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Same Day Delivery</span>
                        <span className="text-muted-foreground">Available in select cities</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg border bg-card/80">
                    <h4 className="font-medium mb-2">International</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>Standard Shipping</span>
                        <span className="text-muted-foreground">7-14 business days</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Express Shipping</span>
                        <span className="text-muted-foreground">3-5 business days</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemAnimation} className="space-y-4">
                <h3 className="text-lg font-semibold">Shipping Costs</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50 text-left">
                        <th className="p-3 border">Order Value</th>
                        <th className="p-3 border">Standard Shipping</th>
                        <th className="p-3 border">Express Shipping</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border">Under ₹500</td>
                        <td className="p-3 border">₹99</td>
                        <td className="p-3 border">₹199</td>
                      </tr>
                      <tr>
                        <td className="p-3 border">₹500 - ₹999</td>
                        <td className="p-3 border">₹49</td>
                        <td className="p-3 border">₹149</td>
                      </tr>
                      <tr>
                        <td className="p-3 border">₹1000 and above</td>
                        <td className="p-3 border">FREE</td>
                        <td className="p-3 border">₹99</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-muted-foreground">
                  International shipping rates vary by destination and will be calculated at checkout.
                </p>
              </motion.div>

              <motion.div variants={itemAnimation} className="space-y-4">
                <h3 className="text-lg font-semibold">Shipping Policies</h3>
                <div className="space-y-4 text-sm">
                  <div className="p-4 rounded-lg border bg-card/80">
                    <h4 className="font-medium mb-2">Order Processing</h4>
                    <p>Orders are processed within 24 hours of being placed (excluding weekends and holidays).</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card/80">
                    <h4 className="font-medium mb-2">Tracking Your Order</h4>
                    <p>You will receive a tracking number via email once your order ships. You can also track your order in your account or using our Track Order tool.</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card/80">
                    <h4 className="font-medium mb-2">International Customs and Duties</h4>
                    <p>International customers may be subject to import duties and taxes, which are the responsibility of the recipient. These charges are not included in the order total.</p>
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

export default ShippingInfo;
