
import { db } from "@/integrations/firebase/client";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { OrderItem, ReturnRequest } from "@/types";
import { COLLECTIONS } from "./constants";

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
