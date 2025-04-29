
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";
import { Product } from '@/types';
import { SearchFilter } from './product/SearchFilter';
import { ProductGrid } from './product/ProductGrid';

interface ProductsTabContentProps {
  products: Product[];
  filteredProducts: Product[];
  categories: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string | null;
  setFilterCategory: (category: string | null) => void;
  handleAddProduct: () => void;
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (productId: string) => void;
  isLoading?: boolean;
}

export function ProductsTabContent({
  products,
  filteredProducts,
  categories,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  handleAddProduct,
  handleEditProduct,
  handleDeleteProduct,
  isLoading = false
}: ProductsTabContentProps) {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          categories={categories}
        />
        
        <Button onClick={handleAddProduct} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8 bg-muted/30 rounded-lg p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Processing... Please wait</p>
          </div>
        </div>
      ) : (
        <ProductGrid
          products={filteredProducts}
          categories={categories}
          handleEditProduct={handleEditProduct}
          handleDeleteProduct={handleDeleteProduct}
        />
      )}
    </motion.div>
  );
}
