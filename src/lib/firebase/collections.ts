
import { db } from "@/integrations/firebase/client";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, getDoc } from "firebase/firestore";
import { Address, Customer, OrderItem, ReturnRequest } from "@/types";

// Collection names
export const COLLECTIONS = {
  ORDERS: "orders",
  RETURN_REQUESTS: "returnRequests",
  USER_CARTS: "userCarts",
  SHIPPING_DETAILS: "shippingDetails",
  CUSTOMERS: "customers",
  SEQUENCES: "sequences"
};

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

// Return request functions with enhanced data storage
export async function createReturnRequest(returnRequest: ReturnRequest) {
  try {
    const returnsRef = collection(db, COLLECTIONS.RETURN_REQUESTS);
    // Make sure we're not spreading anything that might not be an object
    const returnData = {
      ...returnRequest,
      createdAt: returnRequest.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(returnsRef, returnData);
    
    console.log(`Return request ${returnRequest.id} saved with Firestore ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("Error creating return request:", error);
    throw error;
  }
}

export async function getReturnRequests(userId?: string) {
  try {
    const returnsRef = collection(db, COLLECTIONS.RETURN_REQUESTS);
    let q;
    
    if (userId) {
      // Get returns for specific user
      q = query(returnsRef, where("userId", "==", userId));
    } else {
      // Get all returns (for admin)
      q = query(returnsRef);
    }
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      firestoreId: doc.id
    })) as ReturnRequest[];
  } catch (error) {
    console.error("Error getting return requests:", error);
    throw error;
  }
}

// Update the sequence counter in Firestore
export async function updateSequenceCounter(sequenceName: string, value: number) {
  try {
    const sequenceRef = doc(db, COLLECTIONS.SEQUENCES, sequenceName);
    const sequenceDoc = await getDoc(sequenceRef);
    
    if (!sequenceDoc.exists()) {
      // Create new sequence
      await updateDoc(sequenceRef, { value });
    } else {
      // Update existing sequence
      await updateDoc(sequenceRef, { value });
    }
    
    console.log(`Sequence ${sequenceName} updated to ${value}`);
    return value;
  } catch (error) {
    console.error(`Error updating sequence ${sequenceName}:`, error);
    throw error;
  }
}
