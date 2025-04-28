
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAdmin } from "@/hooks/use-admin";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminDashboard from "./admin/Dashboard";
import AdminProducts from "./admin/Products";
import AdminOrders from "./admin/Orders";
import AdminReturns from "./admin/Returns";
import AdminCustomers from "./admin/Customers";
import { AdminProvider } from "@/contexts/AdminContext";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAdmin();
  
  // Redirect non-admin users to admin login
  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Please login with an admin account to access this page.",
        variant: "destructive",
      });
      navigate("/admin-login");
    }
  }, [isAdmin, navigate, toast]);

  // If not admin, don't render anything while redirecting
  if (!isAdmin) {
    return null;
  }

  return (
    <AdminProvider>
      <AdminLayout onLogout={() => navigate("/login")}>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="returns" element={<AdminReturns />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminLayout>
    </AdminProvider>
  );
}
