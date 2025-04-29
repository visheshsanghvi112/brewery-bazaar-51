
import { Order, OrderStatus } from "@/types";
import { db } from "@/integrations/firebase/client";
import { doc, updateDoc, writeBatch } from "firebase/firestore";

export const processBatchOrders = async (
  orders: Order[],
  orderIds: string[],
  action: string,
  value?: string
): Promise<Order[]> => {
  const updatedOrders: Order[] = [];
  
  // Only allow batch operations for up to 500 orders at once
  // (Firestore batch operations limit)
  const maxBatchSize = 500;
  if (orderIds.length > maxBatchSize) {
    throw new Error(`Cannot process more than ${maxBatchSize} orders at once`);
  }
  
  // Find the orders to update
  const ordersToUpdate = orders.filter(order => orderIds.includes(order.id));
  
  if (action === 'update_status' && value) {
    const status = value as OrderStatus;
    
    // Create a batch operation
    const batch = writeBatch(db);
    
    // Add each order to the batch
    for (const order of ordersToUpdate) {
      if (order.firestoreId) {
        const orderRef = doc(db, "orders", order.firestoreId);
        batch.update(orderRef, {
          status,
          updatedAt: new Date().toISOString()
        });
        
        // Update the order in memory
        updatedOrders.push({
          ...order,
          status
        });
      }
    }
    
    // Commit the batch
    await batch.commit();
    
    console.log(`Updated ${updatedOrders.length} orders to status: ${status}`);
  }
  
  return updatedOrders;
};
