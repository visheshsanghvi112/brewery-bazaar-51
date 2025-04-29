
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { db } from "@/integrations/firebase/client";
import { doc, updateDoc } from "firebase/firestore";

interface BatchOrderProcessorProps {
  orders: any[];
  onBatchProcess: (orderIds: string[], action: string, value?: string) => void;
  isProcessing?: boolean;
}

export const BatchOrderProcessor = ({ orders, onBatchProcess, isProcessing = false }: BatchOrderProcessorProps) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedOrders(newSelectAll ? orders.map(order => order.id) : []);
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handleAction = async (action: string, value?: string) => {
    if (selectedOrders.length > 0 && !isProcessing) {
      // Execute the action in Firestore before updating the UI
      if (action === "updateStatus" && value) {
        try {
          // Update each selected order in Firebase
          const updatePromises = selectedOrders.map(orderId => {
            const order = orders.find(o => o.id === orderId);
            if (order && order.firestoreId) {
              const orderRef = doc(db, "orders", order.firestoreId);
              return updateDoc(orderRef, {
                status: value,
                updatedAt: new Date().toISOString()
              });
            }
            return Promise.resolve();
          });
          
          // Wait for all updates to complete
          await Promise.all(updatePromises);
          
          // Now update the UI through the provided callback
          onBatchProcess(selectedOrders, action, value);
        } catch (error) {
          console.error("Error updating orders in Firestore:", error);
        }
      } else {
        // For other actions that don't directly impact Firestore
        onBatchProcess(selectedOrders, action, value);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="select-all-orders" 
            checked={selectAll} 
            onCheckedChange={handleSelectAll}
            disabled={orders.length === 0 || isProcessing}
          />
          <label 
            htmlFor="select-all-orders"
            className="text-sm cursor-pointer select-none"
          >
            Select All
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          {selectedOrders.length > 0 && (
            <Badge variant="outline">
              {selectedOrders.length} selected
            </Badge>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={selectedOrders.length === 0 || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Batch Actions <ChevronDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleAction("updateStatus", "Processing")}>
                Mark as Processing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("updateStatus", "Shipped")}>
                Mark as Shipped
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("updateStatus", "Delivered")}>
                Mark as Delivered
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("updateStatus", "Cancelled")}>
                Mark as Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="overflow-auto max-h-[300px] border rounded-md p-2 bg-background">
        {orders.map(order => (
          <div 
            key={order.id} 
            className="flex items-center space-x-3 px-2 py-1.5 hover:bg-muted/50 rounded-md"
          >
            <Checkbox 
              checked={selectedOrders.includes(order.id)} 
              onCheckedChange={() => handleSelectOrder(order.id)}
              disabled={isProcessing}
            />
            <div className="flex flex-1 items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium">#{order.id}</span>
                <span className="text-xs text-muted-foreground">
                  {order.customerName || order.customer?.name || "Unknown customer"}
                </span>
              </div>
              <Badge variant={
                order.status === "Processing" ? "default" : 
                order.status === "Shipped" ? "secondary" :
                order.status === "Delivered" ? "success" : 
                order.status === "Return Requested" ? "warning" : 
                order.status === "Returned" ? "outline" : 
                "destructive"
              }>
                {order.status}
              </Badge>
            </div>
          </div>
        ))}
        
        {orders.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No orders available
          </div>
        )}
      </div>
    </div>
  );
};
