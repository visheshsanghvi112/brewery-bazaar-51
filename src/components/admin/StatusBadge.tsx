
import { OrderStatus } from "@/types";

interface StatusBadgeProps {
  status: OrderStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "Processing":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300";
      case "Shipped":
        return "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-300";
      case "Delivered":
        return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-300";
      case "Cancelled":
        return "bg-red-500/20 text-red-700 dark:text-red-300 border-red-300";
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-300";
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
      {status}
    </span>
  );
};
