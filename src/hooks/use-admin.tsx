
import { useState, useEffect } from 'react';
import { auth } from "@/integrations/firebase/client";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  const setAdminStatus = (status: boolean) => {
    setIsAdmin(status);
    if (status) {
      localStorage.setItem('userRole', 'admin');
    } else {
      localStorage.removeItem('userRole');
    }
  };
  
  useEffect(() => {
    const checkAdmin = () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setIsAdmin(false);
        return;
      }
      
      const userRole = localStorage.getItem('userRole');
      const isUserAdmin = userRole === 'admin';
      
      console.log("Checking admin status:", { 
        currentUser: currentUser.email,
        userRole,
        isAdmin: isUserAdmin
      });
      
      setIsAdmin(isUserAdmin);
    };
    
    // Check immediately
    checkAdmin();
    
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setIsAdmin(false);
      } else {
        checkAdmin();
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  return { isAdmin, setAdminStatus };
}
