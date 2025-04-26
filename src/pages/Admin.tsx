
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAdmin as useAdminAuth } from "@/hooks/use-admin";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminDashboard from "./admin/Dashboard";
import AdminProducts from "./admin/Products";
import AdminOrders from "./admin/Orders";
import AdminReturns from "./admin/Returns";
import AdminCustomers from "./admin/Customers";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();
  const { isAdmin, setAdminStatus } = useAdminAuth();
  
  // Check if user is already logged in
  useEffect(() => {
    if (isAdmin) {
      setIsLoggedIn(true);
    }
  }, [isAdmin]);
  
  // Show login message with demo credentials if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Admin Dashboard",
        description: "Use admin@test.com / admin to log in",
      });
    }
  }, [isLoggedIn, toast]);
  
  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminStatus(false);
    toast({
      title: "Logout Successful",
      description: "You have been logged out of the admin dashboard.",
    });
  };

  // If not logged in, show login form
  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <ThemeToggle />
        </div>
        <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />
      </div>
    );
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="returns" element={<AdminReturns />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}
