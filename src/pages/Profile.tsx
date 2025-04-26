
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { auth } from "@/integrations/firebase/client";
import { updateProfile } from "firebase/auth";
import { User, LogOut, Mail, Phone, MapPin, Package } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const { orders, returnRequests } = useCart();
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName
        });
        
        localStorage.setItem("userName", displayName);
        
        setIsEditing(false);
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated",
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // Filter orders and returns for the current user
  const userOrders = orders.filter(order => order.customer.email === user.email);
  const userReturns = returnRequests.filter(request => request.customerEmail === user.email);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Overview Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Profile</CardTitle>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Picture and Basic Info */}
              <div className="flex-shrink-0">
                <Avatar className="h-32 w-32">
                  {user.photoURL ? (
                    <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
                  ) : (
                    <AvatarFallback>
                      <User className="h-16 w-16" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              
              <div className="flex-grow space-y-6">
                {/* Contact Information */}
                <div className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{user.displayName || 'User'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{localStorage.getItem("userPhone") || 'No phone number added'}</span>
                  </div>
                </div>

                {/* Edit Profile Section */}
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleUpdateProfile}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders and Returns Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>My Activity</CardTitle>
            <CardDescription>View your orders and returns</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="orders" className="space-y-4">
              <TabsList>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="returns">Returns</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders">
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-3 text-left">Order ID</th>
                          <th className="p-3 text-left">Date</th>
                          <th className="p-3 text-left">Status</th>
                          <th className="p-3 text-left">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userOrders.length > 0 ? (
                          userOrders.map((order) => (
                            <tr key={order.id} className="border-b">
                              <td className="p-3">#{order.id}</td>
                              <td className="p-3">{new Date(order.date).toLocaleDateString()}</td>
                              <td className="p-3">
                                <StatusBadge status={order.status} />
                              </td>
                              <td className="p-3">₹{(order.total / 100).toFixed(2)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-muted-foreground">
                              <Package className="mx-auto h-8 w-8 mb-2 opacity-50" />
                              <p>No orders found</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="returns">
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-3 text-left">Return ID</th>
                          <th className="p-3 text-left">Order ID</th>
                          <th className="p-3 text-left">Status</th>
                          <th className="p-3 text-left">Created Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userReturns.length > 0 ? (
                          userReturns.map((returnRequest) => (
                            <tr key={returnRequest.id} className="border-b">
                              <td className="p-3">#{returnRequest.id}</td>
                              <td className="p-3">#{returnRequest.orderId}</td>
                              <td className="p-3">
                                <StatusBadge status={returnRequest.status} />
                              </td>
                              <td className="p-3">{new Date(returnRequest.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-muted-foreground">
                              <Package className="mx-auto h-8 w-8 mb-2 opacity-50" />
                              <p>No returns found</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
