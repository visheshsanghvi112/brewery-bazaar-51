
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/types";

interface ProductFormFieldsProps {
  formProduct: Partial<Product>;
  setFormProduct: (product: Partial<Product>) => void;
  categories: { name: string; slug: string }[];
}

export const ProductFormFields = ({ 
  formProduct, 
  setFormProduct, 
  categories 
}: ProductFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formProduct.name || ""}
            onChange={(e) => setFormProduct({ ...formProduct, name: e.target.value })}
            placeholder="Product name"
            className="focus:ring-primary/30"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={formProduct.category || ""} 
            onValueChange={(value) => setFormProduct({ ...formProduct, category: value })}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formProduct.description || ""}
          onChange={(e) => setFormProduct({ ...formProduct, description: e.target.value })}
          placeholder="Product description"
          className="min-h-[100px] focus:ring-primary/30"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (in ₹)</Label>
          <Input
            id="price"
            type="number"
            value={formProduct.price ? formProduct.price / 100 : ""}
            onChange={(e) => setFormProduct({ ...formProduct, price: Number(e.target.value) * 100 })}
            placeholder="0.00"
            className="focus:ring-primary/30"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="originalPrice">Original Price (in ₹)</Label>
          <Input
            id="originalPrice"
            type="number"
            value={formProduct.originalPrice ? formProduct.originalPrice / 100 : ""}
            onChange={(e) => {
              const value = e.target.value === "" ? null : Number(e.target.value) * 100;
              setFormProduct({ ...formProduct, originalPrice: value });
            }}
            placeholder="0.00"
            className="focus:ring-primary/30"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="inStock">In Stock</Label>
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="inStock"
              checked={formProduct.inStock !== false}
              onCheckedChange={(checked) => setFormProduct({ ...formProduct, inStock: checked })}
            />
            <Label htmlFor="inStock" className="cursor-pointer">
              {formProduct.inStock !== false ? "Available" : "Out of stock"}
            </Label>
          </div>
        </div>
      </div>
    </>
  );
};
