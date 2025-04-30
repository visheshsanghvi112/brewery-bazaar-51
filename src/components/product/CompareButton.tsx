
import { Button } from "@/components/ui/button";
import { useCompare } from "@/contexts/CompareContext";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CompareButtonProps {
  product: Product;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

// Create a custom Compare icon as LucideReact doesn't have one built-in
const Compare: LucideIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

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
