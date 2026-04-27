
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/ui/file-input";
import { Input } from "@/components/ui/input";
import { X, Link as LinkIcon } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

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
  const { handleAddImageUrl } = useAdmin();
  const [tempUrl, setTempUrl] = useState("");

  const submitUrl = () => {
    if (tempUrl) {
      handleAddImageUrl(tempUrl);
      setTempUrl("");
    }
  };

  return (
    <div className="space-y-4">
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
        
        {/* Always show at least one upload slot */}
        <div className={productImageUrls.length > 0 ? "mt-2" : ""}>
          <FileInput
            onFileChange={(file) => handleFileChange(productImages.length - 1, file)}
            buttonText="Upload File"
            preview={null}
          />
        </div>
      </div>

      <div className="flex gap-2 items-center mt-4 border-t pt-4">
        <LinkIcon className="h-4 w-4 text-muted-foreground hidden sm:block" />
        <Input 
          placeholder="Or paste an image URL here..." 
          value={tempUrl}
          onChange={(e) => setTempUrl(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="button" 
          variant="secondary" 
          onClick={submitUrl}
          disabled={!tempUrl.trim()}
        >
          Add via Link
        </Button>
      </div>
    </div>
  );
};
