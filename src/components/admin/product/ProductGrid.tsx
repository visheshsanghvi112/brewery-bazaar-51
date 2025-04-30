
import { motion } from "framer-motion";
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { Checkbox } from "@/components/ui/checkbox";

interface ProductGridProps {
  products: Product[];
  categories: any[];
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (productId: string) => void;
  selectedProducts?: Product[];
  onProductSelection?: (product: Product, selected: boolean) => void;
}

export function ProductGrid({
  products,
  categories,
  handleEditProduct,
  handleDeleteProduct,
  selectedProducts = [],
  onProductSelection
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
  
  const isSelected = (product: Product) => {
    return selectedProducts?.some(p => p.id === product.id) || false;
  };
  
  const handleCheckboxChange = (product: Product, checked: boolean) => {
    onProductSelection?.(product, checked);
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
        <div key={product.id} className="relative">
          {onProductSelection && (
            <div className="absolute top-2 left-2 z-10">
              <Checkbox 
                checked={isSelected(product)} 
                onCheckedChange={(checked) => handleCheckboxChange(product, !!checked)} 
                className="h-5 w-5 border-2 bg-background/90 border-primary" 
              />
            </div>
          )}
          <ProductCard
            product={product}
            categories={categories}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
          />
        </div>
      ))}
    </motion.div>
  );
}
