
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductVariant } from "@/types";
import { X } from "lucide-react";

interface ProductVariantManagerProps {
  variants: ProductVariant[];
  handleRemoveVariant: (variantId: string) => void;
  handleVariantChange: (variantId: string, field: keyof ProductVariant, value: any) => void;
  colorOptions: { name: string; code: string }[];
}

export const ProductVariantManager = ({
  variants,
  handleRemoveVariant,
  handleVariantChange,
  colorOptions
}: ProductVariantManagerProps) => {
  return (
    <div className="space-y-4">
      {variants?.map((variant, idx) => (
        <div key={variant.id} className="p-4 border rounded-md bg-muted/20 relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 hover:bg-destructive/10 text-destructive"
            onClick={() => handleRemoveVariant(variant.id)}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor={`size-${variant.id}`}>Size</Label>
              <Select 
                value={variant.size} 
                onValueChange={(value) => handleVariantChange(variant.id, 'size', value)}
              >
                <SelectTrigger id={`size-${variant.id}`}>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                  <SelectItem value="XXL">XXL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`color-${variant.id}`}>Color</Label>
              <Select 
                value={variant.color} 
                onValueChange={(value) => {
                  const colorOption = colorOptions.find(c => c.name === value);
                  handleVariantChange(variant.id, 'color', value);
                  if (colorOption) {
                    handleVariantChange(variant.id, 'colorCode', colorOption.code);
                  }
                }}
              >
                <SelectTrigger id={`color-${variant.id}`}>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map(color => (
                    <SelectItem key={color.name} value={color.name}>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.code }}></div>
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`colorCode-${variant.id}`}>Color Code</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded-md border"
                  style={{ backgroundColor: variant.colorCode }}
                ></div>
                <Input
                  id={`colorCode-${variant.id}`}
                  value={variant.colorCode}
                  onChange={(e) => handleVariantChange(variant.id, 'colorCode', e.target.value)}
                  placeholder="#000000"
                  className="focus:ring-primary/30"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`stock-${variant.id}`}>Stock</Label>
              <Input
                id={`stock-${variant.id}`}
                type="number"
                value={variant.stock}
                onChange={(e) => handleVariantChange(variant.id, 'stock', Number(e.target.value))}
                placeholder="0"
                className="focus:ring-primary/30"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
