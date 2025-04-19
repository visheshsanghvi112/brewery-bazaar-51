
import React from "react";
import { Tags, Sparkles, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
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
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="py-12 md:py-16 bg-gradient-to-tr from-secondary/30 to-background"
    >
      <div className="container mx-auto px-4">
        <motion.div variants={fadeIn} className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Why Choose Brewery?</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            We're more than just a clothing brand. We're a lifestyle, an attitude, and a commitment to quality.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            variants={fadeIn} 
            className="genz-card p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 mb-4">
              <Tags className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Affordable Luxury</h3>
            <p className="text-sm text-muted-foreground">
              Premium quality materials at accessible price points. Style shouldn't break the bank.
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeIn} 
            className="genz-card p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 mb-4">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Unique Designs</h3>
            <p className="text-sm text-muted-foreground">
              Each piece tells a story inspired by Mumbai's rich cultural tapestry.
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeIn} 
            className="genz-card p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 mb-4">
              <Trophy className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Customer Focused</h3>
            <p className="text-sm text-muted-foreground">
              Exceptional shopping experience with attentive customer service.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
