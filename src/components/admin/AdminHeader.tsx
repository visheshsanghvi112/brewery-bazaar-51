
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAdmin } from "@/hooks/use-admin";

interface AdminHeaderProps {
  onLogout: () => void;
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  const { setAdminStatus } = useAdmin();
  
  const handleLogout = () => {
    setAdminStatus(false);
    onLogout();
  };
  
  return (
    <>
      <div className="flex justify-between mb-6">
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
        <ThemeToggle />
      </div>
      
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
      >
        Admin Dashboard
      </motion.h1>
    </>
  );
}
