
import { useState } from "react";
import { FilterState } from "@/types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { motion } from "framer-motion";
import { categories } from "@/lib/data";

// Define constants for sizes and colors
const sizes = ["XS", "S", "M", "L", "XL"];

const colors = [
  { name: "Black", code: "#000000" },
  { name: "White", code: "#FFFFFF" },
  { name: "Navy", code: "#000080" },
  { name: "Gray", code: "#808080" },
  { name: "Red", code: "#FF0000" }
];

interface ProductFilterProps {
  filters: FilterState;
  showFilters: boolean;
  isMobile: boolean;
  onCategoryChange: (category: string | null) => void;
  onPriceChange: (values: number[]) => void;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onClearFilters: () => void;
  onToggleFilters: () => void;
}

export default function ProductFilter({
  filters,
  showFilters,
  isMobile,
  onCategoryChange,
  onPriceChange,
  onSizeChange,
  onColorChange,
  onClearFilters,
  onToggleFilters
}: ProductFilterProps) {
  // Only show t-shirts and shorts categories
  const filteredCategories = categories.filter(
    category => category.slug === "t-shirts" || category.slug === "shorts"
  );

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <>
      {/* Mobile filter toggle */}
      {isMobile && (
        <div className="lg:hidden mb-4 flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={onToggleFilters}
            className="flex items-center gap-2 border-primary/30 hover:bg-primary/10"
          >
            <span className="h-4 w-4" />
            Filters
            {showFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          
          {(filters.category || filters.size || filters.color || filters.price[0] > 0 || filters.price[1] < 10000) && (
            <Button 
              variant="ghost" 
              onClick={onClearFilters}
              className="text-sm flex items-center gap-1 hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      )}
      
      {/* Filters sidebar with improved styling */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 space-y-6 bg-card/30 p-4 rounded-lg border border-border/50 backdrop-blur-sm`}
      >
        <div className="hidden lg:flex justify-between items-center mb-4">
          <h2 className="font-medium">Filters</h2>
          {(filters.category || filters.size || filters.color || filters.price[0] > 0 || filters.price[1] < 10000) && (
            <Button 
              variant="ghost" 
              onClick={onClearFilters}
              className="text-sm flex items-center gap-1 hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
        
        {/* Categories filter */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-3 text-foreground/90">Categories</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => onCategoryChange(null)}
                className={`text-sm justify-start px-2 h-8 w-full ${
                  filters.category === null ? "bg-secondary" : ""
                }`}
              >
                All Products
              </Button>
            </div>
            {filteredCategories.map((category) => (
              <div key={category.id} className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={() => onCategoryChange(category.slug)}
                  className={`text-sm justify-start px-2 h-8 w-full ${
                    filters.category === category.slug ? "bg-secondary" : ""
                  }`}
                >
                  {category.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Price filter */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-3 text-foreground/90">Price Range</h3>
          <div className="px-2">
            <Slider
              defaultValue={[0, 10000]}
              max={10000}
              step={100}
              value={filters.price}
              onValueChange={onPriceChange}
              className="my-6"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹{(filters.price[0] / 100).toFixed(2)}</span>
              <span>₹{(filters.price[1] / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Size filter */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-3 text-foreground/90">Size</h3>
          <div className="grid grid-cols-4 gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={filters.size === size ? "default" : "outline"}
                size="sm"
                onClick={() => onSizeChange(size)}
                className={`h-8 ${filters.size === size ? "bg-primary hover:bg-primary/90" : "border-primary/30 hover:bg-primary/10"}`}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Color filter */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-3 text-foreground/90">Color</h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <div key={color.name} className="flex flex-col items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onColorChange(color.name)}
                  className={`w-8 h-8 rounded-full transition-all border ${
                    filters.color === color.name 
                      ? "ring-2 ring-primary ring-offset-2" 
                      : "ring-1 ring-border"
                  }`}
                  style={{ backgroundColor: color.code }}
                />
                <span className="text-xs">{color.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
