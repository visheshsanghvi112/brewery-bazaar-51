
import { useState, useEffect } from "react";

export function useCookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  
  useEffect(() => {
    // Check if user has already made a choice
    const consentValue = localStorage.getItem("cookieConsent");
    
    if (consentValue === null) {
      // User hasn't made a choice yet
      setShowConsent(true);
    }
  }, []);
  
  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowConsent(false);
    
    // Here you would enable analytics cookies or other tracking
    console.log("Cookies accepted");
  };
  
  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowConsent(false);
    
    // Here you would ensure no tracking cookies are set
    console.log("Cookies declined");
  };
  
  return {
    showConsent,
    acceptCookies,
    declineCookies
  };
}
