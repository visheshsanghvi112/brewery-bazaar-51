
import { Order, ReturnRequest, ReturnStatus, EmailStatus, OrderStatus } from "@/types";
import { generateBatchShippingLabels } from "./shippingLabels";
import { sendOrderStatusUpdateEmail } from "./emailService";
import { generateReturnLabel } from "./returnLabels";

/**
 * Process bulk order status updates
 */
export const processBatchOrders = async (
  allOrders: Order[],
  orderIds: string[],
  action: string,
  value?: string
): Promise<Order[]> => {
  console.log(`Processing ${orderIds.length} orders with action: ${action}`);
  
  // Find the orders to process
  const ordersToProcess = allOrders.filter(order => orderIds.includes(order.id));
  
  switch (action) {
    case "update_status":
      return updateOrderStatuses(ordersToProcess, value as OrderStatus);
    
    case "generate_labels":
      return generateShippingLabels(ordersToProcess);
    
    case "update_inventory":
      return updateInventory(ordersToProcess);
    
    case "send_notifications":
      return sendNotifications(ordersToProcess);
    
    default:
      throw new Error(`Unknown action: ${action}`);
  }
};

/**
 * Update order statuses in bulk
 */
const updateOrderStatuses = async (orders: Order[], status: OrderStatus): Promise<Order[]> => {
  console.log(`Updating ${orders.length} orders to status: ${status}`);
  
  return orders.map(order => ({
    ...order,
    status,
    lastEmailNotification: undefined // Clear last notification to indicate status has changed
  }));
};

/**
 * Generate shipping labels in bulk
 */
const generateShippingLabels = async (orders: Order[]): Promise<Order[]> => {
  console.log(`Generating shipping labels for ${orders.length} orders`);
  
  try {
    // Generate batch shipping labels
    const { trackingNumbers, combinedPdfUrl } = await generateBatchShippingLabels(orders);
    
    // Open the combined PDF in a new window
    window.open(combinedPdfUrl, '_blank');
    
    // Update orders with tracking numbers and mark labels as generated
    return orders.map(order => ({
      ...order,
      trackingNumber: trackingNumbers[order.id],
      shippingLabelGenerated: true,
      status: order.status === "Processing" ? "Shipped" as OrderStatus : order.status
    }));
  } catch (error) {
    console.error("Error generating shipping labels:", error);
    throw error;
  }
};

/**
 * Update inventory in bulk
 */
const updateInventory = async (orders: Order[]): Promise<Order[]> => {
  console.log(`Updating inventory for ${orders.length} orders`);
  
  // In a real application, this would update inventory in the database
  // For now, we'll just mark the inventory as updated
  return orders.map(order => ({
    ...order,
    inventoryUpdated: true
  }));
};

/**
 * Send notifications in bulk
 */
const sendNotifications = async (orders: Order[]): Promise<Order[]> => {
  console.log(`Sending notifications for ${orders.length} orders`);
  
  const updatedOrders: Order[] = [];
  
  // Send notifications for each order
  for (const order of orders) {
    try {
      // Send email notification
      const result = await sendOrderStatusUpdateEmail(order);
      
      // Update the order
      if (result.success) {
        updatedOrders.push({
          ...order,
          lastEmailNotification: {
            status: order.status,
            date: new Date().toISOString()
          }
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(`Error sending notification for order ${order.id}:`, error);
      // Still add the order to updatedOrders, but don't update the notification status
      updatedOrders.push(order);
    }
  }
  
  return updatedOrders;
};

/**
 * Process bulk return requests
 */
export const processBatchReturns = async (
  allReturns: ReturnRequest[],
  returnIds: string[],
  action: string,
  value?: string
): Promise<ReturnRequest[]> => {
  // Find the returns to process
  const returnsToProcess = allReturns.filter(returnReq => returnIds.includes(returnReq.id));
  
  switch (action) {
    case "update_status":
      return updateReturnStatuses(returnsToProcess, value as ReturnStatus);
      
    case "generate_labels":
      return generateReturnLabels(returnsToProcess);
      
    case "process_refunds":
      return processReturnRefunds(returnsToProcess);
      
    case "send_notifications":
      return sendReturnNotifications(returnsToProcess);
      
    default:
      throw new Error(`Unknown action: ${action}`);
  }
};

/**
 * Update return statuses in bulk
 */
export const bulkUpdateReturnStatus = async (
  returns: ReturnRequest[],
  status: ReturnStatus,
  processingNotes?: string
): Promise<{ success: boolean; updatedReturns: ReturnRequest[]; failedEmails: string[] }> => {
  const updatedReturns = returns.map(returnReq => ({
    ...returnReq,
    status,
    processingNotes: processingNotes ? processingNotes : returnReq.processingNotes,
    lastNotificationStatus: "Not Sent" as EmailStatus
  }));
  
  const failedEmails: string[] = [];
  
  // In a real app, this would have more robust error handling
  return {
    success: true,
    updatedReturns,
    failedEmails
  };
};

/**
 * Generate return labels in bulk - this is the one needed by ReturnsTabContent
 */
export const bulkGenerateReturnLabels = async (
  returns: ReturnRequest[]
): Promise<ReturnRequest[]> => {
  // In a real application, this would generate return shipping labels
  return returns.map(returnReq => ({
    ...returnReq,
    labelGenerated: true,
    labelUrl: generateReturnLabel(returnReq)
  }));
};

/**
 * Process return refunds in bulk - this is the one needed by ReturnsTabContent
 */
export const bulkProcessRefunds = (
  returns: ReturnRequest[]
): ReturnRequest[] => {
  // Only process returns that are in 'Completed' status
  return returns.map(returnReq => {
    if (returnReq.status === "Completed" || returnReq.status === "Approved") {
      const refundAmount = returnReq.items.reduce((sum, item) => sum + item.price, 0);
      return {
        ...returnReq,
        refundStatus: "Completed" as ReturnStatus,
        refundAmount,
        refundDate: new Date().toISOString()
      };
    }
    return returnReq;
  });
};

/**
 * Send return notifications in bulk
 */
const sendReturnNotifications = async (returns: ReturnRequest[]): Promise<ReturnRequest[]> => {
  // In a real application, this would send emails to customers
  return returns.map(returnReq => ({
    ...returnReq,
    lastNotificationStatus: "Sent" as EmailStatus,
    lastNotificationDate: new Date().toISOString()
  }));
};
