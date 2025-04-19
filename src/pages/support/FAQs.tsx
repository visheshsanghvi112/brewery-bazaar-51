
import React from "react";
import { motion } from "framer-motion";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const FAQs = () => {
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
              Frequently Asked Questions
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Get answers to all your common questions about our products and services.
            </motion.p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-10 w-24 h-24 rounded-full bg-primary/5 animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-primary/5 animate-float"></div>
      </section>

      {/* FAQs Content */}
      <section className="py-16 container mx-auto px-4">
        <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            <CardDescription>Find answers to our most commonly asked questions.</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              animate="visible"
              className="mt-4"
            >
              <Accordion type="single" collapsible className="w-full">
                <motion.div variants={itemAnimation}>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How long will my order take to arrive?</AccordionTrigger>
                    <AccordionContent>
                      <p>Orders typically take 3-5 business days to arrive within India. International shipping may take 7-14 business days depending on the destination country. You can check the status of your order in your account or use our order tracking feature.</p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
                
                <motion.div variants={itemAnimation}>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>What is your return policy?</AccordionTrigger>
                    <AccordionContent>
                      <p>We accept returns within 30 days of delivery for unworn items in original packaging. Initiating a return is easy - just login to your account, find your order, and select "Return Items". For more details, please see our Returns & Exchanges section.</p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
                
                <motion.div variants={itemAnimation}>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>How do I find my size?</AccordionTrigger>
                    <AccordionContent>
                      <p>You can refer to our detailed size guide to find your perfect fit. Each product page also includes specific sizing information. If you're between sizes, we generally recommend sizing up for a more comfortable fit.</p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
                
                <motion.div variants={itemAnimation}>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Do you ship internationally?</AccordionTrigger>
                    <AccordionContent>
                      <p>Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can see shipping costs during checkout before completing your purchase.</p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
                
                <motion.div variants={itemAnimation}>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>How do I care for my Brewery clothing?</AccordionTrigger>
                    <AccordionContent>
                      <p>For most items, we recommend machine washing in cold water and air drying to maintain the quality and longevity of your garments. Specific care instructions are included on the tag of each item and on product pages.</p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
                
                <motion.div variants={itemAnimation}>
                  <AccordionItem value="item-6">
                    <AccordionTrigger>Are your products sustainable?</AccordionTrigger>
                    <AccordionContent>
                      <p>Sustainability is a priority for us. We use eco-friendly materials where possible and are continuously working to improve our manufacturing processes. Our packaging is made from recycled materials and is recyclable.</p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
                
                <motion.div variants={itemAnimation}>
                  <AccordionItem value="item-7">
                    <AccordionTrigger>Can I modify or cancel my order?</AccordionTrigger>
                    <AccordionContent>
                      <p>Orders can be modified or canceled within 1 hour of placing them. For assistance, please contact our customer service team as soon as possible. Once an order has been processed for shipping, it cannot be modified or canceled.</p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              </Accordion>
            </motion.div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default FAQs;
