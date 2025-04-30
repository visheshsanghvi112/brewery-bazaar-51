
import { Product } from "@/types";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/data";
import { Grid3X3, LayoutList } from "lucide-react";
import { EnhancedProductCard } from "./EnhancedProductCard";
import { QuickViewModal } from "./QuickViewModal";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface EnhancedProductGridProps {
  filteredProducts: Product[];
  isMobile: boolean;
  handleCategoryChange: (category: string | null) => void;
}

export function EnhancedProductGrid({ 
  filteredProducts, 
  isMobile,
  handleCategoryChange
}: EnhancedProductGridProps) {
  // State for view mode (grid or list)
  const [viewMode, setViewMode] = useLocalStorage<"grid" | "list">("product-view-mode", "grid");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

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

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

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
              <Button 
                variant={viewMode === "grid" ? "default" : "ghost"} 
                size="icon" 
                className={!isMobile ? "flex" : "hidden md:flex"}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "ghost"} 
                size="icon" 
                className={!isMobile ? "flex" : "hidden md:flex"}
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className={`grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${isMobile ? '' : 'gap-6'}`}>
              {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariant}>
                  <EnhancedProductCard 
                    product={product} 
                    isMobile={isMobile} 
                    onQuickView={handleQuickView}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <motion.div 
                  key={product.id} 
                  variants={itemVariant}
                  className="bg-white dark:bg-card rounded-lg shadow p-4"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/4">
                      <div className="aspect-square relative rounded-md overflow-hidden">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="object-cover w-full h-full"
                        />
                        {product.originalPrice && (
                          <div className="absolute top-2 left-2 bg-black text-white text-xs font-medium px-2 py-1 rounded">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1 capitalize">
                          {product.category.replace('-', ' ')}
                        </div>
                        <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.rating)
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({product.reviews})
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <span className="font-medium text-lg">
                            ₹{(product.price / 100).toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-muted-foreground line-through">
                              ₹{(product.originalPrice / 100).toFixed(2)}
                            </span>
                          )}
                        </div>
                        
                        {product.variants.length > 0 && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm">Available sizes:</span>
                            <div className="flex gap-1">
                              {[...new Set(product.variants.map(v => v.size))].map(size => (
                                <span key={size} className="text-xs bg-muted px-2 py-1 rounded">
                                  {size}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Button asChild className="flex-1 md:flex-none">
                          <Link to={`/products/${product.id}`}>View Details</Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={(e) => {
                            e.preventDefault();
                            handleQuickView(product);
                          }}
                          className="flex-1 md:flex-none"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Quick View
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
      
      {/* Quick View Modal */}
      <QuickViewModal 
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </motion.div>
  );
}
