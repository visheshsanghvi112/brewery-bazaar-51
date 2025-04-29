
import { db } from "@/integrations/firebase/client";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { COLLECTIONS } from "./constants";

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
      // Add explicit type assertion to doc.data() to ensure TypeScript recognizes it as an object
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
