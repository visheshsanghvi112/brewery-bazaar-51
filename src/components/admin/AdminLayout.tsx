import { Link, useLocation } from "react-router-dom";
import { BarChart, Package, ShoppingCart, Users, RefreshCw, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AdminHeader } from "./AdminHeader";
import { AdminProvider } from "@/contexts/AdminContext";

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  const location = useLocation();
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminHeader onLogout={onLogout} />
      
      <AdminProvider>
        <div className="mt-6">
          <nav className="mb-8 flex flex-wrap gap-2">
            <Link to="/admin">
              <Button
                variant={isActiveRoute("/admin") ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <BarChart className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/admin/products">
              <Button
                variant={isActiveRoute("/admin/products") ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Products
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button
                variant={isActiveRoute("/admin/orders") ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Orders
              </Button>
            </Link>
            <Link to="/admin/returns">
              <Button
                variant={isActiveRoute("/admin/returns") ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Returns
              </Button>
            </Link>
            <Link to="/admin/customers">
              <Button
                variant={isActiveRoute("/admin/customers") ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Customers
              </Button>
            </Link>
            <Link to="/admin/categories">
              <Button
                variant={isActiveRoute("/admin/categories") ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <FolderOpen className="h-4 w-4" />
                Categories
              </Button>
            </Link>
          </nav>
          
          {children}
        </div>
      </AdminProvider>
    </div>
  );
}
