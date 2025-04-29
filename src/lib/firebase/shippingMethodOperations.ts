
import { db } from "@/integrations/firebase/client";
import { doc, collection, addDoc, updateDoc, deleteDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { ShippingMethod } from "@/types";

// Get all shipping methods
export const getShippingMethodsFromFirestore = async (): Promise<ShippingMethod[]> => {
  try {
    const shippingMethodsCollection = collection(db, "shippingMethods");
    const querySnapshot = await getDocs(shippingMethodsCollection);
    
    if (querySnapshot.empty) {
      console.warn("No shipping methods found in Firestore");
      return [];
    }
    
    const shippingMethods: ShippingMethod[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id || doc.id,
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        estimatedDays: data.estimatedDays || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
        firestoreId: doc.id
      } as ShippingMethod;
    });
    
    return shippingMethods;
  } catch (error) {
    console.error("Error getting shipping methods from Firestore:", error);
    throw error;
  }
};

// Add or update shipping method
export const updateShippingMethodInFirestore = async (shippingMethod: Partial<ShippingMethod>): Promise<string> => {
  try {
    if (shippingMethod.firestoreId) {
      // Update existing shipping method
      const shippingMethodRef = doc(db, "shippingMethods", shippingMethod.firestoreId);
      const { firestoreId, id, ...dataToUpdate } = shippingMethod as any;
      
      await updateDoc(shippingMethodRef, dataToUpdate);
      return shippingMethod.firestoreId;
    } else {
      // Add new shipping method
      const shippingMethodsCollection = collection(db, "shippingMethods");
      
      // Generate a unique ID
      const uniqueId = `SHP-${Date.now().toString(36)}`;
      const { firestoreId, id, ...dataToAdd } = shippingMethod as any;
      
      const docRef = await addDoc(shippingMethodsCollection, {
        ...dataToAdd,
        id: uniqueId,
      });
      
      return docRef.id;
    }
  } catch (error) {
    console.error("Error updating shipping method in Firestore:", error);
    throw error;
  }
};

// Delete shipping method
export const deleteShippingMethodFromFirestore = async (shippingMethodId: string): Promise<void> => {
  if (!shippingMethodId) {
    console.error("Invalid shipping method ID provided for deletion");
    throw new Error("Invalid shipping method ID");
  }

  try {
    console.log("Deleting shipping method from Firestore with ID:", shippingMethodId);
    
    // Get the reference to the document
    const shippingMethodRef = doc(db, "shippingMethods", shippingMethodId);
    
    // Check if document exists before attempting to delete
    const docSnap = await getDoc(shippingMethodRef);
    if (!docSnap.exists()) {
      console.error(`Shipping method with ID ${shippingMethodId} does not exist`);
      throw new Error(`Shipping method with ID ${shippingMethodId} does not exist`);
    }
    
    // Perform the actual deletion
    await deleteDoc(shippingMethodRef);
    
    console.log("Shipping method deleted successfully from Firestore with ID:", shippingMethodId);
  } catch (error) {
    console.error("Error deleting shipping method from Firestore:", error);
    throw new Error(`Failed to delete shipping method: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Seed default shipping methods if none exist
export const seedDefaultShippingMethods = async (): Promise<void> => {
  try {
    const existingMethods = await getShippingMethodsFromFirestore();
    
    if (existingMethods.length === 0) {
      const defaultMethods = [
        {
          name: "Standard Shipping",
          description: "Delivery within 5-7 business days",
          price: 499, // ₹4.99
          estimatedDays: 7,
          isActive: true
        },
        {
          name: "Express Shipping",
          description: "Delivery within 2-3 business days",
          price: 999, // ₹9.99
          estimatedDays: 3,
          isActive: true
        },
        {
          name: "Same-day Delivery",
          description: "Delivery on the same day for orders placed before 2 PM",
          price: 1499, // ₹14.99
          estimatedDays: 1,
          isActive: true
        }
      ];
      
      for (const method of defaultMethods) {
        await updateShippingMethodInFirestore(method);
      }
      
      console.log("Default shipping methods seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding default shipping methods:", error);
    throw error;
  }
};
