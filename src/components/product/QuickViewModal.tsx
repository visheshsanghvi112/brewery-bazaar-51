
import React from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductVariants } from '@/components/product/ProductVariants';
import { ProductQuantity } from '@/components/product/ProductQuantity';
import { useCart } from '@/contexts/CartContext';
import { Product, ProductVariant } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { toast } = useToast();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Reset state when product changes
  React.useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedSize(product.variants[0].size);
      setSelectedColor(product.variants[0].color);
      setQuantity(1);
    }
  }, [product]);

  const selectedVariant = product?.variants.find(
    (variant) => variant.size === selectedSize && variant.color === selectedColor
  );

  const handleVariantChange = (size: string | null, color: string | null) => {
    setSelectedSize(size);
    setSelectedColor(color);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity(quantity + 1);
    } else if (!selectedVariant) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      addItem(product, selectedVariant, quantity);
      onClose();
    } else {
      toast({
        title: "Please select options",
        description: "Select size and color before adding to cart",
        variant: "destructive",
      });
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6">
            <ProductImageGallery images={product.images} />
          </div>
          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-medium">
                ₹{(product.price / 100).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-muted-foreground line-through">
                  ₹{(product.originalPrice / 100).toFixed(2)}
                </span>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>
            
            <ProductVariants
              variants={product.variants}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onVariantChange={handleVariantChange}
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <ProductQuantity
                quantity={quantity}
                decreaseQuantity={decreaseQuantity}
                increaseQuantity={increaseQuantity}
                maxQuantity={selectedVariant?.stock || 999}
              />
              
              <Button 
                onClick={handleAddToCart} 
                className="flex-1"
                disabled={!selectedVariant}
              >
                Add to Cart
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground mt-2">
              {selectedVariant ? 
                <p>{selectedVariant.stock} in stock</p> : 
                <p>Please select size and color</p>
              }
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
