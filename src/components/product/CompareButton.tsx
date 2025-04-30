
import { Button } from "@/components/ui/button";
import { useCompare } from "@/contexts/CompareContext";
import { Product } from "@/types";
import { Compare } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompareButtonProps {
  product: Product;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function CompareButton({ product, variant = "outline", size = "icon", className }: CompareButtonProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  
  const inCompare = isInCompare(product.id);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        "rounded-full",
        inCompare && "bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
      title={inCompare ? "Remove from comparison" : "Add to comparison"}
    >
      <Compare className="h-4 w-4" />
    </Button>
  );
}
