
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedProductsProps {
  featuredProducts: Product[];
  formatPrice: (price: number) => string;
  isMobile: boolean;
}

export default function FeaturedProducts({ 
  featuredProducts, 
  formatPrice, 
  isMobile 
}: FeaturedProductsProps) {
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
      className="py-12 md:py-16 bg-gradient-to-tr from-secondary/50 to-background"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <motion.h2 
            variants={fadeIn}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center gap-2"
          >
            <Sparkles className="h-5 w-5 text-primary animate-pulse-glow" />
            Featured Products
          </motion.h2>
          <motion.div variants={fadeIn} className="hidden md:block">
            <Button asChild variant="link" className="group">
              <Link to="/products" className="flex items-center gap-2">
                View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                variants={fadeIn}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/product/${product.id}`}>
                  <Card className="group overflow-hidden border-none rounded-md shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted relative overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                      />
                      {product.originalPrice && (
                        <div className="absolute top-2 left-2 bg-black text-white text-xs font-medium px-2 py-1 rounded">
                          Sale
                        </div>
                      )}
                    </div>
                    <CardContent className="pt-3 pb-0 px-3">
                      <div className="text-xs md:text-sm text-muted-foreground mb-1 capitalize">
                        {product.category.replace('-', ' ')}
                      </div>
                      <h3 className="text-sm md:text-base font-medium mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviews})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm md:text-base">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-muted-foreground line-through text-xs md:text-sm">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-4 text-center py-10">
              <p className="text-muted-foreground">No featured products available at the moment.</p>
            </div>
          )}
        </div>
        
        {/* Mobile View All Products Button */}
        <motion.div 
          className="mt-8 md:hidden" 
          variants={fadeIn}
        >
          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="flex justify-center"
          >
            <Button asChild className="w-full max-w-xs bg-gradient-to-r from-primary to-primary/80 relative overflow-hidden">
              <Link to="/products" className="flex items-center justify-center gap-2">
                <span className="relative z-10">View All Products</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="relative z-10"
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
                <div className="absolute inset-0 bg-shimmer bg-200% animate-shimmer opacity-30"></div>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
