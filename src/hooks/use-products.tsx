
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { getProductsFromFirestore } from "@/lib/firebase/products";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let unsubscribe: () => void;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get initial products
        const productsData = await getProductsFromFirestore();
        setProducts(productsData);
        
        // Set up realtime subscription
        unsubscribe = onSnapshot(
          collection(db, "products"), 
          (snapshot) => {
            const updatedProducts: Product[] = snapshot.docs.map(doc => ({
              id: doc.id,
              name: doc.data().name || '',
              description: doc.data().description || '',
              price: doc.data().price || 0,
              originalPrice: doc.data().originalPrice,
              category: doc.data().category || '',
              images: doc.data().images || [],
              variants: doc.data().variants || [],
              rating: doc.data().rating || 0,
              reviews: doc.data().reviews || 0,
              inStock: doc.data().inStock !== undefined ? doc.data().inStock : true,
              featured: doc.data().featured || false
            }));
            
            setProducts(updatedProducts);
          },
          (error) => {
            console.error("Error listening to product changes:", error);
            setError("Failed to receive product updates");
            toast({
              title: "Update Error",
              description: "Failed to receive product updates. Please refresh the page.",
              variant: "destructive"
            });
          }
        );
      } catch (error) {
        console.error('Error fetching products:', error);
        setError("Failed to load products");
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [toast]);

  return { products, loading, error };
}
