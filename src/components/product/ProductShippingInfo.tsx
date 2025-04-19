
import React from "react";
import { Truck, Clock, Shield } from "lucide-react";

export default function ProductShippingInfo() {
  return (
    <div className="border-t border-b py-4 space-y-3">
      <div className="flex items-center gap-2">
        <Truck className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm">Free shipping on orders over ₹999</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm">30-day easy returns</span>
      </div>
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm">1-year warranty on all products</span>
      </div>
    </div>
  );
}
