
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

interface DuplicateModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onDuplicate: (product: Product, options: DuplicateOptions) => void;
}

interface DuplicateOptions {
  copyImages: boolean;
  copyVariants: boolean;
  keepStock: boolean;
  nameSuffix: string;
}

export function DuplicateModal({ product, isOpen, onClose, onDuplicate }: DuplicateModalProps) {
  const { toast } = useToast();
  const [options, setOptions] = useState<DuplicateOptions>({
    copyImages: true,
    copyVariants: true,
    keepStock: false,
    nameSuffix: ' (Copy)'
  });
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (option: keyof DuplicateOptions, value: any) => {
    setOptions({ ...options, [option]: value });
  };

  const handleDuplicate = async () => {
    if (!product) return;
    
    try {
      setLoading(true);
      await onDuplicate(product, options);
      onClose();
      toast({
        title: 'Product duplicated',
        description: 'The product has been duplicated successfully.'
      });
    } catch (error) {
      console.error('Error duplicating product:', error);
      toast({
        title: 'Error duplicating product',
        description: 'There was an error duplicating the product.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Duplicate Product</DialogTitle>
          <DialogDescription>
            Customize how you want to duplicate "{product.name}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nameSuffix">Name Suffix</Label>
            <Input
              id="nameSuffix"
              value={options.nameSuffix}
              onChange={(e) => handleOptionChange('nameSuffix', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              New product name: {product.name}{options.nameSuffix}
            </p>
          </div>
          
          <div className="space-y-3 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="copyImages"
                checked={options.copyImages}
                onCheckedChange={(checked) => handleOptionChange('copyImages', checked)}
              />
              <Label htmlFor="copyImages" className="text-sm font-normal">
                Copy product images
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="copyVariants"
                checked={options.copyVariants}
                onCheckedChange={(checked) => handleOptionChange('copyVariants', checked)}
              />
              <Label htmlFor="copyVariants" className="text-sm font-normal">
                Copy product variants
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="keepStock"
                checked={options.keepStock}
                onCheckedChange={(checked) => handleOptionChange('keepStock', checked)}
                disabled={!options.copyVariants}
              />
              <Label 
                htmlFor="keepStock" 
                className={`text-sm font-normal ${!options.copyVariants ? 'text-muted-foreground' : ''}`}
              >
                Keep original stock quantities
              </Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleDuplicate} disabled={loading}>
            {loading ? 'Duplicating...' : 'Duplicate Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
