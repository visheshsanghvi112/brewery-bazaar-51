
import { useState, useEffect } from 'react';
import { auth } from "@/integrations/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

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
    const checkAdmin = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setIsAdmin(false);
        return;
      }
      
      // Only check admins collection
      try {
        const adminRef = doc(db, "admins", currentUser.uid);
        const adminSnap = await getDoc(adminRef);
        
        if (adminSnap.exists() && adminSnap.data().role === "admin") {
          setIsAdmin(true);
          localStorage.setItem('userRole', 'admin');
          return;
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
      
      setIsAdmin(false);
      localStorage.removeItem('userRole');
    };
    
    // Check immediately
    checkAdmin();
    
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(() => {
      checkAdmin();
    });
    
    return () => unsubscribe();
  }, []);
  
  return { isAdmin, setAdminStatus };
}
