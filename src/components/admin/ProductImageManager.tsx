
import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/ui/file-input";
import { X } from "lucide-react";

interface ProductImageManagerProps {
  productImages: (File | null)[];
  productImageUrls: string[];
  handleFileChange: (index: number, file: File | null) => void;
  handleRemoveImage: (index: number) => void;
}

export const ProductImageManager = ({
  productImages,
  productImageUrls,
  handleFileChange,
  handleRemoveImage
}: ProductImageManagerProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {productImageUrls.map((url, idx) => (
        <div key={`url-${idx}`} className="relative rounded-md border p-1 overflow-hidden bg-card/50">
          <img src={url} alt={`Product ${idx + 1}`} className="h-40 w-full object-contain" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 bg-black/40 hover:bg-black/60 text-white rounded-full"
            onClick={() => handleRemoveImage(idx)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      {productImages.map((file, idx) => (
        <div key={`upload-${idx}`} className={productImageUrls.length > 0 && idx === 0 ? "hidden" : ""}>
          <FileInput
            onFileChange={(file) => handleFileChange(idx, file)}
            buttonText="Add Image"
            preview={file ? URL.createObjectURL(file) : undefined}
          />
        </div>
      ))}
    </div>
  );
};
