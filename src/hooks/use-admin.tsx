
import { useState, useEffect } from 'react';
import { auth } from "@/integrations/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";
import { onAuthStateChanged } from 'firebase/auth';

// Define a TypeScript interface for the hook's return value
interface UseAdminReturn {
  isAdmin: boolean;
  isLoading: boolean;
  setAdminStatus: (status: boolean) => void;
}

export function useAdmin(): UseAdminReturn {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkAdmin = async (user: any) => {
      setIsLoading(true);
      
      if (!user) {
        setIsAdmin(false);
        localStorage.removeItem('userRole');
        setIsLoading(false);
        return;
      }
      
      try {
        // Check if user email is admin@test.com
        if (user.email !== "admin@test.com") {
          setIsAdmin(false);
          localStorage.removeItem('userRole');
          setIsLoading(false);
          return;
        }
        
        // Check admins collection
        const adminRef = doc(db, "admins", user.uid);
        const adminSnap = await getDoc(adminRef);
        
        if (adminSnap.exists() && adminSnap.data().role === "admin") {
          setIsAdmin(true);
          localStorage.setItem('userRole', 'admin');
          setIsLoading(false);
          return;
        }
        
        setIsAdmin(false);
        localStorage.removeItem('userRole');
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
        localStorage.removeItem('userRole');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      await checkAdmin(user);
    });
    
    // Check immediately on initial load
    if (auth.currentUser) {
      checkAdmin(auth.currentUser);
    } else {
      setIsLoading(false);
    }
    
    return () => unsubscribe();
  }, []);
  
  // Add the setAdminStatus function
  const setAdminStatus = (status: boolean) => {
    setIsAdmin(status);
    if (status) {
      localStorage.setItem('userRole', 'admin');
    } else {
      localStorage.removeItem('userRole');
    }
  };
  
  return { isAdmin, isLoading, setAdminStatus };
}
