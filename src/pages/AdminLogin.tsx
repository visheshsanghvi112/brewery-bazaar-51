
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Lock, Mail } from "lucide-react";
import { auth, db } from "@/integrations/firebase/client";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (email !== "admin@test.com") {
        toast({
          title: "Access Denied",
          description: "This login is only for administrators.",
          variant: "destructive",
        });
        return;
      }

      try {
        // Try signing in first
        await signInWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            await setupAdminProfile(userCredential.user);
          })
          .catch(async () => {
            // If login fails, try creating the account
            console.log("Admin login failed, attempting to create admin account");
            await createUserWithEmailAndPassword(auth, email, password)
              .then(async (userCredential) => {
                await setupAdminProfile(userCredential.user);
              })
              .catch((createError) => {
                console.error("Error creating admin account:", createError);
                throw createError;
              });
          });
      } catch (authError) {
        console.error("Authentication error:", authError);
        toast({
          title: "Authentication failed",
          description: "Could not authenticate with admin credentials.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Login process error:", error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupAdminProfile = async (user: any) => {
    try {
      // Set up admin profile in a separate admins collection
      await setDoc(doc(db, "admins", user.uid), {
        email: user.email,
        role: "admin",
        createdAt: new Date()
      }, { merge: true });
      
      localStorage.setItem("userRole", "admin");
      
      toast({
        title: "Welcome Administrator",
        description: "You have successfully logged in to the admin panel.",
      });
      
      navigate("/admin");
    } catch (error) {
      console.error("Error setting up admin profile:", error);
      throw error;
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
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
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
