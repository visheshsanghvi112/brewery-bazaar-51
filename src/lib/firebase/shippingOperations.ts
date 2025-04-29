
import { db } from "@/integrations/firebase/client";
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { Address } from "@/types";
import { COLLECTIONS } from "./constants";

// Shipping details collection functions
export async function saveShippingDetails(userId: string, shippingDetails: Address, billingDetails?: Address) {
  try {
    // Check if shipping details already exist for user
    const shippingRef = collection(db, COLLECTIONS.SHIPPING_DETAILS);
    const q = query(shippingRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const shippingData = {
      userId,
      shippingAddress: shippingDetails,
      billingAddress: billingDetails || shippingDetails,
      updatedAt: new Date().toISOString()
    };
    
    if (querySnapshot.empty) {
      // Create new shipping details
      const docRef = await addDoc(shippingRef, {
        ...shippingData,
        createdAt: new Date().toISOString()
      });
      console.log("Shipping details saved with ID: ", docRef.id);
      return { ...shippingData, id: docRef.id };
    } else {
      // Update existing shipping details
      const docRef = doc(db, COLLECTIONS.SHIPPING_DETAILS, querySnapshot.docs[0].id);
      await updateDoc(docRef, shippingData);
      console.log("Shipping details updated for user: ", userId);
      return { ...shippingData, id: querySnapshot.docs[0].id };
    }
  } catch (error) {
    console.error("Error saving shipping details:", error);
    throw error;
  }
}

export async function getShippingDetails(userId: string) {
  try {
    const shippingRef = collection(db, COLLECTIONS.SHIPPING_DETAILS);
    const q = query(shippingRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      return {
        ...data,
        id: querySnapshot.docs[0].id
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting shipping details:", error);
    throw error;
  }
}
