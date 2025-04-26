
import { DashboardTabContent } from "@/components/admin/DashboardTabContent";
import { useAdmin } from "@/contexts/AdminContext";

export default function AdminDashboard() {
  const { orders } = useAdmin();
  
  const setActiveTab = (tab: string) => {
    // Handle navigation programmatically
    window.location.href = `/admin/${tab}`;
  };

  return (
    <div className="py-6">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <DashboardTabContent orders={orders} setActiveTab={setActiveTab} />
    </div>
  );
}
