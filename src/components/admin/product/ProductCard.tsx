
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { Edit, Trash2, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  categories: any[];
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (productId: string) => void;
}

export function ProductCard({ product, categories, handleEditProduct, handleDeleteProduct }: ProductCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const getCategoryName = (slug: string) => {
    const category = categories.find((cat) => cat.slug === slug);
    return category ? category.name : slug;
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div variants={item}>
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
        <div className="aspect-video relative bg-muted overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
          {product.images && product.images[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
              No image
            </div>
          )}
          
          {product.featured && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full z-20 flex items-center gap-1">
              <Star className="h-3 w-3" />
              Featured
            </div>
          )}
          
          {!product.inStock && (
            <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded z-20">
              Out of Stock
            </div>
          )}
        </div>
        
        <CardContent className="p-4 flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium text-lg line-clamp-2">{product.name}</h3>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
              {getCategoryName(product.category || '')}
            </div>
            <div className="flex items-center text-xs bg-muted px-2 py-1 rounded-full">
              {product.variants.length} {product.variants.length === 1 ? 'variant' : 'variants'}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="font-medium text-lg">
                ₹{(product.price / 100).toFixed(2)}
              </div>
              {product.originalPrice && (
                <div className="text-muted-foreground text-sm line-through">
                  ₹{(product.originalPrice / 100).toFixed(2)}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviews})
              </span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 gap-2">
          <Button 
            onClick={() => handleEditProduct(product)} 
            variant="outline" 
            className="flex-1"
          >
            <Edit className="mr-1 h-4 w-4" /> Edit
          </Button>
          
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Trash2 className="mr-1 h-4 w-4 text-destructive" />
                <span className="text-destructive">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the product
                  "{product.name}" and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => {
                    handleDeleteProduct(product.id || '');
                    setIsDeleteDialogOpen(false);
                  }}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
