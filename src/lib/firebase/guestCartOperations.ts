
import { db } from "@/integrations/firebase/client";
import { doc, collection, addDoc, updateDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { GuestCart, CartItem } from "@/types";

// Create or update guest cart
export const saveGuestCartToFirestore = async (
  guestId: string, 
  items: CartItem[], 
  total: number
): Promise<string> => {
  try {
    if (!guestId) {
      throw new Error("Guest ID is required to save cart");
    }
    
    // Check if guest already has a cart
    const guestCartsCollection = collection(db, "guestCarts");
    const q = query(guestCartsCollection, where("guestId", "==", guestId));
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Create new guest cart
      const uniqueId = `GCART-${Date.now().toString(36)}`;
      
      const docRef = await addDoc(guestCartsCollection, {
        id: uniqueId,
        guestId,
        items,
        total,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        convertedToOrder: false
      });
      
      return docRef.id;
    } else {
      // Update existing guest cart
      const cartDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, "guestCarts", cartDoc.id), {
        items,
        total,
        updatedAt: new Date().toISOString()
      });
      
      return cartDoc.id;
    }
  } catch (error) {
    console.error("Error saving guest cart to Firestore:", error);
    throw error;
  }
};

// Get guest cart
export const getGuestCartFromFirestore = async (guestId: string): Promise<GuestCart | null> => {
  try {
    if (!guestId) {
      console.warn("No guest ID provided to fetch cart");
      return null;
    }
    
    const guestCartsCollection = collection(db, "guestCarts");
    const q = query(
      guestCartsCollection, 
      where("guestId", "==", guestId),
      where("convertedToOrder", "==", false)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: data.id,
      guestId: data.guestId,
      items: data.items || [],
      total: data.total || 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      convertedToOrder: data.convertedToOrder || false,
      firestoreId: doc.id
    } as GuestCart;
  } catch (error) {
    console.error("Error getting guest cart from Firestore:", error);
    return null;
  }
};

// Mark guest cart as converted to order
export const markGuestCartAsConverted = async (cartId: string): Promise<void> => {
  try {
    if (!cartId) {
      throw new Error("Cart ID is required to mark as converted");
    }
    
    await updateDoc(doc(db, "guestCarts", cartId), {
      convertedToOrder: true,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error marking guest cart as converted in Firestore:", error);
    throw error;
  }
};
