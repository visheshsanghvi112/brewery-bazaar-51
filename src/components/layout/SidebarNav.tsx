
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, User, ShoppingBag, Heart, LogIn, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const mainNavItems = [
  { path: "/", label: "Home" },
  { path: "/products", label: "Shop" },
  { path: "/about-us", label: "About Us" },
  { path: "/contact", label: "Contact" },
  { path: "/cart", label: "Cart" },
];

const authNavItems = [
  { path: "/login", label: "Login", icon: LogIn },
  { path: "/register", label: "Register", icon: UserPlus },
  { path: "/profile", label: "My Account", icon: User },
];

const supportNavItems = [
  { path: "/support", label: "Support Home" },
  { path: "/support/faqs", label: "FAQs" },
  { path: "/support/shipping", label: "Shipping Info" },
  { path: "/support/returns", label: "Returns & Exchanges" },
  { path: "/support/size-guide", label: "Size Guide" },
  { path: "/support/track-order", label: "Track Order" },
];

const additionalNavItems = [
  { path: "/careers", label: "Careers" },
  { path: "/terms", label: "Terms of Service" },
  { path: "/privacy", label: "Privacy Policy" },
];

export function SidebarNav() {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  const NavigationLink = ({ item }: { item: { path: string; label: string; icon?: React.ElementType } }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    
    return (
      <Link 
        to={item.path} 
        onClick={() => setOpen(false)}
        className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 group ${
          isActive 
            ? "bg-primary/10 text-primary font-medium" 
            : "hover:bg-primary/5"
        }`}
      >
        {Icon && <Icon className="h-4 w-4 mr-2" />}
        <span>{item.label}</span>
        <ChevronRight 
          className={`ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 ${
            isActive ? "opacity-100" : ""
          }`}
        />
      </Link>
    );
  };

  const NavGroup = ({ title, items }: { title: string; items: { path: string; label: string; icon?: React.ElementType }[] }) => (
    <div className="pb-5">
      <h3 className="px-4 mb-1 text-sm font-semibold text-muted-foreground">{title}</h3>
      <div className="space-y-1">
        {items.map((item) => (
          <NavigationLink key={item.path} item={item} />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent direction="right" className="fixed right-0 h-full w-[85%] sm:max-w-sm rounded-l-lg rounded-r-none">
          <DrawerHeader className="flex justify-between items-center">
            <DrawerTitle className="text-xl font-bold">BREWERY</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
                <span className="sr-only">Close menu</span>
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="px-2 py-2 overflow-auto flex-1">
            <NavGroup title="Main Navigation" items={mainNavItems} />
            <NavGroup title="Account" items={authNavItems} />
            <NavGroup title="Support" items={supportNavItems} />
            <NavGroup title="Company" items={additionalNavItems} />
          </div>
          <DrawerFooter className="pt-2 border-t">
            <div className="flex justify-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} Brewery. All rights reserved.
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
