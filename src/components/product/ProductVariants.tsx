
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProductVariant } from "@/types";
import SizeChart from "./SizeChart";

interface ProductVariantsProps {
  variants: ProductVariant[];
  onVariantChange: (size: string | null, color: string | null) => void;
}

export default function ProductVariants({ variants, onVariantChange }: ProductVariantsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Get all available sizes and colors from variants
  const availableSizes = Array.from(
    new Set(variants.map((variant) => variant.size))
  );
  
  const availableColors = Array.from(
    new Set(
      variants.map((variant) => ({
        name: variant.color,
        code: variant.colorCode,
      }))
    ),
    (item) => JSON.stringify(item)
  ).map((item) => JSON.parse(item));

  // Get filtered variants for the selected size/color
  const getAvailableVariants = (
    type: "size" | "color",
    value: string
  ): ProductVariant[] => {
    if (type === "size") {
      return variants.filter((variant) => variant.size === value);
    } else {
      return variants.filter((variant) => variant.color === value);
    }
  };
  
  // Check if a size is available for the selected color
  const isSizeAvailable = (size: string): boolean => {
    if (!selectedColor) return true;
    return getAvailableVariants("color", selectedColor).some(
      (variant) => variant.size === size
    );
  };
  
  // Check if a color is available for the selected size
  const isColorAvailable = (color: string): boolean => {
    if (!selectedSize) return true;
    return getAvailableVariants("size", selectedSize).some(
      (variant) => variant.color === color
    );
  };

  const handleSizeChange = (size: string) => {
    if (isSizeAvailable(size)) {
      setSelectedSize(size);
      
      // If the current color isn't available for this size, reset color
      if (
        selectedColor &&
        !getAvailableVariants("size", size).some(
          (v) => v.color === selectedColor
        )
      ) {
        setSelectedColor(null);
      }

      // Notify parent component
      onVariantChange(size, selectedColor);
    }
  };

  const handleColorChange = (color: string) => {
    if (isColorAvailable(color)) {
      setSelectedColor(color);
      
      // If the current size isn't available for this color, reset size
      if (
        selectedSize &&
        !getAvailableVariants("color", color).some(
          (v) => v.size === selectedSize
        )
      ) {
        setSelectedSize(null);
      }

      // Notify parent component
      onVariantChange(selectedSize, color);
    }
  };

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="font-medium">Size</span>
          <SizeChart />
        </div>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? "default" : "outline"}
              className={`${
                !isSizeAvailable(size)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() => handleSizeChange(size)}
              disabled={!isSizeAvailable(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Color Selection */}
      <div className="space-y-4">
        <span className="font-medium">Color</span>
        <div className="flex flex-wrap gap-3">
          {availableColors.map((color: any) => (
            <div key={color.name} className="flex flex-col items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleColorChange(color.name)}
                disabled={!isColorAvailable(color.name)}
                className={`w-10 h-10 rounded-full transition-all ${
                  !isColorAvailable(color.name)
                    ? "opacity-50 cursor-not-allowed ring-1 ring-border"
                    : selectedColor === color.name
                    ? "ring-2 ring-primary ring-offset-2 scale-110"
                    : "ring-1 ring-border hover:ring-2 hover:ring-primary/50"
                }`}
                style={{ backgroundColor: color.code }}
              />
              <span className="text-xs">{color.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
