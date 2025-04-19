
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Product } from "@/types";

interface ProductFormHeaderProps {
  editingProduct: Product | null;
}

export const ProductFormHeader = ({ editingProduct }: ProductFormHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        {editingProduct ? "Edit Product" : "Add New Product"}
      </DialogTitle>
      <DialogDescription>
        {editingProduct 
          ? "Make changes to the product here. Click save when you're done." 
          : "Add details for the new product here."}
      </DialogDescription>
    </DialogHeader>
  );
};
