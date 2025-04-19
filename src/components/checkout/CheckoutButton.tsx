
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CheckoutButtonProps {
  disabled?: boolean;
  total: number;
  className?: string;
}

const CheckoutButton = ({ disabled = false, total, className }: CheckoutButtonProps) => {
  const { toast } = useToast();

  const handleCheckout = () => {
    if (disabled || total === 0) {
      toast({
        title: "Cannot proceed to checkout",
        description: "Your cart is empty. Please add items to your cart first.",
        variant: "destructive"
      });
      return;
    }

    // Redirect to Razorpay payment page
    window.location.href = "https://rzp.io/rzp/I3iwiEk";
  };

  return (
    <Button 
      onClick={handleCheckout}
      disabled={disabled || total === 0}
      className={className}
      size="lg"
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      Proceed to Checkout
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default CheckoutButton;
