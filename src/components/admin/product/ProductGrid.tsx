
import React from 'react';
import { motion } from "framer-motion";
import { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  categories: any[];
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (productId: string) => void;
}

export function ProductGrid({
  products,
  categories,
  handleEditProduct,
  handleDeleteProduct
}: ProductGridProps) {
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  if (products.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/30 rounded-lg p-6">
        <p className="text-muted-foreground">No products found. Try adjusting your filters.</p>
      </div>
    );
  }
  
  return (
    <motion.div 
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          categories={categories}
          handleEditProduct={handleEditProduct}
          handleDeleteProduct={handleDeleteProduct}
        />
      ))}
    </motion.div>
  );
}
