
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAdmin as useAdminAuth } from "@/hooks/use-admin";
import { AdminProvider } from "@/contexts/AdminContext";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DashboardCards } from "@/components/admin/DashboardCards";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { categories } from "@/lib/data";

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
    <div className="container mx-auto px-4 py-8">
      <AdminHeader onLogout={handleLogout} />
      
      <AdminProvider>
        <DashboardCards 
          orders={[]} 
          products={[]} 
          categories={categories} 
          customers={[]} 
        />
        
        <AdminTabs />
      </AdminProvider>
    </div>
  );
}
