
import { useState, useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Check if the current user is an admin (in a real app, this would be part of the auth system)
  useEffect(() => {
    // Check if user is logged in as admin from localStorage or session storage
    const checkAdmin = () => {
      // Check both adminUser object and userRole for compatibility
      const adminUser = localStorage.getItem('adminUser');
      const userRole = localStorage.getItem('userRole');
      
      console.log("Checking admin status:", { adminUser, userRole });
      
      if (adminUser) {
        try {
          const parsed = JSON.parse(adminUser);
          setIsAdmin(Boolean(parsed?.isAdmin));
          console.log("Admin status from adminUser:", Boolean(parsed?.isAdmin));
        } catch (e) {
          console.error('Error parsing admin user', e);
          setIsAdmin(false);
        }
      }
      
      // Also check userRole as a fallback
      if (userRole === 'admin') {
        console.log("Admin status from userRole: true");
        setIsAdmin(true);
      }
    };
    
    checkAdmin();
    
    // Listen for changes to admin status
    window.addEventListener('storage', checkAdmin);
    
    return () => {
      window.removeEventListener('storage', checkAdmin);
    };
  }, []);
  
  // Set admin status function - for login/logout
  const setAdminStatus = (status: boolean) => {
    console.log("Setting admin status to:", status);
    
    if (status) {
      localStorage.setItem('adminUser', JSON.stringify({ isAdmin: true }));
      localStorage.setItem('userRole', 'admin');
    } else {
      localStorage.removeItem('adminUser');
      localStorage.removeItem('userRole');
    }
    
    setIsAdmin(status);
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  };
  
  return { isAdmin, setAdminStatus };
}
