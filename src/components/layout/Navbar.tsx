import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Search, LogOut } from "lucide-react";
import { categories } from "@/lib/data";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarNav } from "./SidebarNav";
import { DesktopSidebar } from "./DesktopSidebar";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter categories to only show T-shirts and Shorts
  const filteredCategories = categories.filter(
    category => category.slug === "t-shirts" || category.slug === "shorts"
  );

  // Check authentication status
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    setIsAuthenticated(!!role);
  }, [location.pathname]); // Re-check when route changes

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setUserRole(null);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    navigate("/login");
  };

  return (
    <nav className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo - Increased size */}
        <Link to="/" className="flex items-center">
          <div className="h-16 w-auto">
            <img 
              src="/lovable-uploads/79b98de2-50cc-47c0-b418-3357179b4a84.png" 
              alt="Brewery Logo" 
              className="h-full object-contain dark:invert" 
            />
          </div>
        </Link>

        {/* Desktop Navigation - Simplified */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm font-medium hover:text-primary transition-colors ${
              location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="link" 
                className={`p-0 text-sm font-medium hover:text-primary transition-colors ${
                  location.pathname.includes("/products") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Shop
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {categories.filter(cat => cat.slug === "t-shirts" || cat.slug === "shorts").map((category) => (
                <DropdownMenuItem key={category.id} asChild>
                  <Link to={`/products?category=${category.slug}`} className="cursor-pointer w-full">
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/products" className="cursor-pointer w-full">
                  View All
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link 
            to="/contact" 
            className={`text-sm font-medium hover:text-primary transition-colors ${
              location.pathname === "/contact" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10"
            asChild
          >
            <Link to="/search" aria-label="Search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10"
            asChild
          >
            <Link to="/cart" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          <ThemeToggle />
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {localStorage.getItem("userName")}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                {userRole === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden md:flex"
            >
              <Link to="/login" aria-label="Account">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}
          
          {/* Mobile Sidebar Trigger */}
          <SidebarNav />
        </div>
      </div>
    </nav>
  );
}
