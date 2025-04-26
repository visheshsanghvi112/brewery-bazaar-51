
import { useAdmin } from "@/contexts/AdminContext";
import { OrdersTabContent } from "@/components/admin/OrdersTabContent";

export default function AdminOrders() {
  const { orders, setViewingOrder } = useAdmin();

  return (
    <div className="py-6">
      <h2 className="text-3xl font-bold mb-6">Orders</h2>
      <OrdersTabContent
        orders={orders}
        setViewingOrder={setViewingOrder}
      />
    </div>
  );
}
