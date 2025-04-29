
import { db } from "@/integrations/firebase/client";
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { Customer } from "@/types";
import { COLLECTIONS } from "./constants";

// Customer collection functions
export async function saveCustomer(customer: Customer) {
  try {
    // Check if customer already exists
    const customersRef = collection(db, COLLECTIONS.CUSTOMERS);
    const q = query(customersRef, where("id", "==", customer.id));
    const querySnapshot = await getDocs(q);
    
    const customerData = {
      ...customer,
      updatedAt: new Date().toISOString()
    };
    
    if (querySnapshot.empty) {
      // Create new customer
      const docRef = await addDoc(customersRef, {
        ...customerData,
        createdAt: new Date().toISOString()
      });
      console.log("Customer saved with ID: ", docRef.id);
      return { ...customerData, firestoreId: docRef.id };
    } else {
      // Update existing customer
      const docRef = doc(db, COLLECTIONS.CUSTOMERS, querySnapshot.docs[0].id);
      await updateDoc(docRef, customerData);
      console.log("Customer updated: ", customer.id);
      return { ...customerData, firestoreId: querySnapshot.docs[0].id };
    }
  } catch (error) {
    console.error("Error saving customer:", error);
    throw error;
  }
}
