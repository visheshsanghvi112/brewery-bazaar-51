
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { Trash, Copy, Download, RefreshCw } from "lucide-react";

interface BulkActionsProps {
  selectedProducts: Product[];
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  onDuplicateSelected: () => void;
  onExportSelected: () => void;
  onRefreshInventory: () => void;
}

export function BulkActions({
  selectedProducts,
  onClearSelection,
  onDeleteSelected,
  onDuplicateSelected,
  onExportSelected,
  onRefreshInventory
}: BulkActionsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium mr-2">
        {selectedProducts.length} {selectedProducts.length === 1 ? 'product' : 'products'} selected
      </span>
      
      <Button 
        variant="outline"
        size="sm"
        className="h-8 px-2 text-xs"
        onClick={onClearSelection}
      >
        Clear
      </Button>
      
      <div className="flex-1"></div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
        onClick={onDeleteSelected}
      >
        <Trash className="h-3.5 w-3.5 mr-1" />
        Delete
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 px-2 text-xs"
        onClick={onDuplicateSelected}
      >
        <Copy className="h-3.5 w-3.5 mr-1" />
        Duplicate
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 px-2 text-xs"
        onClick={onExportSelected}
      >
        <Download className="h-3.5 w-3.5 mr-1" />
        Export
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 px-2 text-xs"
        onClick={onRefreshInventory}
      >
        <RefreshCw className="h-3.5 w-3.5 mr-1" />
        Refresh
      </Button>
    </div>
  );
}
