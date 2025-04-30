
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useCompare } from "@/contexts/CompareContext";
import { Compare, X } from "lucide-react";
import { ProductComparisonTable } from "./ProductComparisonTable";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function CompareDrawer() {
  const { compareItems, compareCount, clearCompare } = useCompare();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Auto-open drawer when first item is added
  useEffect(() => {
    if (compareCount === 1) {
      setOpen(true);
    }
  }, [compareCount]);
  
  if (compareCount === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button 
            className="rounded-full shadow-lg flex items-center gap-2"
            size={isMobile ? "sm" : "default"}
          >
            <Compare className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
            <span>Compare</span>
            <Badge 
              variant="secondary" 
              className="text-xs bg-primary-foreground text-primary"
            >
              {compareCount}
            </Badge>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Product Comparison</DrawerTitle>
            <DrawerDescription>
              Compare up to 4 products side by side
            </DrawerDescription>
          </DrawerHeader>
          {compareItems.length > 0 ? (
            <div className="px-4 overflow-auto">
              <ProductComparisonTable products={compareItems} />
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Add products to compare them
            </div>
          )}
          <DrawerFooter className="pt-2">
            <Button variant="outline" onClick={clearCompare}>
              Clear All
            </Button>
            <DrawerClose asChild>
              <Button variant="ghost">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
