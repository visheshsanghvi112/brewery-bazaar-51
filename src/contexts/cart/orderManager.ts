
import { Address, Customer, Order, OrderStatus } from "@/types";
import { CartState } from "./cartReducer";
import { db } from "@/integrations/firebase/client";
import { doc, getDoc, setDoc, runTransaction, collection, addDoc } from "firebase/firestore";

// Function to get the next sequence number
const getNextSequence = async (sequenceName: string): Promise<number> => {
  const sequenceRef = doc(db, "sequences", sequenceName);
  
  try {
    // Use a transaction to ensure we get a unique number even with concurrent requests
    const result = await runTransaction(db, async (transaction) => {
      const sequenceDoc = await transaction.get(sequenceRef);
      
      // If the sequence document doesn't exist, create it with initial value 1
      if (!sequenceDoc.exists()) {
        transaction.set(sequenceRef, { value: 1 });
        return 1;
      }
      
      // Otherwise increment the existing value
      const newValue = (sequenceDoc.data().value || 0) + 1;
      transaction.update(sequenceRef, { value: newValue });
      return newValue;
    });
    
    return result;
  } catch (error) {
    console.error("Error getting next sequence:", error);
    // Fallback to timestamp if transaction fails
    return Date.now();
  }
};

// Function to pad the sequence number with leading zeros
const formatSequenceNumber = (num: number): string => {
  return num.toString().padStart(2, '0');
};

export const createOrder = async (
  state: CartState,
  customer: Customer,
  paymentMethod: string,
  orders: Order[]
): Promise<{ newOrder: Order; orderId: string }> => {
  // Get next order sequence
  const sequenceNumber = await getNextSequence("order_sequence");
  const orderId = `BREW-${formatSequenceNumber(sequenceNumber)}`;
  
  // Calculate subtotal and shipping
  const subtotal = state.total;
  const shipping = subtotal >= 99900 ? 0 : 10000; // Free shipping for orders above ₹999
  const total = subtotal + shipping;
  
  // Create order items
  const items = state.items.map(item => ({
    product: item.product,
    variant: item.selectedVariant,
    quantity: item.quantity,
    price: item.product.price * item.quantity
  }));
  
  // Create new order
  const newOrder: Order = {
    id: orderId,
    customer,
    items,
    shippingAddress: state.shippingAddress || {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India"
    },
    billingAddress: state.billingAddress || {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India"
    },
    subtotal,
    shipping,
    total,
    status: 'Processing' as OrderStatus,
    date: new Date().toISOString(),
    paymentMethod,
    // Firebase-specific fields
    customerName: customer.name,
    customerEmail: customer.email,
    userId: customer.id.startsWith('cust-') ? null : customer.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Save the order to Firestore "orders" collection
  try {
    const orderRef = collection(db, "orders");
    const docRef = await addDoc(orderRef, newOrder);
    
    // Store the Firestore document ID
    newOrder.firestoreId = docRef.id;
    
    console.log(`Order ${orderId} saved to Firestore orders collection. Firestore ID: ${docRef.id}`);
  } catch (error) {
    console.error("Error saving order to Firestore:", error);
    throw error;
  }
  
  return { newOrder, orderId };
};

export const updateCustomer = (
  customer: Customer, 
  customers: any[], 
  total: number
): any[] => {
  const existingCustomerIndex = customers.findIndex(c => c.email === customer.email);
  
  if (existingCustomerIndex >= 0) {
    const updatedCustomers = [...customers];
    const existingCustomer = updatedCustomers[existingCustomerIndex];
    
    updatedCustomers[existingCustomerIndex] = {
      ...existingCustomer,
      orders: (existingCustomer.orders || 0) + 1,
      spent: (existingCustomer.spent || 0) + total
    };
    
    return updatedCustomers;
  } else {
    // Add new customer
    return [
      ...customers,
      {
        id: `cust-${Date.now()}`,
        ...customer,
        orders: 1,
        spent: total,
        joinedDate: new Date().toISOString()
      }
    ];
  }
};
