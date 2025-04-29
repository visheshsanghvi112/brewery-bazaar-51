
import { ReturnRequest, Order, ReturnStatus } from "@/types";

interface ReturnAnalytics {
  totalReturns: number;
  returnRate: number;
  totalRefunded: number;
  averageProcessingTime: number;
  returnsByStatus: {
    status: ReturnStatus;
    count: number;
  }[];
  returnsByReason: {
    reason: string;
    count: number;
  }[];
  monthlyReturns: {
    month: string;
    count: number;
  }[];
}

export const calculateReturnAnalytics = (
  returnRequests: ReturnRequest[],
  orders: Order[]
): ReturnAnalytics => {
  // Total returns
  const totalReturns = returnRequests.length;
  
  // Return rate (percentage of orders that were returned)
  const returnRate = orders.length > 0 
    ? (totalReturns / orders.length) * 100 
    : 0;
  
  // Total amount refunded
  const totalRefunded = returnRequests.reduce(
    (sum, request) => sum + (request.refundAmount || 0),
    0
  );
  
  // Calculate average processing time (in days)
  const processedReturns = returnRequests.filter(
    request => request.status === "Completed"
  );
  
  let averageProcessingTime = 0;
  if (processedReturns.length > 0) {
    const totalProcessingTime = processedReturns.reduce((total, request) => {
      const createDate = new Date(request.createdAt).getTime();
      const completeDate = request.refundDate 
        ? new Date(request.refundDate).getTime()
        : new Date().getTime();
        
      return total + (completeDate - createDate) / (1000 * 60 * 60 * 24); // Convert to days
    }, 0);
    
    averageProcessingTime = totalProcessingTime / processedReturns.length;
  }
  
  // Returns grouped by status
  const statusCounts = new Map<ReturnStatus, number>();
  returnRequests.forEach(request => {
    const status = request.status;
    statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
  });
  
  const returnsByStatus = Array.from(statusCounts.entries()).map(
    ([status, count]) => ({ status, count })
  );
  
  // Returns grouped by reason
  const reasonCounts = new Map<string, number>();
  returnRequests.forEach(request => {
    // Extract the main reason from the possibly longer reason string
    let reason = request.reason || "Unknown";
    if (reason.includes(':')) {
      reason = reason.split(':')[0].trim();
    }
    
    reasonCounts.set(reason, (reasonCounts.get(reason) || 0) + 1);
  });
  
  const returnsByReason = Array.from(reasonCounts.entries()).map(
    ([reason, count]) => ({ reason, count })
  );
  
  // Monthly return trends
  const monthlyReturnMap = new Map<string, number>();
  
  // Initialize with last 6 months
  const today = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(today);
    d.setMonth(today.getMonth() - i);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyReturnMap.set(monthKey, 0);
  }
  
  // Count returns by month
  returnRequests.forEach(request => {
    const date = new Date(request.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyReturnMap.set(monthKey, (monthlyReturnMap.get(monthKey) || 0) + 1);
  });
  
  // Convert to array and sort chronologically
  const monthlyReturns = Array.from(monthlyReturnMap.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
  
  return {
    totalReturns,
    returnRate,
    totalRefunded,
    averageProcessingTime,
    returnsByStatus,
    returnsByReason,
    monthlyReturns
  };
};
