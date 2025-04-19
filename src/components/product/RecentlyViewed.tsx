
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { products } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentlyViewedProps {
  formatPrice: (price: number) => string;
}

export default function RecentlyViewed({ formatPrice }: RecentlyViewedProps) {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Simulate fetching recently viewed products
  useEffect(() => {
    // In a real app, you would get this from localStorage or an API
    // For demo purposes, we'll just use a sample of products
    const fetchRecent = () => {
      setTimeout(() => {
        // Get random sample of 4 products
        const randomProducts = [...products]
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
          
        setRecentlyViewed(randomProducts);
        setLoading(false);
      }, 1000);
    };
    
    fetchRecent();
  }, []);
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-3">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (recentlyViewed.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recently viewed products.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {recentlyViewed.map((product, index) => (
        <motion.div
          key={product.id}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ delay: index * 0.1 }}
        >
          <Link to={`/product/${product.id}`}>
            <Card className="group overflow-hidden border shadow hover:shadow-md transition-all">
              <div className="aspect-square bg-muted relative overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardContent className="pt-3 px-3 pb-3">
                <h3 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 my-1">
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
                </div>
                <div className="text-sm font-medium">
                  {formatPrice(product.price)}
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
