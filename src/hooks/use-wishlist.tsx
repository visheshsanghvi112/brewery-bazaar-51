
import { useState, useEffect } from "react";
import { auth } from "@/integrations/firebase/client";
import { getUserProfile, addToWishlist, removeFromWishlist } from "@/lib/firebase/userOperations";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types";

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
        const userProfile = await getUserProfile(auth.currentUser.uid);
        
        if (userProfile && userProfile.wishlist) {
          setWishlistItems(userProfile.wishlist);
          
          if (productId) {
            setIsInWishlist(userProfile.wishlist.includes(productId));
          }
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
