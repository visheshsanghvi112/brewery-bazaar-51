import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/integrations/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";
import { addToWishlist, removeFromWishlist } from "@/lib/firebase/userOperations";
import { useToast } from "@/hooks/use-toast";

interface WishlistContextType {
  wishlistItems: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string, productName: string) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let unsubscribe: () => void;

    const authUnsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoading(true);
        const userRef = doc(db, "users", user.uid);
        
        // Listen to the user's wishlist document globally so it updates instantly without N+1 query loops
        unsubscribe = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists() && docSnap.data().wishlist) {
            setWishlistItems(docSnap.data().wishlist);
          } else {
            setWishlistItems([]);
          }
          setLoading(false);
        });
      } else {
        setWishlistItems([]);
        setLoading(false);
        if (unsubscribe) unsubscribe();
      }
    });

    return () => {
      authUnsubscribe();
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const isInWishlist = (productId: string) => wishlistItems.includes(productId);

  const toggleWishlist = async (id: string, productName: string) => {
    if (!auth.currentUser) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to your wishlist",
      });
      return;
    }

    try {
      if (wishlistItems.includes(id)) {
        await removeFromWishlist(auth.currentUser.uid, id);
        // Note: The onSnapshot listener will automatically update wishlistItems
        toast({
          title: "Removed from wishlist",
          description: `${productName} has been removed from your wishlist`,
        });
      } else {
        await addToWishlist(auth.currentUser.uid, id);
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
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, isInWishlist, toggleWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useGlobalWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useGlobalWishlist must be used within a WishlistProvider");
  }
  return context;
};
