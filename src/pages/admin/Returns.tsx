
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useAdmin } from "@/contexts/AdminContext";
import { ReturnsTabContent } from "@/components/admin/ReturnsTabContent";
import { ReturnRequest, Order } from "@/types";
import { calculateReturnAnalytics } from "@/utils/returnAnalytics";
import { Tabs } from "@/components/ui/tabs"; // Add Tabs import

export default function AdminReturns() {
  const { orders } = useAdmin();
  const [returnRequests] = useLocalStorage<ReturnRequest[]>("returnRequests", []);
  
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
