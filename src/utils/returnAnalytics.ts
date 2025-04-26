
import { ReturnRequest, ReturnAnalytics, ReturnStatus } from "@/types";

/**
 * Calculates return analytics based on return requests
 */
export const calculateReturnAnalytics = (returns: ReturnRequest[], orders: any[]): ReturnAnalytics => {
  // Total returns
  const totalReturns = returns.length;
  
  // Return rate
  const returnRate = totalReturns > 0 && orders.length > 0 
    ? (totalReturns / orders.length) * 100 
    : 0;
  
  // Total refunded
  const totalRefunded = returns.reduce((acc, ret) => {
    return acc + (ret.refundAmount || 0);
  }, 0);
  
  // Average processing time (in days)
  const avgProcessingDays = returns
    .filter(ret => ret.status === 'Completed' && ret.refundDate)
    .map(ret => {
      const start = new Date(ret.createdAt).getTime();
      const end = new Date(ret.refundDate!).getTime();
      return (end - start) / (1000 * 60 * 60 * 24); // convert to days
    });
  
  const averageProcessingTime = avgProcessingDays.length > 0
    ? avgProcessingDays.reduce((acc, days) => acc + days, 0) / avgProcessingDays.length
    : 0;
  
  // Returns by status
  const statusCounts: Record<ReturnStatus, number> = {
    'Requested': 0,
    'Approved': 0,
    'In Progress': 0,
    'Completed': 0,
    'Rejected': 0
  };
  
  returns.forEach(ret => {
    statusCounts[ret.status]++;
  });
  
  const returnsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
    status: status as ReturnStatus,
    count
  }));
  
  // Returns by reason
  const reasonCounts: Record<string, number> = {};
  
  returns.forEach(ret => {
    const reason = ret.reason;
    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
  });
  
  const returnsByReason = Object.entries(reasonCounts).map(([reason, count]) => ({
    reason,
    count
  }));
  
  // Monthly returns
  const monthlyData: Record<string, number> = {};
  
  returns.forEach(ret => {
    const date = new Date(ret.createdAt);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
  });
  
  const monthlyReturns = Object.entries(monthlyData)
    .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
    .map(([month, count]) => ({
      month,
      count
    }));
  
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

/**
 * Formats currency values (cents to dollars)
 */
export const formatCurrency = (amount: number): string => {
  return `$${(amount / 100).toFixed(2)}`;
};
