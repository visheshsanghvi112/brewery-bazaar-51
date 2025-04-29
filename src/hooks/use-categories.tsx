
import { useState, useEffect } from "react";
import { Category } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { getCategoriesFromFirestore } from "@/lib/firebase/categoryOperations";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let unsubscribe: () => void;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get initial categories
        const categoriesData = await getCategoriesFromFirestore();
        setCategories(categoriesData);
        
        // Set up realtime subscription
        unsubscribe = onSnapshot(
          collection(db, "categories"), 
          (snapshot) => {
            const updatedCategories: Category[] = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: data.id || doc.id,
                name: data.name || '',
                slug: data.slug || '',
                description: data.description || '',
                image: data.image || '',
              };
            });
            
            setCategories(updatedCategories);
          },
          (error) => {
            console.error("Error listening to category changes:", error);
            setError("Failed to receive category updates");
            toast({
              title: "Update Error",
              description: "Failed to receive category updates. Please refresh the page.",
              variant: "destructive"
            });
          }
        );
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError("Failed to load categories");
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [toast]);

  return { categories, loading, error };
}
