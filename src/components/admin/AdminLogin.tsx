
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAdmin as useAdminAuth } from "@/hooks/use-admin";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const { toast } = useToast();
  const { setAdminStatus } = useAdminAuth();
  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: ""
  });
  
  // Handle login form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim whitespace from inputs to avoid common issues
    const email = loginCredentials.email.trim();
    const password = loginCredentials.password.trim();
    
    console.log("Login attempt:", { email, password }); // Debug logging
    
    if (email === "admin@test.com" && password === "admin") {
      setAdminStatus(true);
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard!",
      });
      onLoginSuccess();
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please use admin@test.com / admin",
        variant: "destructive",
      });
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto my-16 p-8 bg-card rounded-lg shadow-lg border"
    >
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            value={loginCredentials.email}
            onChange={(e) => setLoginCredentials({...loginCredentials, email: e.target.value})}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary"
            placeholder="admin@test.com"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input
            id="password"
            type="password"
            value={loginCredentials.password}
            onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary"
            placeholder="admin"
            required
          />
        </div>
        <div className="text-center text-sm text-muted-foreground mb-4">
          Use admin@test.com / admin to log in
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </motion.div>
  );
}
