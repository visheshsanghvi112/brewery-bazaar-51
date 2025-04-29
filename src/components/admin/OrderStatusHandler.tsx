
import { OrderStatus } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/integrations/firebase/client";
import { doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

interface OrderStatusHandlerProps {
  orderId: string;
  firestoreId?: string;
  currentStatus: OrderStatus;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const OrderStatusHandler = ({ orderId, firestoreId, currentStatus, onUpdateStatus }: OrderStatusHandlerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  const handleUpdateStatus = async () => {
    if (!firestoreId) {
      console.error("FirestoreId is missing, cannot update status");
      toast({
        title: "Error",
        description: "Cannot update order status: Firestore ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // Update the status in Firestore
      const orderRef = doc(db, "orders", firestoreId);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state through provided callback
      onUpdateStatus(orderId, status);
      
      toast({
        title: "Status updated",
        description: `Order #${orderId} status has been changed to ${status}`,
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating the order status",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
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
        <Button size="sm" onClick={handleUpdateStatus} disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} disabled={isUpdating}>
          Cancel
        </Button>
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
