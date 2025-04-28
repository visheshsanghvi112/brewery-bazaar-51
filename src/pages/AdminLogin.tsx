
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail } from "lucide-react";
import { auth, db } from "@/integrations/firebase/client";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAdmin } from "@/hooks/use-admin";

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setAdminStatus } = useAdmin();

  // Check if already authenticated as admin
  useEffect(() => {
    console.log("AdminLogin: Checking auth status");
    const checkAdminStatus = async () => {
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.email === "admin@test.com") {
        // Check if user is in admin collection
        try {
          console.log("Checking if user is admin in Firestore:", currentUser.uid);
          const adminRef = doc(db, "admins", currentUser.uid);
          const adminSnap = await getDoc(adminRef);
          
          if (adminSnap.exists() && adminSnap.data().role === "admin") {
            console.log("Admin confirmed in Firestore, redirecting to admin panel");
            setAdminStatus(true);
            navigate("/admin");
          } else {
            console.log("User not found in admins collection");
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
        }
      }
    };
    
    checkAdminStatus();
  }, [navigate, setAdminStatus]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Validate email is admin@test.com
      if (email !== "admin@test.com") {
        toast({
          title: "Access Denied",
          description: "This login is only for administrators.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Validate password length
      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        toast({
          title: "Invalid Password",
          description: "Password must be at least 6 characters long",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log("Attempting admin login with:", email);

      // First try to sign in
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Admin signed in successfully", userCredential.user.uid);
        await setupAdminProfile(userCredential.user);
      } catch (loginError: any) {
        console.log("Login error:", loginError.code);
        // If account doesn't exist, create it
        if (loginError.code === "auth/user-not-found") {
          console.log("Admin account not found, creating...");
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Admin account created successfully", userCredential.user.uid);
            await setupAdminProfile(userCredential.user);
          } catch (createError: any) {
            console.error("Error creating admin account:", createError);
            toast({
              title: "Account Creation Failed",
              description: createError.message,
              variant: "destructive",
            });
            setError(createError.message);
            setIsLoading(false);
          }
        } else if (loginError.code === "auth/wrong-password") {
          toast({
            title: "Incorrect Password",
            description: "The password you entered is incorrect.",
            variant: "destructive",
          });
          setError("Incorrect password");
          setIsLoading(false);
        } else {
          console.error("Authentication error:", loginError);
          setError(loginError.message);
          toast({
            title: "Authentication failed",
            description: loginError.message || "Could not authenticate with admin credentials.",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      }
    } catch (error: any) {
      console.error("Login process error:", error);
      setError(error.message);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const setupAdminProfile = async (user: any) => {
    try {
      console.log("Setting up admin profile for:", user.uid);
      
      // Check if admin profile already exists
      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);
      
      // Set up admin profile in a separate admins collection
      await setDoc(adminRef, {
        email: user.email,
        role: "admin",
        createdAt: new Date()
      }, { merge: true });
      
      console.log("Admin profile saved to Firestore");
      localStorage.setItem("userRole", "admin");
      
      // Important: Set admin status in the context
      setAdminStatus(true);
      
      toast({
        title: "Welcome Administrator",
        description: "You have successfully logged in to the admin panel.",
      });
      
      navigate("/admin");
    } catch (error: any) {
      console.error("Error setting up admin profile:", error);
      toast({
        title: "Profile Setup Failed",
        description: error.message || "Could not set up admin profile.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md border-primary/10 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center text-red-500 dark:text-red-400">
            Restricted Access - Administrators Only
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAdminLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                  readOnly
                />
              </div>
              <p className="text-xs text-muted-foreground">Email is fixed for admin access</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
            </div>
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
