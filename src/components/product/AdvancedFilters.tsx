
import React, { useState } from 'react';
import { FilterState } from '@/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { categories } from '@/lib/data';

// Define constants for sizes and colors
const sizes = ["XS", "S", "M", "L", "XL"];

const colors = [
  { name: "Black", code: "#000000" },
  { name: "White", code: "#FFFFFF" },
  { name: "Navy", code: "#000080" },
  { name: "Gray", code: "#808080" },
  { name: "Red", code: "#FF0000" },
  { name: "Blue", code: "#0000FF" },
  { name: "Green", code: "#008000" },
  { name: "Yellow", code: "#FFFF00" },
  { name: "Purple", code: "#800080" },
  { name: "Pink", code: "#FFC0CB" },
  { name: "Orange", code: "#FFA500" },
  { name: "Brown", code: "#A52A2A" },
  { name: "Turquoise", code: "#40E0D0" },
  { name: "Gold", code: "#FFD700" },
  { name: "Silver", code: "#C0C0C0" }
];

interface AdvancedFiltersProps {
  filters: FilterState;
  showFilters: boolean;
  isMobile: boolean;
  onCategoryChange: (category: string | null) => void;
  onPriceChange: (values: number[]) => void;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onClearFilters: () => void;
  onToggleFilters: () => void;
  onSaveFilter?: (name: string) => void;
}

export function AdvancedFilters({
  filters,
  showFilters,
  isMobile,
  onCategoryChange,
  onPriceChange,
  onSizeChange,
  onColorChange,
  onClearFilters,
  onToggleFilters,
  onSaveFilter
}: AdvancedFiltersProps) {
  // Only show t-shirts and shorts categories
  const filteredCategories = categories.filter(
    category => category.slug === "t-shirts" || category.slug === "shorts"
  );

  const [minPrice, setMinPrice] = useState<string>(filters.price[0].toString());
  const [maxPrice, setMaxPrice] = useState<string>(filters.price[1].toString());
  const [filterName, setFilterName] = useState("");
  const [selectedMultipleColors, setSelectedMultipleColors] = useState<string[]>(
    filters.color ? [filters.color] : []
  );

  // For handling multiple color selections
  const toggleColor = (color: string) => {
    if (selectedMultipleColors.includes(color)) {
      setSelectedMultipleColors(selectedMultipleColors.filter(c => c !== color));
    } else {
      setSelectedMultipleColors([...selectedMultipleColors, color]);
    }
    // Still use the single color filter for now
    onColorChange(color);
  };

  const handlePriceInputChange = () => {
    const min = parseInt(minPrice) || 10;
    const max = parseInt(maxPrice) || 10000;
    
    if (min > 0 && max >= min) {
      onPriceChange([min, max]);
    }
  };

  const handleSaveFilter = () => {
    if (filterName.trim() && onSaveFilter) {
      onSaveFilter(filterName);
      setFilterName("");
    }
  };

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
            <span>Filters</span>
            {showFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          
          {(filters.category || filters.size || filters.color || filters.price[0] > 10 || filters.price[1] < 10000) && (
            <Button 
              variant="ghost" 
              onClick={onClearFilters}
              className="text-sm flex items-center gap-1 hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      )}
      
      {/* Filters sidebar with improved styling */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 space-y-3 bg-card/30 p-4 rounded-lg border border-border/50 backdrop-blur-sm`}
      >
        <div className="hidden lg:flex justify-between items-center mb-4">
          <h2 className="font-medium">Filters</h2>
          {(filters.category || filters.size || filters.color || filters.price[0] > 10 || filters.price[1] < 10000) && (
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

        <Accordion type="multiple" defaultValue={["category", "price", "size", "color"]} className="space-y-2">
          {/* Categories filter */}
          <AccordionItem value="category" className="border-b">
            <AccordionTrigger className="py-2">Categories</AccordionTrigger>
            <AccordionContent>
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
            </AccordionContent>
          </AccordionItem>
          
          {/* Price filter with range inputs */}
          <AccordionItem value="price" className="border-b">
            <AccordionTrigger className="py-2">Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 px-2">
                <div className="flex gap-4 items-center">
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="min-price" className="text-xs">Min</Label>
                    <div className="flex items-center">
                      <span className="text-xs mr-1">₹</span>
                      <Input
                        id="min-price"
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        onBlur={handlePriceInputChange}
                        className="h-8"
                        min="10"
                      />
                    </div>
                  </div>
                  <div className="pt-5">-</div>
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="max-price" className="text-xs">Max</Label>
                    <div className="flex items-center">
                      <span className="text-xs mr-1">₹</span>
                      <Input
                        id="max-price"
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        onBlur={handlePriceInputChange}
                        className="h-8"
                        max="100000"
                      />
                    </div>
                  </div>
                </div>
                
                <Slider
                  value={filters.price}
                  min={10}
                  max={10000}
                  step={100}
                  onValueChange={onPriceChange}
                  className="my-6"
                />
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{(filters.price[0]).toFixed(0)}</span>
                  <span>₹{(filters.price[1]).toFixed(0)}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Size filter */}
          <AccordionItem value="size" className="border-b">
            <AccordionTrigger className="py-2">Size</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-4 gap-2 px-2">
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
            </AccordionContent>
          </AccordionItem>
          
          {/* Color filter */}
          <AccordionItem value="color" className="border-b">
            <AccordionTrigger className="py-2">Color</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-3 px-2">
                {colors.map((color) => (
                  <div key={color.name} className="flex flex-col items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onColorChange(color.name)}
                      className={`w-8 h-8 rounded-full transition-all border relative ${
                        filters.color === color.name 
                          ? "ring-2 ring-primary ring-offset-2" 
                          : "ring-1 ring-border"
                      }`}
                      style={{ backgroundColor: color.code }}
                    >
                      {filters.color === color.name && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check className={`h-3 w-3 ${['White', 'Yellow', 'Silver', 'Gold'].includes(color.name) ? 'text-black' : 'text-white'}`} />
                        </span>
                      )}
                    </motion.button>
                    <span className="text-xs">{color.name}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Save Filter (only show when there are active filters) */}
          {(filters.category || filters.size || filters.color || filters.price[0] > 10 || filters.price[1] < 10000) && onSaveFilter && (
            <AccordionItem value="save" className="border-b">
              <AccordionTrigger className="py-2">Save Filter</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 px-2">
                  <div className="space-y-1">
                    <Label htmlFor="filter-name" className="text-xs">Filter Name</Label>
                    <Input
                      id="filter-name"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      className="h-8"
                      placeholder="e.g. My Favorite Colors"
                    />
                  </div>
                  <Button
                    onClick={handleSaveFilter}
                    className="w-full h-8 mt-2"
                    size="sm"
                    disabled={!filterName.trim()}
                  >
                    Save Current Filter
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </motion.div>
    </>
  );
}
