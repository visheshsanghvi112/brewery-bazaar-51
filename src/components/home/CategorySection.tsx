
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Category } from "@/types";

interface CategorySectionProps {
  filteredCategories: Category[];
}

export default function CategorySection({ filteredCategories }: CategorySectionProps) {
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
      className="hidden md:block py-16 bg-gradient-to-bl from-secondary/30 to-background"
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          variants={fadeIn}
          className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
        >
          Shop by Category
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={fadeIn}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/products?category=${category.slug}`}
                className="group block relative overflow-hidden aspect-video rounded-lg shadow-lg"
              >
                <img 
                  src={category.slug === "t-shirts" 
                    ? "https://images.unsplash.com/photo-1564859228273-274232fdb516?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    : "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  }
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                    <Button size="sm" variant="outline" className="bg-white/20 text-white border-white/40 hover:bg-white/30 group-hover:translate-x-2 transition-transform">
                      Shop Now
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
