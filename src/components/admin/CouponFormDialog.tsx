import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/integrations/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface CouponFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CouponFormDialog({ open, onOpenChange, onSuccess }: CouponFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minPurchase: "",
    usageLimit: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.value) {
      toast({ title: "Incomplete data", description: "Please fill in code and value", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Use the code as document ID (lowercase) to prevent duplicates
      const couponId = formData.code.toLowerCase().trim();
      const { doc, setDoc } = await import("firebase/firestore");
      
      await setDoc(doc(db, "coupons", couponId), {
        code: formData.code.toUpperCase().trim(),
        type: formData.type,
        value: Number(formData.value),
        minPurchase: Number(formData.minPurchase || 0) * 100, // INR in paise
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        usageCount: 0,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({ title: "Coupon Created", description: `Code ${formData.code} is now active on Mumbai instance.` });
      onSuccess();
      onOpenChange(false);
      setFormData({ code: "", type: "percentage", value: "", minPurchase: "", usageLimit: "" });
    } catch (error: any) {
      console.error("Coupon creation error:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-primary/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Create New Coupon
            </DialogTitle>
            <DialogDescription>
              Configure a discount code for the Mumbai store instance.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-5">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right font-medium">Code</Label>
              <Input 
                id="code" 
                placeholder="PROMO25" 
                className="col-span-3 border-primary/20 focus:border-primary" 
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right font-medium">Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(val) => setFormData({...formData, type: val})}
              >
                <SelectTrigger className="col-span-3 border-primary/20">
                  <SelectValue placeholder="Discount Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right font-medium">
                {formData.type === 'percentage' ? "Percent" : "Amount"}
              </Label>
              <Input 
                id="value" 
                type="number" 
                placeholder={formData.type === 'percentage' ? "25" : "500"} 
                className="col-span-3 border-primary/20"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minPurchase" className="text-right font-medium text-xs leading-tight">Min Order (₹)</Label>
              <Input 
                id="minPurchase" 
                type="number" 
                placeholder="1000" 
                className="col-span-3 border-primary/20"
                value={formData.minPurchase}
                onChange={(e) => setFormData({...formData, minPurchase: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="usageLimit" className="text-right font-medium text-xs leading-tight">Usage Limit</Label>
              <Input 
                id="usageLimit" 
                type="number" 
                placeholder="Unlimited" 
                className="col-span-3 border-primary/20"
                value={formData.usageLimit}
                onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
              {isSubmitting ? "Processing..." : "Create Active Coupon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
