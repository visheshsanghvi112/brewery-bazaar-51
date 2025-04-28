
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { Sparkles, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlist } from "@/hooks/use-wishlist";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { useState } from "react";
import { auth } from "@/integrations/firebase/client";

interface ProductCardProps {
  product: Product;
  isMobile: boolean;
}

export default function ProductCard({ product, isMobile }: ProductCardProps) {
  const { isInWishlist, loading, toggleWishlist } = useWishlist(product.id);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Stop event from bubbling up to Link
    
    if (!auth.currentUser) {
      setShowLoginDialog(true);
      return;
    }

    await toggleWishlist(product.id, product.name);
  };

  return (
    <>
      <Link to={`/products/${product.id}`}>
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
            <Button
              variant="outline"
              size="icon"
              className={`absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white 
                ${isInWishlist ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-gray-700'}
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleWishlistToggle}
              disabled={loading}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </Button>
            {product.featured && (
              <div className="absolute bottom-2 left-2 bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Featured
              </div>
            )}
          </div>
          <CardContent className={`pt-3 ${isMobile ? 'px-2' : 'px-3'}`}>
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
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className={`mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${isMobile ? 'hidden sm:block' : ''}`}
            >
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-primary/30 hover:bg-primary/10"
              >
                View Product
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </Link>
      
      <LoginDialog 
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
    </>
  );
}
