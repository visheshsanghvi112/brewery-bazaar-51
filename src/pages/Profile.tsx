import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { auth } from "@/integrations/firebase/client";
import { updateProfile } from "firebase/auth";
import { User, LogOut, Mail, Phone, MapPin, Plus, Edit2, Package } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getUserProfile, updateUserProfile, UserProfile, UserAddress } from "@/lib/firebase/userOperations";
import { AddressForm } from "@/components/profile/AddressForm";
import { getUserOrders, UserOrder } from "@/lib/firebase/userOperations";
import AccountSettings from "@/components/profile/AccountSettings";
import WishlistSection from "@/components/profile/WishlistSection";
import UserReviewsSection from "@/components/profile/UserReviewsSection";
import { useAdmin } from "@/hooks/use-admin";

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const { orders: cartOrders, returnRequests } = useCart();
  const [firestoreOrders, setFirestoreOrders] = useState<UserOrder[]>([]);
  const { isAdmin, fetchAllOrders } = useAdmin();
  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  
  // Get active tab from URL query parameter or default to "profile"
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "profile");

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  useEffect(() => {
    // Update active tab when URL param changes
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Fetch all orders if the user is an admin
  useEffect(() => {
    const loadAdminOrders = async () => {
      if (isAdmin && fetchAllOrders) {
        setIsLoadingOrders(true);
        try {
          const allOrders = await fetchAllOrders();
          console.log("Admin orders loaded:", allOrders.length);
          setAdminOrders(allOrders);
        } catch (error) {
          console.error("Failed to fetch admin orders:", error);
          toast({
            title: "Error fetching orders",
            description: "Could not load all orders. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoadingOrders(false);
        }
      }
    };
    
    loadAdminOrders();
  }, [isAdmin, fetchAllOrders]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        
        try {
          const profile = await getUserProfile(currentUser.uid);
          if (profile) {
            setUserProfile(profile);
            setPhone(profile.phone || "");
          }
          
          const orders = await getUserOrders(currentUser.uid);
          setFirestoreOrders(orders);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const refreshUserProfile = async () => {
    if (auth.currentUser) {
      try {
        const profile = await getUserProfile(auth.currentUser.uid);
        setUserProfile(profile);
      } catch (error) {
        console.error("Error refreshing user profile:", error);
      }
    }
  };

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
        
        await updateUserProfile(auth.currentUser.uid, {
          displayName,
          phone,
          email: auth.currentUser.email || "",
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

  const handleSaveAddress = async (address: UserAddress) => {
    try {
      if (auth.currentUser && userProfile) {
        const currentAddresses = userProfile.addresses || [];
        const updatedAddresses = [...currentAddresses, address];
        
        await updateUserProfile(auth.currentUser.uid, {
          ...userProfile,
          addresses: updatedAddresses,
        });
        
        setUserProfile({
          ...userProfile,
          addresses: updatedAddresses,
        });
        
        setIsAddingAddress(false);
        toast({
          title: "Address saved",
          description: "Your address has been successfully saved",
        });
      }
    } catch (error) {
      console.error("Address save error:", error);
      toast({
        title: "Save failed",
        description: "Failed to save address",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // Combine orders from different sources
  const userOrders = [...cartOrders, ...firestoreOrders.filter(fo => 
    !cartOrders.some(o => o.id === fo.id)
  )];
  
  // Display either admin orders (all orders) or just the user's orders
  const allOrders = isAdmin ? [...adminOrders, ...userOrders] : userOrders;
  
  // Filter out duplicate orders
  const uniqueOrders = allOrders.filter((order, index, self) =>
    index === self.findIndex((o) => o.id === order.id)
  );
  
  const userReturns = returnRequests.filter(returnReq => 
    allOrders.some(order => order.id === returnReq.orderId)
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header with Logout */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Account {isAdmin && "(Admin)"}</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <Avatar className="h-24 w-24 md:h-32 md:h-32">
                  {user.photoURL ? (
                    <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
                  ) : (
                    <AvatarFallback>
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="flex-grow space-y-6">
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
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 1234567890"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={handleUpdateProfile}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{displayName || 'User'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{phone || 'No phone number added'}</span>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Section */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isAdmin ? "All Orders" : "Orders & Returns"}
              {isLoadingOrders && <span className="ml-2 text-sm text-muted-foreground">(Loading...)</span>}
            </CardTitle>
            <CardDescription>
              {isAdmin 
                ? "View and manage all customer orders in the system" 
                : "View your order history and manage returns"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Order ID</th>
                    <th className="text-left p-2">Date</th>
                    {isAdmin && <th className="text-left p-2">Customer</th>}
                    <th className="text-left p-2">Total</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueOrders.length > 0 ? (
                    uniqueOrders.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="p-2">#{order.id}</td>
                        <td className="p-2">{new Date(order.date || order.createdAt || Date.now()).toLocaleDateString()}</td>
                        {isAdmin && (
                          <td className="p-2">
                            {order.customer?.name || order.customerName || (
                              order.userId === user.uid ? "You" : "Unknown User"
                            )}
                          </td>
                        )}
                        <td className="p-2">₹{((order.total || 0) / 100).toFixed(2)}</td>
                        <td className="p-2">{order.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isAdmin ? 5 : 4} className="text-center p-4 text-muted-foreground">
                        {isLoadingOrders ? "Loading orders..." : "No orders found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Addresses Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Addresses</CardTitle>
                <CardDescription>Manage your shipping addresses</CardDescription>
              </div>
              <Button onClick={() => setIsAddingAddress(true)} disabled={isAddingAddress}>
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isAddingAddress ? (
              <AddressForm
                onSave={handleSaveAddress}
                onCancel={() => setIsAddingAddress(false)}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {userProfile?.addresses?.map((address, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                          <div>
                            <p>{address.street}</p>
                            <p>{address.city}, {address.state} {address.zipCode}</p>
                            <p>{address.country}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {(!userProfile?.addresses || userProfile.addresses.length === 0) && (
                  <p className="text-muted-foreground col-span-2 text-center py-8">
                    No addresses added yet
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wishlist Section */}
        <WishlistSection />

        {/* Reviews Section */}
        <UserReviewsSection />

        {/* Account Settings Section */}
        <AccountSettings userProfile={userProfile} onProfileUpdate={refreshUserProfile} />
      </div>
    </div>
  );
}
