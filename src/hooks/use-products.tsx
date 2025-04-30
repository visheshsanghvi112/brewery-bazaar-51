
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { collection, onSnapshot, query, getDocs } from "firebase/firestore";
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
        
        console.log("Setting up products listener from Firestore");
        
        // First, get a count of products for verification
        const countSnapshot = await getDocs(collection(db, "products"));
        console.log(`Initial query found ${countSnapshot.docs.length} products in Firestore`);
        
        // Set up realtime subscription to products collection
        const productsQuery = query(collection(db, "products"));
        
        unsubscribe = onSnapshot(
          productsQuery, 
          (snapshot) => {
            console.log(`Received snapshot with ${snapshot.docs.length} products`);
            
            // Log each document ID to help diagnose which ones are coming through
            snapshot.docs.forEach((doc, index) => {
              console.log(`Product ${index + 1}: ID=${doc.id}, Name=${doc.data().name}`);
            });
            
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
            setLoading(false);
            console.log("Products loaded:", updatedProducts.length);
          },
          (error) => {
            console.error("Error listening to product changes:", error);
            setError("Failed to receive product updates");
            setLoading(false);
            toast({
              title: "Update Error",
              description: "Failed to receive product updates. Please refresh the page.",
              variant: "destructive"
            });
          }
        );
      } catch (error) {
        console.error('Error setting up products listener:', error);
        setError("Failed to load products");
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    fetchProducts();

    return () => {
      if (unsubscribe) {
        console.log("Unsubscribing from products listener");
        unsubscribe();
      }
    };
  }, [toast]);

  return { products, loading, error };
}
