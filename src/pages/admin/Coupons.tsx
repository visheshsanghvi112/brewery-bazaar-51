import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getCouponsFromFirestore, updateCouponInFirestore } from "@/lib/firebase/couponOperations";
import { Coupon } from "@/types";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { CouponFormDialog } from "@/components/admin/CouponFormDialog";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await getCouponsFromFirestore();
      setCoupons(data);
    } catch (e) {
      toast({
        title: "Error listing coupons",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCoupon = async (coupon: Coupon) => {
    try {
      await updateCouponInFirestore({
        firestoreId: coupon.firestoreId,
        isActive: !coupon.isActive
      });
      fetchCoupons();
    } catch (e) {
      toast({ title: "Failed to update coupon status", variant: "destructive" });
    }
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Coupons</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create Coupon
        </Button>
      </div>

      <CouponFormDialog 
        open={showForm} 
        onOpenChange={setShowForm} 
        onSuccess={fetchCoupons} 
      />

      <div className="rounded-md border mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Loading coupons...</TableCell>
              </TableRow>
            ) : coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">No coupons found.</TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium">{coupon.code}</TableCell>
                  <TableCell className="capitalize">{coupon.type}</TableCell>
                  <TableCell>{coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}</TableCell>
                  <TableCell>{coupon.usageCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => toggleCoupon(coupon)}>
                      {coupon.isActive ? 'Disable' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
