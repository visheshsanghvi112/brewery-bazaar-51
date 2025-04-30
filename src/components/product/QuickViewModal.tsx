
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductVariants from "@/components/product/ProductVariants";
import ProductQuantity from "@/components/product/ProductQuantity";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  
  if (!product) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        
        <div className="grid gap-6 py-4 md:grid-cols-2">
          <ProductImageGallery product={product} />
          
          <div className="space-y-4">
            <ProductInfo product={product} />
            
            {product.variants.length > 0 && (
              <ProductVariants 
                product={product} 
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
              />
            )}
            
            <ProductQuantity 
              quantity={quantity} 
              setQuantity={setQuantity} 
              max={10}
            />
            
            <div className="pt-4 flex flex-wrap gap-3">
              <Button className="flex-1 sm:flex-none">
                Add to Cart
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none">
                View Full Details
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
