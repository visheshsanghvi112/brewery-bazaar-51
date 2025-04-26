
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Product, ProductVariant } from "@/types";
import { Save } from "lucide-react";
import { ProductFormHeader } from "./ProductFormHeader";
import { ProductFormFields } from "./ProductFormFields";
import { ProductImageManager } from "./ProductImageManager";
import { ProductVariantManager } from "./ProductVariantManager";

interface ProductFormDialogProps {
  showProductForm: boolean;
  setShowProductForm: (show: boolean) => void;
  formProduct: Partial<Product>;
  setFormProduct: (product: Partial<Product>) => void;
  editingProduct: Product | null;
  productImages: (File | null)[];
  setProductImages: (images: (File | null)[]) => void;
  productImageUrls: string[];
  categories: { name: string; slug: string }[];
  handleSaveProduct: () => void;
  handleAddVariant: () => void;
  handleRemoveVariant: (variantId: string) => void;
  handleVariantChange: (variantId: string, field: keyof ProductVariant, value: any) => void;
  handleFileChange: (index: number, file: File | null) => void;
  handleRemoveImage: (index: number) => void;
  colorOptions: { name: string; code: string }[];
}

export const ProductFormDialog = ({
  showProductForm,
  setShowProductForm,
  formProduct,
  setFormProduct,
  editingProduct,
  productImages,
  setProductImages,
  productImageUrls,
  categories,
  handleSaveProduct,
  handleAddVariant,
  handleRemoveVariant,
  handleVariantChange,
  handleFileChange,
  handleRemoveImage,
  colorOptions
}: ProductFormDialogProps) => {
  console.log("ProductFormDialog rendered with:", { formProduct, productImageUrls, showProductForm });
  
  return (
    <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-lg">
        <ProductFormHeader editingProduct={editingProduct} />
        
        <div className="grid gap-6 py-4">
          <ProductFormFields 
            formProduct={formProduct}
            setFormProduct={setFormProduct}
            categories={categories}
          />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Product Images</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => setProductImages([...productImages, null])}
              >
                Add Image Slot
              </Button>
            </div>
            
            <ProductImageManager
              productImages={productImages}
              productImageUrls={productImageUrls}
              handleFileChange={handleFileChange}
              handleRemoveImage={handleRemoveImage}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Product Variants</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={handleAddVariant}
              >
                Add Variant
              </Button>
            </div>
            
            <ProductVariantManager
              variants={formProduct.variants || []}
              handleRemoveVariant={handleRemoveVariant}
              handleVariantChange={handleVariantChange}
              colorOptions={colorOptions}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowProductForm(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSaveProduct}>
            <Save className="mr-2 h-4 w-4" />
            {editingProduct ? "Update Product" : "Save Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
