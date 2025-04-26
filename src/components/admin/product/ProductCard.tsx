
import React from 'react';
import { motion } from "framer-motion";
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductCardProps {
  product: Product;
  categories: any[];
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (productId: string) => void;
}

export function ProductCard({
  product,
  categories,
  handleEditProduct,
  handleDeleteProduct
}: ProductCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const category = categories.find(c => c.slug === product.category);
  const categoryName = category ? category.name : product.category;
  
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  return (
    <motion.div variants={itemVariant}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={product.images[0] || 'https://img.freepik.com/free-photo/black-t-shirt-with-word-ultra-it_1340-37775.jpg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {product.originalPrice && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
              Sale
            </div>
          )}
          
          {product.featured && (
            <div className="absolute top-2 right-2 bg-amber-600 text-white text-xs font-medium px-2 py-1 rounded">
              Featured
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="mb-1 text-sm text-muted-foreground capitalize">
            {categoryName}
          </div>
          <h3 className="font-medium mb-1">{product.name}</h3>
          <div className="text-sm mb-2 line-clamp-2 text-muted-foreground">
            {product.description}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                ₹{(product.price / 100).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{(product.originalPrice / 100).toFixed(2)}
                </span>
              )}
            </div>
            <div className="text-sm">
              {product.inStock ? (
                <span className="text-green-600">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => handleEditProduct(product)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product "{product.name}" will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                handleDeleteProduct(product.id);
                setShowDeleteConfirm(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
