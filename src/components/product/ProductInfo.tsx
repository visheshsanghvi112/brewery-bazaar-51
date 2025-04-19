
import React from "react";
import { motion } from "framer-motion";
import { Star, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductInfoProps {
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  description: string;
}

export default function ProductInfo({ 
  name, 
  category, 
  rating, 
  reviews, 
  price, 
  originalPrice, 
  description 
}: ProductInfoProps) {
  // Format price for display
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground uppercase tracking-wider">
          {category.replace('-', ' ')}
        </div>
        <h1 className="text-3xl font-bold">{name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {rating} ({reviews} reviews)
            </span>
          </div>
          <Button variant="ghost" size="sm" className="p-0 h-auto">
            <Share2 className="h-4 w-4 mr-1" />
            <span className="text-sm">Share</span>
          </Button>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <span className="text-2xl font-bold">
            {formatPrice(price)}
          </span>
          {originalPrice && (
            <span className="text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
          {originalPrice && (
            <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded">
              Save {Math.round(((originalPrice - price) / originalPrice) * 100)}%
            </span>
          )}
        </div>
      </div>

      {/* Product Description */}
      <div className="pt-6 border-t">
        <h3 className="font-medium mb-2">Description</h3>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
