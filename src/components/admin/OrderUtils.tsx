
import { useState } from "react";
import { db } from "@/integrations/firebase/client";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Order, OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash, AlertTriangle } from "lucide-react";

interface OrderActionsProps {
  order: Order;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onOrderDelete: (orderId: string) => void;
}

export const OrderActions = ({ order, onStatusChange, onOrderDelete }: OrderActionsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  const handleUpdateStatus = async (status: OrderStatus) => {
    if (!order.firestoreId) {
      toast({
        title: "Error",
        description: "Cannot update order: Firestore ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const orderRef = doc(db, "orders", order.firestoreId);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date().toISOString()
      });
      
      onStatusChange(order.id, status);
      
      toast({
        title: "Order updated",
        description: `Order #${order.id} status changed to ${status}`,
      });
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
  
  const handleDeleteOrder = async () => {
    if (!order.firestoreId) {
      toast({
        title: "Error",
        description: "Cannot delete order: Firestore ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const orderRef = doc(db, "orders", order.firestoreId);
      await deleteDoc(orderRef);
      
      onOrderDelete(order.id);
      
      toast({
        title: "Order deleted",
        description: `Order #${order.id} has been permanently deleted`,
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the order",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="flex space-x-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive" 
            size="sm"
            disabled={isUpdating}
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-destructive">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Delete Order #{order.id}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the order
              and all associated data from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteOrder}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const updateOrderBatch = async (
  orders: Order[], 
  orderIds: string[], 
  status: OrderStatus
): Promise<void> => {
  try {
    const updatePromises = orderIds.map(id => {
      const order = orders.find(o => o.id === id);
      if (order?.firestoreId) {
        const orderRef = doc(db, "orders", order.firestoreId);
        return updateDoc(orderRef, {
          status,
          updatedAt: new Date().toISOString()
        });
      }
      return Promise.resolve();
    });
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error in batch update:", error);
    throw error;
  }
};
