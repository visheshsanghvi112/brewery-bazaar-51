
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { app, auth, db } from './integrations/firebase/client.ts'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { seedProductsToFirestore } from './lib/firebase/products.ts'

// Add reCAPTCHA configuration
window.recaptchaConfig = {
  siteKey: '6Le9UhgrAAAAAAQC48yTvrHGktIZPK6Aq1eMGjIw'
};

// Ensure Firebase is initialized
console.log("Firebase initialized with app:", app.name);

// Initialize products
seedProductsToFirestore().catch(error => {
  console.error("Failed to seed products:", error);
});

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
      
      // Check if admin
      if (user.email === "admin@test.com") {
        localStorage.setItem("userRole", "admin");
      } else {
        localStorage.setItem("userRole", "user");
      }
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
