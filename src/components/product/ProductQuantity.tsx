
import React from "react";
import { Button } from "@/components/ui/button";

interface ProductQuantityProps {
  quantity: number;
  stock?: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export default function ProductQuantity({ 
  quantity, 
  stock, 
  onDecrease, 
  onIncrease 
}: ProductQuantityProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <span className="font-medium">Quantity</span>
        {stock !== undefined && (
          <span
            className={`text-sm ${
              stock < 5
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {stock < 5
              ? `Only ${stock} left!`
              : `${stock} in stock`}
          </span>
        )}
      </div>
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={onDecrease}
          disabled={quantity <= 1}
          className="h-10 w-10"
        >
          -
        </Button>
        <span className="w-16 text-center mx-2">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={onIncrease}
          disabled={
            stock !== undefined ? quantity >= stock : false
          }
          className="h-10 w-10"
        >
          +
        </Button>
      </div>
    </div>
  );
}
