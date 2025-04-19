
import React from "react";
import { ShoppingBag, Star, Truck, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface BrandFeaturesProps {
  isMobile: boolean;
}

export default function BrandFeatures({ isMobile }: BrandFeaturesProps) {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const features = [
    {
      icon: <ShoppingBag className="h-7 w-7 text-primary" />,
      title: "Premium Quality",
      description: "The finest materials"
    },
    {
      icon: <Star className="h-7 w-7 text-primary" />,
      title: "Mumbai Inspired",
      description: "Vibrant city style"
    },
    {
      icon: <Truck className="h-7 w-7 text-primary" />,
      title: "Free Shipping",
      description: "Orders above ₹999"
    },
    {
      icon: <Lock className="h-7 w-7 text-primary" />,
      title: "Secure Checkout",
      description: "Trusted payments"
    }
  ];
  
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="py-16 md:py-20 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/30 -z-10" />
      
      <div className="container mx-auto px-4">
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-8' : 'grid-cols-4 gap-6'} text-center`}>
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={fadeIn} 
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center group hover:scale-105 transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/5 to-primary/15 flex items-center justify-center mb-4 group-hover:from-primary/10 group-hover:to-primary/25 transition-colors shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
