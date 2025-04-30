
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product, ProductVariant } from "@/types";
import { Sparkles, Star, Heart, Eye, ShoppingCart } from 'lucide-react';
import { motion } from "framer-motion";
import { useWishlist } from "@/hooks/use-wishlist";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { useState } from "react";
import { auth } from "@/integrations/firebase/client";
import { useCart } from "@/contexts/CartContext";
import { toast } from 'sonner';

interface EnhancedProductCardProps {
  product: Product;
  isMobile: boolean;
  onQuickView: (product: Product) => void;
}

export function EnhancedProductCard({ product, isMobile, onQuickView }: EnhancedProductCardProps) {
  const { isInWishlist, loading, toggleWishlist } = useWishlist(product.id);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { addItem } = useCart();
  
  // Find the variant with the most stock
  const defaultVariant = product.variants.reduce(
    (prev, current) => (current.stock > prev.stock ? current : prev),
    product.variants[0]
  );

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Stop event from bubbling up to Link
    e.stopPropagation(); // Prevent other handlers from firing
    
    if (!auth.currentUser) {
      setShowLoginDialog(true);
      return;
    }

    await toggleWishlist(product.id, product.name);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop event from bubbling up to Link
    e.stopPropagation(); // Prevent other handlers from firing
    onQuickView(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop event from bubbling up to Link
    e.stopPropagation(); // Prevent other handlers from firing
    
    if (product.variants.length === 0) {
      toast.error("No variants available for this product");
      return;
    }
    
    if (defaultVariant.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }
    
    addItem(product, defaultVariant, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <>
      <div className="group relative">
        <Link to={`/products/${product.id}`}>
          <Card className="overflow-hidden border-none rounded-md shadow-md hover:shadow-xl transition-all duration-300 h-full">
            <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted relative overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
              />
              {product.originalPrice && (
                <div className="absolute top-2 left-2 bg-black text-white text-xs font-medium px-2 py-1 rounded">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </div>
              )}
              
              {/* Quick action buttons */}
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full bg-white/80 backdrop-blur-sm hover:bg-white 
                    ${isInWishlist ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-gray-700'}
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleWishlistToggle}
                  disabled={loading}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-gray-700"
                  onClick={handleQuickView}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              
              {product.featured && (
                <div className="absolute bottom-2 left-2 bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Featured
                </div>
              )}
            </div>
            <CardContent className={`pt-3 ${isMobile ? 'px-2' : 'px-3'} pb-4`}>
              <div className={`text-xs sm:text-sm text-muted-foreground mb-1 capitalize ${isMobile ? 'truncate' : ''}`}>
                {product.category.replace('-', ' ')}
              </div>
              <h3 className={`font-medium mb-1 group-hover:text-primary transition-colors ${isMobile ? 'text-sm truncate' : ''}`}>
                {product.name}
              </h3>
              <div className={`flex items-center gap-1 mb-1 ${isMobile ? 'hidden sm:flex' : ''}`}>
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
                <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>
                  ₹{(product.price / 100).toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className={`text-muted-foreground line-through ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    ₹{(product.originalPrice / 100).toFixed(2)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
        
        {/* Add to cart button that slides up on hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-x-0 bottom-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          <Button 
            variant="default" 
            size="sm" 
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.variants.length === 0 || defaultVariant.stock <= 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </motion.div>
      </div>
      
      <LoginDialog 
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
    </>
  );
}
