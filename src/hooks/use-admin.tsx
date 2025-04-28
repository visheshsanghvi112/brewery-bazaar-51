
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
    // First check localStorage for a cached admin status
    const cachedRole = localStorage.getItem('userRole');
    if (cachedRole === 'admin') {
      setIsAdmin(true);
    }
    
    const checkAdmin = async (user: any) => {
      setIsLoading(true);
      
      if (!user) {
        setIsAdmin(false);
        localStorage.removeItem('userRole');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Checking admin status for user:", user.email);
        
        // Check if user email is admin@test.com
        if (user.email === "admin@test.com") {
          console.log("Admin email detected");
          
          // Check admins collection
          const adminRef = doc(db, "admins", user.uid);
          const adminSnap = await getDoc(adminRef);
          
          if (adminSnap.exists() && adminSnap.data().role === "admin") {
            console.log("User verified as admin in Firestore");
            setIsAdmin(true);
            localStorage.setItem('userRole', 'admin');
            setIsLoading(false);
            return;
          } else {
            console.log("User has admin email but not in admin collection");
          }
        }
        
        // Double check users collection as fallback
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists() && userSnap.data().role === "admin") {
          console.log("User verified as admin in users collection");
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
      console.log("Auth state changed", user ? user.email : "no user");
      await checkAdmin(user);
    });
    
    // Check immediately on initial load
    if (auth.currentUser) {
      console.log("Initial load with current user:", auth.currentUser.email);
      checkAdmin(auth.currentUser);
    } else {
      console.log("Initial load with no current user");
      setIsLoading(false);
    }
    
    return () => unsubscribe();
  }, []);
  
  // Add the setAdminStatus function
  const setAdminStatus = (status: boolean) => {
    console.log("Setting admin status to:", status);
    setIsAdmin(status);
    if (status) {
      localStorage.setItem('userRole', 'admin');
    } else {
      localStorage.removeItem('userRole');
    }
  };
  
  return { isAdmin, isLoading, setAdminStatus };
}
