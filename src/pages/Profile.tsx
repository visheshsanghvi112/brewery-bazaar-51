
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
  const { orders, returnRequests } = useCart();
  const [firestoreOrders, setFirestoreOrders] = useState<UserOrder[]>([]);
  
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

  const allOrders = [...orders, ...firestoreOrders.filter(fo => 
    !orders.some(o => o.id === fo.id)
  )];
  
  const userReturns = returnRequests.filter(returnReq => 
    allOrders.some(order => order.id === returnReq.orderId)
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="flex flex-col sm:flex-row items-start justify-between mb-8">
            <TabsList className="mb-4 sm:mb-0">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders & Returns</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="reviews">My Reviews</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>
            
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          
          <TabsContent value="profile" className="space-y-8">
            {/* Profile Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
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
                        <div className="flex space-x-2">
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

            {/* Addresses Card */}
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
                  <div className="grid gap-4 md:grid-cols-2">
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
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>My Orders & Returns</CardTitle>
                <CardDescription>Track your orders and manage returns</CardDescription>
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
                            {allOrders.length > 0 ? (
                              allOrders.map((order) => (
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
          </TabsContent>
          
          <TabsContent value="wishlist">
            <WishlistSection />
          </TabsContent>
          
          <TabsContent value="reviews">
            <UserReviewsSection />
          </TabsContent>
          
          <TabsContent value="settings">
            <AccountSettings userProfile={userProfile} onProfileUpdate={refreshUserProfile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
