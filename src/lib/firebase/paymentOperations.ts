
import { db } from "@/integrations/firebase/client";
import { doc, collection, addDoc, updateDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { Payment } from "@/types";

// Record a payment
export const recordPaymentInFirestore = async (payment: Omit<Payment, 'id' | 'firestoreId'>): Promise<string> => {
  try {
    const paymentsCollection = collection(db, "payments");
    
    // Generate a unique payment ID
    const uniqueId = `PAY-${Date.now().toString(36).toUpperCase()}`;
    
    const docRef = await addDoc(paymentsCollection, {
      ...payment,
      id: uniqueId,
      date: payment.date || new Date().toISOString()
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error recording payment in Firestore:", error);
    throw error;
  }
};

// Get payments for an order
export const getPaymentsForOrder = async (orderId: string): Promise<Payment[]> => {
  try {
    const paymentsCollection = collection(db, "payments");
    const q = query(paymentsCollection, where("orderId", "==", orderId));
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.warn(`No payments found for order ${orderId}`);
      return [];
    }
    
    const payments: Payment[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id || doc.id,
        orderId: data.orderId,
        amount: data.amount,
        method: data.method,
        status: data.status,
        transactionId: data.transactionId,
        gateway: data.gateway,
        date: data.date,
        refundId: data.refundId,
        refundAmount: data.refundAmount,
        refundDate: data.refundDate,
        firestoreId: doc.id
      } as Payment;
    });
    
    return payments;
  } catch (error) {
    console.error("Error getting payments for order from Firestore:", error);
    throw error;
  }
};

// Record a refund
export const recordRefundInFirestore = async (orderId: string, payment: Payment, refundAmount: number): Promise<string> => {
  try {
    if (!payment.firestoreId) {
      throw new Error("Payment firestoreId is required to record a refund");
    }
    
    // Update the original payment record
    const paymentRef = doc(db, "payments", payment.firestoreId);
    
    await updateDoc(paymentRef, {
      status: 'refunded',
      refundAmount,
      refundDate: new Date().toISOString(),
      refundId: `REF-${Date.now().toString(36).toUpperCase()}`
    });
    
    return payment.firestoreId;
  } catch (error) {
    console.error("Error recording refund in Firestore:", error);
    throw error;
  }
};
