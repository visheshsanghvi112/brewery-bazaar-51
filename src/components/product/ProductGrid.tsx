
import { Product } from "@/types";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/data";
import { Grid3X3, LayoutList } from "lucide-react";

interface ProductGridProps {
  filteredProducts: Product[];
  isMobile: boolean;
  handleCategoryChange: (category: string | null) => void;
}

export default function ProductGrid({ 
  filteredProducts, 
  isMobile,
  handleCategoryChange
}: ProductGridProps) {
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  // Only show t-shirts and shorts categories
  const filteredCategories = categories.filter(
    category => category.slug === "t-shirts" || category.slug === "shorts"
  );

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="flex-1"
    >
      {filteredProducts.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariant}>
                <ProductCard product={product} isMobile={isMobile} />
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <motion.div 
          variants={fadeIn}
          className="text-center py-12 bg-card/30 rounded-lg border border-border/50 backdrop-blur-sm"
        >
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or browse our categories below.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {filteredCategories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                onClick={() => handleCategoryChange(category.slug)}
                className="border-primary/30 hover:bg-primary/10"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
