
import React from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/use-admin';
import { Info } from 'lucide-react';

interface ProductActionsProps {
  product: Product;
  selectedVariantId: string;
  quantity: number;
  onAddToCart: () => void;
}

export default function ProductActions({ 
  product, 
  selectedVariantId, 
  quantity, 
  onAddToCart
}: ProductActionsProps) {
  const { toast } = useToast();
  const { isAdmin } = useAdmin();
  
  const selectedVariant = product.variants?.find(v => v.id === selectedVariantId);
  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;

  const handleAddToCart = () => {
    if (isAdmin) {
      toast({
        title: "Admin Mode",
        description: "Admin users cannot add products to cart.",
        variant: "destructive"
      });
      return;
    }
    
    if (isOutOfStock) {
      toast({
        title: "Out of Stock",
        description: "Sorry, this product is currently unavailable.",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedVariantId) {
      toast({
        title: "Selection Required",
        description: "Please select a size and color.",
        variant: "destructive"
      });
      return;
    }
    
    // Call the passed function to handle adding to cart
    onAddToCart();
    
    // Show toast notification
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      <Button 
        onClick={handleAddToCart}
        size="lg"
        disabled={isAdmin || isOutOfStock}
        className="w-full rounded-full font-medium"
      >
        {isAdmin ? (
          <>
            <Info className="mr-2 h-4 w-4" />
            Admin Mode - Can't Add to Cart
          </>
        ) : isOutOfStock ? (
          "Out of Stock"
        ) : (
          "Add to Cart"
        )}
      </Button>
      
      {isAdmin && (
        <p className="text-xs text-muted-foreground text-center">
          Admins cannot place orders. Sign out of admin to shop.
        </p>
      )}
    </div>
  );
}
