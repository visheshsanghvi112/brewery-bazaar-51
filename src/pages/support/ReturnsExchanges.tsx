
import React from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const ReturnsExchanges = () => {
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
              Returns & Exchanges
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Our policies to ensure your satisfaction with every purchase.
            </motion.p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-10 w-24 h-24 rounded-full bg-primary/5 animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-primary/5 animate-float"></div>
      </section>

      {/* Returns & Exchanges Content */}
      <section className="py-16 container mx-auto px-4">
        <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Returns & Exchanges</CardTitle>
            <CardDescription>Our policies to ensure your satisfaction with every purchase.</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemAnimation} className="space-y-4">
                <h3 className="text-lg font-semibold">Return Policy</h3>
                <div className="p-4 rounded-lg border bg-card/80 space-y-4">
                  <p>We want you to be completely satisfied with your purchase. If you're not, we offer a hassle-free return policy:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li className="font-medium">Items can be returned within 7 days of delivery (updated policy)</li>
                    <li>Products must be unworn, unwashed, and in original packaging</li>
                    <li>Tags must still be attached</li>
                    <li>Sale items are final sale and cannot be returned (exchanges may be possible)</li>
                  </ul>
                </div>
              </motion.div>

              <motion.div variants={itemAnimation} className="space-y-4">
                <h3 className="text-lg font-semibold">Exchange Process</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border bg-card/80 text-center flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <span className="font-semibold">1</span>
                      </div>
                      <h4 className="font-medium mb-2">Initiate Exchange</h4>
                      <p className="text-sm text-muted-foreground">Log into your account and select "Exchange Items" from your order history within 7 days of delivery.</p>
                    </div>
                    <div className="p-4 rounded-lg border bg-card/80 text-center flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <span className="font-semibold">2</span>
                      </div>
                      <h4 className="font-medium mb-2">Return Original Item</h4>
                      <p className="text-sm text-muted-foreground">Use our prepaid shipping label to return your original purchase.</p>
                    </div>
                    <div className="p-4 rounded-lg border bg-card/80 text-center flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <span className="font-semibold">3</span>
                      </div>
                      <h4 className="font-medium mb-2">Receive New Item</h4>
                      <p className="text-sm text-muted-foreground">We'll send your new item as soon as we receive the original.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemAnimation} className="space-y-4">
                <h3 className="text-lg font-semibold">Important Notes About Our 7-Day Return Policy</h3>
                <div className="p-4 rounded-lg border bg-card/80 space-y-4">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>The 7-day period begins from the date the package is delivered, as confirmed by our shipping partner's tracking</li>
                    <li>Return requests must be initiated within the 7-day window; requests after this period will not be accepted</li>
                    <li>For orders with multiple items, each item follows the same 7-day return period from delivery date</li>
                    <li>We recommend initiating returns as soon as possible to ensure processing within the return window</li>
                  </ul>
                </div>
              </motion.div>

              <motion.div variants={itemAnimation} className="space-y-4">
                <h3 className="text-lg font-semibold">Refund Process</h3>
                <div className="p-4 rounded-lg border bg-card/80 space-y-4">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Refunds are processed within 5-7 business days after we receive your return</li>
                    <li>The refund will be issued to the original payment method</li>
                    <li>Shipping costs are non-refundable unless the return is due to our error</li>
                    <li>For items purchased using COD, refunds will be processed through bank transfer</li>
                  </ul>
                </div>
              </motion.div>

              <motion.div variants={itemAnimation} className="space-y-4">
                <h3 className="text-lg font-semibold">Non-Returnable Items</h3>
                <div className="p-4 rounded-lg border bg-card/80 space-y-4">
                  <p>The following items cannot be returned or exchanged:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Items marked as "Final Sale"</li>
                    <li>Items purchased during special promotional events (unless otherwise stated)</li>
                    <li>Personalized or custom-made products</li>
                    <li>Undergarments and swimwear for hygiene reasons</li>
                    <li>Accessories such as jewelry, caps, and socks once package seal is broken</li>
                    <li>Any item that shows signs of wear, altered, or washed</li>
                  </ul>
                </div>
              </motion.div>

              <motion.div variants={itemAnimation} className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Us</h3>
                <div className="p-4 rounded-lg border bg-card/80">
                  <p>If you have any questions about returns or exchanges, please contact our customer service team:</p>
                  <p className="mt-2">
                    <a href="mailto:returns@brewery.com" className="text-primary hover:underline">
                      returns@brewery.com
                    </a> or call <a href="tel:+919876543210" className="text-primary hover:underline">+91 98765 43210</a>
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ReturnsExchanges;
