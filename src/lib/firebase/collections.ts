
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
    
    // Fixed: Create a new object instead of directly spreading returnRequest
    const returnData = {
      id: returnRequest.id,
      orderId: returnRequest.orderId,
      orderDate: returnRequest.orderDate,
      customerName: returnRequest.customerName,
      customerEmail: returnRequest.customerEmail,
      items: returnRequest.items,
      reason: returnRequest.reason,
      status: returnRequest.status,
      createdAt: returnRequest.createdAt || new Date().toISOString(),
      scheduledDate: returnRequest.scheduledDate,
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
    
    return querySnapshot.docs.map(doc => {
      // Add explicit type for document data
      const data = doc.data() as {
        id: string;
        orderId: string;
        orderDate: string;
        customerName: string;
        customerEmail: string;
        items: OrderItem[];
        reason: string;
        status: string;
        createdAt: string;
        scheduledDate: string;
        updatedAt: string;
      };
      
      return {
        id: data.id,
        orderId: data.orderId,
        orderDate: data.orderDate,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        items: data.items,
        reason: data.reason,
        status: data.status,
        createdAt: data.createdAt,
        scheduledDate: data.scheduledDate,
        updatedAt: data.updatedAt,
        firestoreId: doc.id
      } as ReturnRequest;
    });
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

// New functions for orders collection
export async function saveOrder(order: any) {
  try {
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    
    // Add timestamp for when the order was created
    const orderData = {
      ...order,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(ordersRef, orderData);
    
    console.log(`Order ${order.id} saved with Firestore ID: ${docRef.id}`);
    return {
      ...orderData,
      firestoreId: docRef.id
    };
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
}

export async function getOrders(userId?: string) {
  try {
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    let q;
    
    if (userId) {
      // Get orders for specific user
      q = query(ordersRef, where("userId", "==", userId));
    } else {
      // Get all orders (for admin)
      q = query(ordersRef);
    }
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      // Add type assertion to doc.data() to ensure TypeScript treats it as an object
      const data = doc.data() as Record<string, unknown>;
      
      return {
        ...data,
        firestoreId: doc.id
      };
    });
  } catch (error) {
    console.error("Error getting orders:", error);
    throw error;
  }
}

// Test function to create a sample order in Firestore
export async function createTestOrder() {
  try {
    const testOrder = {
      id: "BREW-TEST-01",
      userId: "test-user-id",
      customerName: "Test Customer",
      customerEmail: "test@example.com",
      items: [
        {
          productId: "test-product-1",
          productName: "Test T-shirt",
          variantId: "test-variant-1",
          price: 1999,
          quantity: 2
        }
      ],
      shippingAddress: {
        street: "123 Test Street",
        city: "Test City",
        state: "Test State",
        zipCode: "12345",
        country: "India"
      },
      billingAddress: {
        street: "123 Test Street",
        city: "Test City",
        state: "Test State",
        zipCode: "12345",
        country: "India"
      },
      subtotal: 3998,
      shipping: 0,
      total: 3998,
      status: "Processing",
      date: new Date().toISOString(),
      paymentMethod: "Card"
    };
    
    const result = await saveOrder(testOrder);
    console.log("Test order created:", result);
    return result;
  } catch (error) {
    console.error("Error creating test order:", error);
    throw error;
  }
}
