import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addProductToFirestore } from "@/lib/firebase/productOperations";
import { Product } from "@/types";

export const ProductBulkImport = ({ onImportComplete }: { onImportComplete: () => void }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleBulkCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file format",
        description: "Please upload a valid CSV file.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const text = await file.text();
      // Extremely basic CSV parser assuming headers: name,description,price,category,image_url
      const rows = text.split('\n').filter(row => row.trim().length > 0);
      
      if (rows.length < 2) {
        throw new Error("CSV must contain headers and at least one data row.");
      }

      const headers = rows[0].toLowerCase().split(',').map(h => h.trim());
      let successCount = 0;

      for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        
        const rowData: any = {};
        headers.forEach((header, index) => {
          rowData[header] = columns[index];
        });

        // Skip rows without essential data
        if (!rowData.name || !rowData.price || !rowData.category) continue;

        const newProduct: Omit<Product, 'id'> = {
          name: rowData.name,
          description: rowData.description || "",
          price: parseInt(rowData.price) * 100, // Assuming CSV has standard ₹ integers, multiplied by 100
          originalPrice: rowData.original_price ? parseInt(rowData.original_price) * 100 : null,
          category: rowData.category.toLowerCase().replace(/\s+/g, '-'),
          images: rowData.image_url ? [rowData.image_url] : ["https://img.freepik.com/free-photo/black-t-shirt-with-word-ultra-it_1340-37775.jpg"],
          rating: 0,
          reviews: 0,
          inStock: true,
          variants: [
            { id: `var-${Date.now()}-${i}`, size: "M", color: "Standard", colorCode: "#000000", stock: 50 }
          ],
          featured: false
        };

        await addProductToFirestore(newProduct);
        successCount++;
      }

      toast({
        title: "Bulk Import Successful",
        description: `Successfully imported ${successCount} products from CSV.`,
      });
      
      onImportComplete();
      
    } catch (error) {
      console.error("CSV Bulk Import Error:", error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to parse CSV. Make sure headers are name,description,price,category,image_url.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input 
        type="file" 
        accept=".csv" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleBulkCsvImport} 
      />
      <Button 
        variant="outline" 
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="shrink-0"
      >
        <UploadCloud className={`mr-2 h-4 w-4 ${isUploading ? 'animate-pulse' : ''}`} />
        {isUploading ? "Uploading..." : "Import CSV"}
      </Button>
      <div 
        className="text-xs text-muted-foreground mr-4 hidden md:block cursor-help"
        title="Required CSV Headers: name, description, price, category, image_url"
      >
        hover for format details ⓘ
      </div>
    </div>
  );
};
