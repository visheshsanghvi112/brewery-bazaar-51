
import { useState, useEffect } from 'react';
import { auth } from "@/integrations/firebase/client";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";
import { onAuthStateChanged } from 'firebase/auth';

// Define a TypeScript interface for the hook's return value
interface UseAdminReturn {
  isAdmin: boolean;
  isLoading: boolean;
  setAdminStatus: (status: boolean) => void;
  fetchAllOrders?: () => Promise<any[]>;
}

export function useAdmin(): UseAdminReturn {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // First check localStorage for a cached admin status
    const cachedRole = localStorage.getItem('userRole');
    if (cachedRole === 'admin') {
      console.log("Found cached admin role in localStorage");
      setIsAdmin(true);
    }
    
    const checkAdmin = async (user: any) => {
      setIsLoading(true);
      
      if (!user) {
        console.log("No user found, setting admin to false");
        setIsAdmin(false);
        localStorage.removeItem('userRole');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Checking admin status for user:", user.email);
        
        // First, check if the email matches our known admin email
        if (user.email === "admin@test.com") {
          console.log("Admin email detected, setting admin status to true");
          setIsAdmin(true);
          localStorage.setItem('userRole', 'admin');
          setIsLoading(false);
          return;
        }
        
        // If we didn't match by email, try checking Firestore
        try {
          // Check admins collection
          const adminRef = doc(db, "admins", user.uid);
          const adminSnap = await getDoc(adminRef);
          
          if (adminSnap.exists() && adminSnap.data().role === "admin") {
            console.log("User verified as admin in Firestore");
            setIsAdmin(true);
            localStorage.setItem('userRole', 'admin');
            setIsLoading(false);
            return;
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
        } catch (firestoreError) {
          console.error("Firestore permission error:", firestoreError);
          // If we get a permissions error but the email matches, still consider them an admin
          if (user.email === "admin@test.com") {
            console.log("Permissions issue, but using email verification as backup");
            setIsAdmin(true);
            localStorage.setItem('userRole', 'admin');
            setIsLoading(false);
            return;
          }
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
  
  // Add a function to fetch all orders (only for admins)
  const fetchAllOrders = async () => {
    if (!isAdmin) {
      console.error("Only admins can fetch all orders");
      return [];
    }
    
    try {
      console.log("Admin is fetching all orders");
      const ordersCollection = collection(db, "orders");
      const orderSnapshot = await getDocs(ordersCollection);
      
      const allOrders = orderSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`Found ${allOrders.length} orders in the database`);
      return allOrders;
    } catch (error) {
      console.error("Error fetching all orders:", error);
      return [];
    }
  };
  
  return { isAdmin, isLoading, setAdminStatus, fetchAllOrders };
}
