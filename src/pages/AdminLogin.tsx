
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail } from "lucide-react";
import { auth } from "@/integrations/firebase/client";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useAdmin } from "@/hooks/use-admin";

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setAdminStatus, isAdmin } = useAdmin();

  // Check if already authenticated as admin
  useEffect(() => {
    if (isAdmin) {
      console.log("User is already admin, redirecting to admin panel");
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

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

      try {
        // Try to sign in
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Admin signed in successfully", user.uid);
        
        // Ensure admin document exists in Firestore for security rules
        const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
        const { db } = await import("@/integrations/firebase/client");
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: 'admin',
          updatedAt: serverTimestamp()
        }, { merge: true });

        // Set admin status directly without checking Firestore
        setAdminStatus(true);
        
        toast({
          title: "Welcome Administrator",
          description: "You have successfully logged in to the admin panel.",
        });
        
        navigate("/admin");
        return;
      } catch (loginError: any) {
        console.log("Login attempt failed:", loginError.code);
        
        // Modern Firebase: returns 'auth/invalid-credential' for BOTH non-existent users and wrong passwords 
        // to prevent email enumeration. We must check this to trigger admin registration.
        if (loginError.code === "auth/user-not-found" || loginError.code === "auth/invalid-credential") {
          console.log("Admin account possibly missing, checking registration trigger...");
          
          try {
            // Attempt to create the user with the same credentials
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("New Admin account created successfully:", user.uid);
            
            // Create admin document in Firestore
            const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
            const { db } = await import("@/integrations/firebase/client");
            await setDoc(doc(db, "users", user.uid), {
              email: user.email,
              role: 'admin',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });

            setAdminStatus(true);
            toast({
              title: "Admin Initialized",
              description: "Your administrator account has been set up and persisted to Firestore successfully.",
            });
            
            navigate("/admin");
            return;
          } catch (createError: any) {
            // If creation fails, it means the user likely ALREADY exists and the password was JUST wrong
            if (createError.code === "auth/email-already-in-use") {
              toast({
                title: "Login Failed",
                description: "Incorrect password for the administrator account.",
                variant: "destructive",
              });
              setError("Incorrect password");
            } else {
              console.error("Critical Admin Init Error:", createError);
              setError(createError.message);
              toast({
                title: "System Error",
                description: createError.message,
                variant: "destructive",
              });
            }
          }
        } else {
          console.error("General Authentication error:", loginError);
          setError(loginError.message);
          toast({
            title: "Authentication failed",
            description: loginError.message || "Could not authenticate with admin credentials.",
            variant: "destructive",
          });
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
