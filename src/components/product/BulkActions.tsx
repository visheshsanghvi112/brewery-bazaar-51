
import React from 'react';
import { ChevronDown, CheckSquare, Trash, Archive, Copy, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

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
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDeleteSelected();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {selectedProducts.length} selected
        </span>
        <Button variant="outline" size="sm" onClick={onClearSelection}>
          Clear
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="sm" className="ml-2">
              Bulk Actions
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Selected ({selectedProducts.length})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicateSelected}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate Selected
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onExportSelected}>
              <Download className="mr-2 h-4 w-4" />
              Export Selected
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onRefreshInventory}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Inventory
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedProducts.length} selected product{selectedProducts.length !== 1 ? 's' : ''} and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
