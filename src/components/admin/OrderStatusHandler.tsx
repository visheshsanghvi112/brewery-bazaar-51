
import { OrderStatus } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/integrations/firebase/client";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";
import { sendOrderStatusUpdateEmail } from "@/utils/emailService";

interface OrderStatusHandlerProps {
  orderId: string;
  firestoreId?: string;
  currentStatus: OrderStatus;
  customerEmail?: string;
  customerName?: string;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const OrderStatusHandler = ({ 
  orderId, 
  firestoreId, 
  currentStatus, 
  customerEmail, 
  customerName,
  onUpdateStatus 
}: OrderStatusHandlerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
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
      const orderRef = doc(db, "orders", firestoreId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        throw new Error("Order document not found in Firestore");
      }
      
      const orderData = orderDoc.data();
      
      // Update the status in Firestore
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date().toISOString(),
        lastEmailNotification: {
          status: "Not Sent",
          date: new Date().toISOString()
        }
      });
      
      // Update local state through provided callback
      onUpdateStatus(orderId, status);
      
      toast({
        title: "Status updated",
        description: `Order #${orderId} status has been changed to ${status}`,
      });
      
      // Send email notification if customer email is available
      if (customerEmail && (status === "Shipped" || status === "Delivered" || status === "Cancelled")) {
        setIsSendingEmail(true);
        try {
          // Construct minimal order object with required fields for email
          const orderForEmail = {
            id: orderId,
            status,
            customer: {
              name: customerName || "Customer",
              email: customerEmail
            },
            trackingNumber: orderData?.trackingNumber,
            firestoreId
          };
          
          const emailResult = await sendOrderStatusUpdateEmail(orderForEmail);
          
          if (emailResult.success) {
            // Update the order with email notification status
            await updateDoc(orderRef, {
              lastEmailNotification: {
                status: "Sent",
                date: new Date().toISOString()
              }
            });
            
            toast({
              title: "Notification sent",
              description: `Status update email sent to ${customerEmail}`,
            });
          } else {
            throw new Error("Failed to send email");
          }
        } catch (error) {
          console.error("Error sending notification email:", error);
          toast({
            title: "Email notification failed",
            description: "Could not send status update email to customer",
            variant: "destructive"
          });
        } finally {
          setIsSendingEmail(false);
        }
      }
      
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
        <Button size="sm" onClick={handleUpdateStatus} disabled={isUpdating || isSendingEmail}>
          {isUpdating ? "Updating..." : isSendingEmail ? "Sending..." : "Update"}
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
