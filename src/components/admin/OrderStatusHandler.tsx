
import { OrderStatus } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderStatusHandlerProps {
  orderId: string;
  currentStatus: OrderStatus;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const OrderStatusHandler = ({ orderId, currentStatus, onUpdateStatus }: OrderStatusHandlerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  
  const handleUpdateStatus = () => {
    onUpdateStatus(orderId, status);
    setIsEditing(false);
  };
  
  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <Select value={status} onValueChange={(value) => setStatus(value as OrderStatus)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="Return Requested">Return Requested</SelectItem>
            <SelectItem value="Returned">Returned</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" onClick={handleUpdateStatus}>Update</Button>
        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
      </div>
    );
  }
  
  return (
    <div className="flex items-center space-x-2">
      <StatusBadge status={currentStatus} />
      <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>Change</Button>
    </div>
  );
};
