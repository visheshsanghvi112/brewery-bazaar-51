
import { db } from "@/integrations/firebase/client";
import { doc, collection, addDoc, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { WishlistItem, Product } from "@/types";

// Get user's wishlist
export const getWishlistFromFirestore = async (userId: string): Promise<WishlistItem[]> => {
  try {
    if (!userId) {
      console.warn("No userId provided to fetch wishlist");
      return [];
    }
    
    const wishlistCollection = collection(db, "wishlist");
    const q = query(wishlistCollection, where("userId", "==", userId));
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("No wishlist items found for user", userId);
      return [];
    }
    
    const wishlistItems: WishlistItem[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id || doc.id,
        userId: data.userId,
        productId: data.productId,
        addedAt: data.addedAt || new Date().toISOString(),
        firestoreId: doc.id
      } as WishlistItem;
    });
    
    return wishlistItems;
  } catch (error) {
    console.error("Error getting wishlist from Firestore:", error);
    throw error;
  }
};

// Add item to wishlist
export const addToWishlist = async (userId: string, productId: string): Promise<string> => {
  try {
    if (!userId || !productId) {
      throw new Error("User ID and Product ID are required to add to wishlist");
    }
    
    // Check if item is already in wishlist
    const wishlistCollection = collection(db, "wishlist");
    const q = query(
      wishlistCollection,
      where("userId", "==", userId),
      where("productId", "==", productId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log("Item already in wishlist");
      return querySnapshot.docs[0].id;
    }
    
    // Add item to wishlist
    const docRef = await addDoc(wishlistCollection, {
      userId,
      productId,
      addedAt: new Date().toISOString()
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding to wishlist in Firestore:", error);
    throw error;
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (userId: string, productId: string): Promise<void> => {
  try {
    if (!userId || !productId) {
      throw new Error("User ID and Product ID are required to remove from wishlist");
    }
    
    const wishlistCollection = collection(db, "wishlist");
    const q = query(
      wishlistCollection,
      where("userId", "==", userId),
      where("productId", "==", productId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.warn("Item not found in wishlist");
      return;
    }
    
    const wishlistDoc = querySnapshot.docs[0];
    await deleteDoc(doc(db, "wishlist", wishlistDoc.id));
  } catch (error) {
    console.error("Error removing from wishlist in Firestore:", error);
    throw error;
  }
};

// Check if item is in wishlist
export const isInWishlist = async (userId: string, productId: string): Promise<boolean> => {
  try {
    if (!userId || !productId) {
      return false;
    }
    
    const wishlistCollection = collection(db, "wishlist");
    const q = query(
      wishlistCollection,
      where("userId", "==", userId),
      where("productId", "==", productId)
    );
    
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking wishlist in Firestore:", error);
    return false;
  }
};
