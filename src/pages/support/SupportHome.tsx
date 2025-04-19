
import React from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  HelpCircle, 
  Truck, 
  ArrowLeft, 
  Package, 
  Clock
} from "lucide-react";

const SupportHome = () => {
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
              How Can We Help You?
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Get answers to all your questions about orders, shipping, returns, and more.
            </motion.p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-10 w-24 h-24 rounded-full bg-primary/5 animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-primary/5 animate-float"></div>
      </section>

      {/* Support Category Cards */}
      <section className="py-16 container mx-auto px-4">
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          <motion.div variants={itemAnimation}>
            <Link to="/support/faqs">
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 text-center flex flex-col items-center p-6 hover:border-primary/30">
                <HelpCircle className="h-10 w-10 mb-4 text-primary/80" />
                <CardTitle className="mb-2">FAQs</CardTitle>
                <CardDescription>
                  Find answers to our most commonly asked questions.
                </CardDescription>
              </Card>
            </Link>
          </motion.div>
          
          <motion.div variants={itemAnimation}>
            <Link to="/support/shipping">
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 text-center flex flex-col items-center p-6 hover:border-primary/30">
                <Truck className="h-10 w-10 mb-4 text-primary/80" />
                <CardTitle className="mb-2">Shipping Info</CardTitle>
                <CardDescription>
                  Learn about our shipping policies and delivery times.
                </CardDescription>
              </Card>
            </Link>
          </motion.div>
          
          <motion.div variants={itemAnimation}>
            <Link to="/support/returns">
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 text-center flex flex-col items-center p-6 hover:border-primary/30">
                <ArrowLeft className="h-10 w-10 mb-4 text-primary/80" />
                <CardTitle className="mb-2">Returns & Exchanges</CardTitle>
                <CardDescription>
                  Our policies for returns, refunds, and exchanges.
                </CardDescription>
              </Card>
            </Link>
          </motion.div>
          
          <motion.div variants={itemAnimation}>
            <Link to="/support/size-guide">
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 text-center flex flex-col items-center p-6 hover:border-primary/30">
                <Package className="h-10 w-10 mb-4 text-primary/80" />
                <CardTitle className="mb-2">Size Guide</CardTitle>
                <CardDescription>
                  Find your perfect fit with our size charts.
                </CardDescription>
              </Card>
            </Link>
          </motion.div>
          
          <motion.div variants={itemAnimation}>
            <Link to="/support/track-order">
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 text-center flex flex-col items-center p-6 hover:border-primary/30">
                <Clock className="h-10 w-10 mb-4 text-primary/80" />
                <CardTitle className="mb-2">Track Order</CardTitle>
                <CardDescription>
                  Enter your order number to track your shipment.
                </CardDescription>
              </Card>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default SupportHome;
