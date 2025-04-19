
import { OrderStatus, ReturnStatus } from "@/types";

interface StatusBadgeProps {
  status: OrderStatus | ReturnStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status) {
      // Order statuses
      case "Processing":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300";
      case "Shipped":
        return "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-300";
      case "Delivered":
        return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-300";
      case "Cancelled":
        return "bg-red-500/20 text-red-700 dark:text-red-300 border-red-300";
      case "Return Requested":
        return "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300";
      case "Returned":
        return "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300";
      
      // Return request statuses
      case "Requested":
        return "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300";
      case "Approved":
        return "bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-300";
      case "In Progress":
        return "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-300";
      case "Completed":
        return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-300";
      case "Rejected":
        return "bg-red-500/20 text-red-700 dark:text-red-300 border-red-300";
        
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-300";
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor()}`}>
      {status}
    </span>
  );
};
