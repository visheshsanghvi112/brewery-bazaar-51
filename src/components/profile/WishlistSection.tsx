
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/integrations/firebase/client";
import { getWishlist, removeFromWishlist } from "@/lib/firebase/userOperations";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ShoppingBag, RefreshCw } from "lucide-react";
import { Product } from "@/types";
import { useNavigate } from "react-router-dom";

export default function WishlistSection() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadWishlist = async () => {
    if (!auth.currentUser) return;
    
    try {
      setLoading(true);
      console.log("Fetching wishlist for user:", auth.currentUser.uid);
      const items = await getWishlist(auth.currentUser.uid);
      console.log("Wishlist items fetched:", items);
      setWishlistItems(items);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to load your wishlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load wishlist when component mounts and auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadWishlist();
      } else {
        setWishlistItems([]);
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Add focus listener to refresh wishlist when user returns to the page
  useEffect(() => {
    const handleFocus = () => {
      loadWishlist();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleRemoveItem = async (productId: string) => {
    try {
      if (auth.currentUser) {
        await removeFromWishlist(auth.currentUser.uid, productId);
        setWishlistItems(wishlistItems.filter(item => item.id !== productId));
        toast({
          title: "Item removed",
          description: "Item has been removed from your wishlist",
        });
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>My Wishlist</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadWishlist} 
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <p>Loading wishlist...</p>
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex p-4 gap-4">
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                    {item.images && item.images[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium truncate">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      ₹{(item.price / 100).toFixed(2)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewProduct(item.id)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-2" />
            <h3 className="font-medium text-lg mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-4">
              Browse our products and add items to your wishlist
            </p>
            <Button onClick={() => navigate("/products")}>
              Browse Products
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
