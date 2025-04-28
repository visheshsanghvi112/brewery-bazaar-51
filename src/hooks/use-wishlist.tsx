
import { useState, useEffect } from "react";
import { auth, db } from "@/integrations/firebase/client";
import { addToWishlist, removeFromWishlist } from "@/lib/firebase/userOperations";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc } from "firebase/firestore";

export function useWishlist(productId?: string) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const { toast } = useToast();

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!auth.currentUser) return;
      
      try {
        setLoading(true);
        // Get user document directly from Firestore
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists() && userDocSnap.data().wishlist) {
          const wishlist = userDocSnap.data().wishlist || [];
          setWishlistItems(wishlist);
          
          if (productId) {
            setIsInWishlist(wishlist.includes(productId));
          }
        } else {
          setWishlistItems([]);
        }
      } catch (error) {
        console.error("Error checking wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    checkWishlist();
  }, [productId]);

  // Toggle wishlist function
  const toggleWishlist = async (id: string, productName: string) => {
    if (!auth.currentUser) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to your wishlist",
      });
      return;
    }

    try {
      setLoading(true);
      if (wishlistItems.includes(id)) {
        await removeFromWishlist(auth.currentUser.uid, id);
        setWishlistItems(wishlistItems.filter(itemId => itemId !== id));
        setIsInWishlist(false);
        toast({
          title: "Removed from wishlist",
          description: `${productName} has been removed from your wishlist`,
        });
      } else {
        await addToWishlist(auth.currentUser.uid, id);
        setWishlistItems([...wishlistItems, id]);
        setIsInWishlist(true);
        toast({
          title: "Added to wishlist",
          description: `${productName} has been added to your wishlist`,
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast({
        title: "Error",
        description: "There was an error updating your wishlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    isInWishlist,
    wishlistItems,
    loading,
    toggleWishlist
  };
}
