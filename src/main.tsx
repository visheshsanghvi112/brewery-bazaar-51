import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { app, auth, db } from './integrations/firebase/client.ts'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { seedProductsToFirestore } from './lib/firebase/products.ts'
import { seedDefaultCategories } from "./lib/firebase/categoryOperations";
import { seedDefaultShippingMethods } from "./lib/firebase/shippingMethodOperations";

// Add reCAPTCHA configuration
window.recaptchaConfig = {
  siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY
};

// Ensure Firebase is initialized
console.log("Firebase initialized with app:", app.name);

// Seed functions are available in lib/firebase/ files
// but shouldn't be run automatically on every client initialization
// to prevent excessive Firestore reads/writes.

// Set up auth state listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Auth state changed: User is signed in");
    localStorage.setItem("userEmail", user.email || '');
    localStorage.setItem("userName", user.displayName || '');
    
    // Save user data to Firestore
    try {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date(),
      }, { merge: true });
      
      // Admin logic is now handled in checkUserRole inside Login/App
      localStorage.setItem("userRole", "user");
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
    }
  } else {
    console.log("Auth state changed: User is signed out");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
  }
});

// Initialize theme from localStorage or system preference before rendering
const initializeTheme = () => {
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  const theme = storedTheme || (prefersDark ? "dark" : "light");
  document.documentElement.classList.add(theme);
};

initializeTheme();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
