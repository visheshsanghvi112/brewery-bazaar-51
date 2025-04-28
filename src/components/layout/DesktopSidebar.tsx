
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, User, LogIn, UserPlus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";

interface NavItem {
  path: string;
  label: string;
  icon?: React.ElementType;
}

const mainNavItems: NavItem[] = [
  { path: "/", label: "Home" },
  { path: "/products", label: "Shop" },
  { path: "/about-us", label: "About Us" },
  { path: "/contact", label: "Contact" },
  { path: "/cart", label: "Cart" },
];

const authNavItems: NavItem[] = [
  { path: "/login", label: "Login", icon: LogIn },
  { path: "/register", label: "Register", icon: UserPlus },
  { path: "/profile", label: "My Account", icon: User },
];

const userNavItems: NavItem[] = [
  { path: "/profile", label: "My Profile", icon: User },
  { path: "/profile", label: "My Orders" },
  { path: "/profile?tab=wishlist", label: "My Wishlist" },
  { path: "/profile?tab=reviews", label: "My Reviews" },
  { path: "/profile?tab=settings", label: "Account Settings" },
];

const supportNavItems: NavItem[] = [
  { path: "/support", label: "Support Home" },
  { path: "/support/faqs", label: "FAQs" },
  { path: "/support/shipping", label: "Shipping Info" },
  { path: "/support/returns", label: "Returns & Exchanges" },
  { path: "/support/size-guide", label: "Size Guide" },
  { path: "/support/track-order", label: "Track Order" },
];

const additionalNavItems: NavItem[] = [
  { path: "/careers", label: "Careers" },
  { path: "/terms", label: "Terms of Service" },
  { path: "/privacy", label: "Privacy Policy" },
];

interface SidebarMenuGroupProps {
  title: string;
  items: NavItem[];
}

function SidebarMenuGroup({ title, items }: SidebarMenuGroupProps) {
  const location = useLocation();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const basePath = item.path.split('?')[0];
            // Check if current location matches this item's path (ignoring query params)
            const isActive = location.pathname === basePath;
            const Icon = item.icon;
            
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                >
                  <Link to={item.path} className="w-full flex items-center justify-between">
                    <div className="flex items-center">
                      {Icon && <Icon className="h-4 w-4 mr-2" />}
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight
                      className={`ml-2 h-4 w-4 opacity-0 transition-opacity group-hover/menu-item:opacity-100 ${
                        isActive ? "opacity-100" : ""
                      }`}
                    />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function DesktopSidebarContent() {
  const isAuthenticated = !!auth?.currentUser;
  
  return (
    <Sidebar side="right">
      <SidebarRail />
      <SidebarContent>
        <SidebarMenuGroup title="Main Navigation" items={mainNavItems} />
        {isAuthenticated ? (
          <SidebarMenuGroup title="My Account" items={userNavItems} />
        ) : (
          <SidebarMenuGroup title="Account" items={authNavItems} />
        )}
        <SidebarMenuGroup title="Support" items={supportNavItems} />
        <SidebarMenuGroup title="Company" items={additionalNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-3 text-xs text-center text-muted-foreground">
          © {new Date().getFullYear()} Brewery. All rights reserved.
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function DesktopSidebar() {
  // Now this is always hidden, regardless of screen size
  return (
    <div className="hidden">
      <SidebarProvider>
        <DesktopSidebarContent />
      </SidebarProvider>
    </div>
  );
}
