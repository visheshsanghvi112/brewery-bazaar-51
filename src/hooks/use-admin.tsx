
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
      
      // Check if the user's email is admin@test.com
      if (currentUser.email === "admin@test.com") {
        setIsAdmin(true);
        localStorage.setItem('userRole', 'admin');
        return;
      }
      
      // Check Firestore for admin role
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists() && userSnap.data().role === "admin") {
          setIsAdmin(true);
          localStorage.setItem('userRole', 'admin');
          return;
        }
      } catch (error) {
        console.error("Error checking admin status in Firestore:", error);
      }
      
      // Fallback to localStorage check
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
    const unsubscribe = auth.onAuthStateChanged(() => {
      checkAdmin();
    });
    
    return () => unsubscribe();
  }, []);
  
  return { isAdmin, setAdminStatus };
}
