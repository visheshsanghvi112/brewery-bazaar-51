
import { useAdmin } from "@/contexts/AdminContext";
import { CustomersTabContent } from "@/components/admin/CustomersTabContent";

export default function AdminCustomers() {
  const { customers } = useAdmin();

  return (
    <div className="py-6">
      <h2 className="text-3xl font-bold mb-6">Customers</h2>
      <CustomersTabContent customers={customers} />
    </div>
  );
}
