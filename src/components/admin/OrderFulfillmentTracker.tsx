
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, Truck } from "lucide-react";
import { Order } from "@/types";

interface OrderFulfillmentTrackerProps {
  order: Order;
  onUpdate: (orderId: string, fulfillmentStatus: string, trackingNumber?: string) => void;
}

export const OrderFulfillmentTracker = ({ order, onUpdate }: OrderFulfillmentTrackerProps) => {
  const [status, setStatus] = useState(order.fulfillmentStatus || "Pending");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [isUpdating, setIsUpdating] = useState(false);

  // Define fulfillment steps
  const steps = ["Pending", "Preparing", "Packed", "Shipped", "Delivered"];
  const currentStep = steps.indexOf(status);

  // Handle update
  const handleUpdate = () => {
    setIsUpdating(true);
    onUpdate(order.id, status, trackingNumber);
    setTimeout(() => setIsUpdating(false), 500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Fulfillment Status</h3>
        {order.inventoryUpdated ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Check className="h-3 w-3 mr-1" /> Inventory Updated
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Inventory has been updated for this order</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <AlertCircle className="h-3 w-3 mr-1" /> Inventory Pending
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Inventory has not been updated for this order</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="grid grid-cols-5 gap-1">
        {steps.map((step, index) => (
          <div 
            key={step}
            className={`relative flex flex-col items-center ${
              index < steps.length - 1 ? "after:absolute after:top-3 after:w-full after:h-0.5 after:right-0 after:translate-x-1/2 after:bg-muted" : ""
            }`}
          >
            <div 
              className={`z-10 flex items-center justify-center w-6 h-6 rounded-full border ${
                index <= currentStep 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "bg-muted border-muted-foreground/20"
              }`}
            >
              {index < currentStep ? (
                <Check className="h-3 w-3" />
              ) : index === currentStep ? (
                <div className="h-3 w-3 rounded-full bg-primary-foreground" />
              ) : null}
            </div>
            <span className={`text-xs mt-1 ${
              index <= currentStep ? "text-foreground" : "text-muted-foreground"
            }`}>
              {step}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-2">
        <div>
          <label htmlFor="status" className="text-sm font-medium">
            Update Status
          </label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {steps.map(step => (
                <SelectItem key={step} value={step}>{step}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(status === "Shipped" || status === "Delivered") && (
          <div>
            <label htmlFor="tracking" className="text-sm font-medium">
              Tracking Number
            </label>
            <div className="flex gap-2">
              <input
                id="tracking"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Truck className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Generate Shipping Label</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
        
        <Button onClick={handleUpdate} disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Fulfillment"}
        </Button>
      </div>
    </div>
  );
};
