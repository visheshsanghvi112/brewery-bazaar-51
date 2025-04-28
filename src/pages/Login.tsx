import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import { auth, googleProvider } from "@/integrations/firebase/client";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { Separator } from "@/components/ui/separator";
import { doc, setDoc } from "firebase/firestore";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { setAdminStatus } = useAdmin();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in", user);
        setCurrentUser(user);
        
        console.log({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          providerId: user.providerData[0]?.providerId
        });
      } else {
        console.log("User is signed out");
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const currentFirebaseUser = auth.currentUser;
      if (currentFirebaseUser) {
        if (currentFirebaseUser.email === "admin@test.com") {
          localStorage.setItem("userRole", "admin");
          setAdminStatus(true);
          navigate("/admin");
          return;
        } else {
          localStorage.setItem("userRole", "user");
          navigate("/profile");
          return;
        }
      }
    };
    
    checkAuth();
  }, [navigate, setAdminStatus]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    console.log("Login attempt:", { email: trimmedEmail });
    
    try {
      if (trimmedEmail === "admin@test.com") {
        console.log("Admin credentials detected");
        
        // Try to create admin account if it doesn't exist
        try {
          await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword)
            .then(async (userCredential) => {
              const user = userCredential.user;
              
              // Set up admin profile in Firestore
              await setDoc(doc(db, "users", user.uid), {
                email: trimmedEmail,
                name: "Admin",
                role: "admin",
                createdAt: new Date()
              });
              
              console.log("Admin account created successfully");
            })
            .catch((error) => {
              // If account already exists, this is fine - we'll try to sign in
              console.log("Admin account may already exist:", error.code);
            });
        } catch (createError) {
          console.log("Error creating admin:", createError);
          // Ignore creation errors - we'll try to sign in anyway
        }
        
        // Now try to sign in
        await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword)
          .then((userCredential) => {
            const user = userCredential.user;
            
            localStorage.setItem("userRole", "admin");
            localStorage.setItem("userName", "Admin");
            localStorage.setItem("userEmail", trimmedEmail);
            
            toast({
              title: "Welcome back, Admin!",
              description: "You have successfully logged in to your account.",
            });
            
            navigate("/admin");
          })
          .catch((error) => {
            throw error;
          });
      } 
      else if (trimmedEmail && trimmedPassword) {
        const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        const user = userCredential.user;
        
        localStorage.setItem("userRole", "user");
        localStorage.setItem("userName", user.displayName || '');
        localStorage.setItem("userEmail", user.email || '');
        
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in to your account.",
        });
        
        navigate("/profile");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    
    try {
      await signInWithPopup(auth, googleProvider)
        .then((result) => {
          const user = result.user;
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          
          console.log("Google Sign In Success:", {
            user: user.displayName,
            email: user.email,
            token: token?.substring(0, 10) + '...'
          });
          
          localStorage.setItem("userRole", "user");
          localStorage.setItem("userName", user.displayName || '');
          localStorage.setItem("userEmail", user.email || '');
          
          toast({
            title: "Google Sign In Successful",
            description: "You have successfully signed in with Google.",
          });
          
          navigate("/profile");
        })
        .catch((error) => {
          console.error("Firebase Google auth failed:", error.code, error.message);
          
          if (error.code === 'auth/unauthorized-domain') {
            toast({
              title: "Authentication Error",
              description: "This domain is not authorized for Firebase authentication. Please ensure your domain is added in Firebase Console.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Google Sign In Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        });
    } catch (error) {
      console.error("Google sign in error:", error);
      toast({
        title: "Google Sign In Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] px-4 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/10 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </motion.div>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-2 text-xs uppercase text-muted-foreground">
                    Or sign in with
                  </span>
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    "Connecting..."
                  ) : (
                    <>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 48 48" 
                        className="h-5 w-5 mr-2"
                      >
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                      </svg>
                      Sign in with Google
                    </>
                  )}
                </Button>
              </motion.div>
              
              {currentUser && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-md">
                  <p className="text-sm text-green-800 dark:text-green-300">
                    Signed in as: {currentUser.email}
                  </p>
                </div>
              )}
              
              <div className="text-center text-sm text-muted-foreground">
                Demo credentials:
                <span className="font-medium text-primary ml-1">admin@test.com / admin</span>
              </div>
            </CardContent>
          </form>
          <CardFooter className="flex justify-center">
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
