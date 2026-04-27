
import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { ReturnsTabContent } from "@/components/admin/ReturnsTabContent";
import { ReturnRequest, Order } from "@/types";
import { calculateReturnAnalytics } from "@/utils/returnAnalytics";
import { Tabs } from "@/components/ui/tabs";
import { db } from "@/integrations/firebase/client";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

export default function AdminReturns() {
  const { orders } = useAdmin();
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  
  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const returnsRef = collection(db, "returnRequests");
        const q = query(returnsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as ReturnRequest);
        setReturnRequests(data);
      } catch (e) {
        console.error("Error fetching returns for analytics:", e);
      }
    };
    fetchReturns();
  }, []);
  
  // Calculate analytics for the header display
  const analytics = calculateReturnAnalytics(returnRequests, orders);

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Returns Management</h2>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Returns</p>
            <p className="text-2xl font-semibold">{analytics.totalReturns}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Return Rate</p>
            <p className="text-2xl font-semibold">{analytics.returnRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>
      
      {/* Wrap ReturnsTabContent with Tabs component */}
      <Tabs defaultValue="list">
        <ReturnsTabContent />
      </Tabs>
    </div>
  );
}
