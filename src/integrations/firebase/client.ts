
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtZzZQacJCcTxyreIKaQOXRZmTRqNOjHc",
  authDomain: "brewery-f32c1.firebaseapp.com",
  projectId: "brewery-f32c1",
  storageBucket: "brewery-f32c1.appspot.com",
  messagingSenderId: "250543383549",
  appId: "1:250543383549:web:12011e2093200823deaf94",
  measurementId: "G-4G48FK1JV5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

// Configure Google Auth Provider with custom parameters
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Add more detailed logging for debugging
console.log("Firebase initialized:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  appId: firebaseConfig.appId
});

// Export the configurations
export { app, analytics, auth, db, googleProvider };
