
import React from 'react';
import { motion } from "framer-motion";
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProductCardProps {
  product: Product;
  categories: any[];
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (productId: string) => void;
}

export function ProductCard({
  product,
  categories,
  handleEditProduct,
  handleDeleteProduct
}: ProductCardProps) {
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.3 } 
    }
  };
  
  const getCategoryName = (slug: string) => {
    const category = categories.find((cat) => cat.slug === slug);
    return category ? category.name : slug;
  };

  const onDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product && product.id) {
      console.log("Delete initiated for product:", product.id);
      handleDeleteProduct(product.id);
    } else {
      console.error("Cannot delete product: Invalid product ID");
    }
  };

  const onEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Edit initiated for product:", product);
    handleEditProduct(product);
  };

  return (
    <motion.div variants={itemVariant}>
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="aspect-square overflow-hidden relative">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="object-cover w-full h-full transition-transform hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          {product.originalPrice && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              Sale
            </div>
          )}
        </div>
        
        <CardContent className="pt-4 flex-1">
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
          
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold">
                ₹{(product.price / 100).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{(product.originalPrice / 100).toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {getCategoryName(product.category)}
            </span>
          </div>
          
          <div className="mt-2">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {product.description || "No description available"}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {product.variants && product.variants.map((variant) => (
              <div
                key={variant.id}
                className="inline-flex items-center border rounded-full px-2 py-0.5 text-xs"
                style={{
                  backgroundColor: `${variant.colorCode}30`,
                  borderColor: `${variant.colorCode}50`
                }}
              >
                {variant.size} / {variant.color}
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            className="w-1/2"
            onClick={onEditClick}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-1/2 ml-2 text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the product "{product.name}" and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDeleteClick}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
