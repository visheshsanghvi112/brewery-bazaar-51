
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OrderStatus, Order } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle } from "lucide-react";

interface BatchOrderProcessorProps {
  orders: Order[];
  onBatchProcess: (orderIds: string[], action: string, value?: string) => void;
}

export const BatchOrderProcessor = ({ orders, onBatchProcess }: BatchOrderProcessorProps) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [action, setAction] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  // Available orders for batch processing (only processing and shipped)
  const availableOrders = orders.filter(
    order => order.status === "Processing" || order.status === "Shipped"
  );
  
  // Toggle selection of an order
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };
  
  // Select all orders
  const selectAllOrders = () => {
    if (selectedOrders.length === availableOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(availableOrders.map(order => order.id));
    }
  };
  
  // Handle processing
  const handleProcess = () => {
    if (selectedOrders.length === 0) {
      toast({
        title: "No orders selected",
        description: "Please select at least one order to process",
        variant: "destructive",
      });
      return;
    }
    
    if (!action) {
      toast({
        title: "No action selected",
        description: "Please select an action to perform",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Process the orders
      onBatchProcess(selectedOrders, action, value);
      
      // Show success toast
      toast({
        title: "Orders processed",
        description: `Successfully processed ${selectedOrders.length} orders`,
      });
      
      // Reset form
      setSelectedOrders([]);
      setAction("");
      setValue("");
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error processing orders",
        description: "An error occurred while processing the orders",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Batch Process Orders</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Batch Process Orders</DialogTitle>
          <DialogDescription>
            Select orders and an action to perform on them. This will update all selected orders at once.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="select-all"
                checked={selectedOrders.length === availableOrders.length && availableOrders.length > 0} 
                onCheckedChange={selectAllOrders}
              />
              <label htmlFor="select-all" className="text-sm font-medium">Select All</label>
            </div>
            <span className="text-sm text-muted-foreground">
              {selectedOrders.length} of {availableOrders.length} selected
            </span>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-2 text-left w-12"></th>
                    <th className="p-2 text-left">Order ID</th>
                    <th className="p-2 text-left">Customer</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {availableOrders.length > 0 ? (
                    availableOrders.map((order) => (
                      <tr key={order.id} className="border-t hover:bg-muted/30 transition-colors">
                        <td className="p-2">
                          <Checkbox 
                            checked={selectedOrders.includes(order.id)} 
                            onCheckedChange={() => toggleOrderSelection(order.id)}
                          />
                        </td>
                        <td className="p-2 font-medium">#{order.id}</td>
                        <td className="p-2">{order.customer.name}</td>
                        <td className="p-2">
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-muted-foreground">
                        No orders available for batch processing
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="action" className="text-sm font-medium">Action</label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger id="action">
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="update_status">Update Status</SelectItem>
                <SelectItem value="generate_labels">Generate Shipping Labels</SelectItem>
                <SelectItem value="update_inventory">Update Inventory</SelectItem>
                <SelectItem value="send_notifications">Send Email Notifications</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {action === "update_status" && (
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <Select value={value} onValueChange={setValue}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleProcess} 
            disabled={isProcessing || selectedOrders.length === 0 || !action}
          >
            {isProcessing ? "Processing..." : "Process Orders"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
