
import { useState, useEffect } from "react";
import { ShippingMethod } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { getShippingMethodsFromFirestore } from "@/lib/firebase/shippingMethodOperations";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

export function useShippingMethods() {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let unsubscribe: () => void;

    const fetchShippingMethods = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get initial shipping methods
        const methodsData = await getShippingMethodsFromFirestore();
        setShippingMethods(methodsData);
        
        // Set up realtime subscription
        unsubscribe = onSnapshot(
          collection(db, "shippingMethods"), 
          (snapshot) => {
            const updatedMethods: ShippingMethod[] = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: data.id || doc.id,
                name: data.name || '',
                description: data.description || '',
                price: data.price || 0,
                estimatedDays: data.estimatedDays || 0,
                isActive: data.isActive !== undefined ? data.isActive : true,
                firestoreId: doc.id
              };
            });
            
            setShippingMethods(updatedMethods);
          },
          (error) => {
            console.error("Error listening to shipping method changes:", error);
            setError("Failed to receive shipping method updates");
            toast({
              title: "Update Error",
              description: "Failed to receive shipping method updates. Please refresh the page.",
              variant: "destructive"
            });
          }
        );
      } catch (error) {
        console.error('Error fetching shipping methods:', error);
        setError("Failed to load shipping methods");
        toast({
          title: "Error",
          description: "Failed to load shipping methods. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchShippingMethods();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [toast]);

  return { shippingMethods, loading, error };
}
