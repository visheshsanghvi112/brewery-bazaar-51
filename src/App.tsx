
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { PageLoader } from "./components/ui/page-loader";
import { auth, db } from "@/integrations/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { Product } from "./types";
import { mapProductFromRow } from "./types/supabase";

// Import all required components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Admin from "./pages/Admin";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Careers from "./pages/Careers";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Search from "./pages/Search";

// Import support pages
import SupportHome from "./pages/support/SupportHome";
import FAQs from "./pages/support/FAQs";
import ShippingInfo from "./pages/support/ShippingInfo";
import ReturnsExchanges from "./pages/support/ReturnsExchanges";
import SizeGuide from "./pages/support/SizeGuide";
import TrackOrder from "./pages/support/TrackOrder";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = localStorage.getItem("userRole") === "admin";
  
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem("userRole");
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("App: user is signed in", user.email);
      } else {
        console.log("App: user is signed out");
      }
      setAuthChecked(true);
    });
    
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Try to fetch products from Firestore
        const productsCollection = collection(db, "products");
        const productsSnapshot = await getDocs(productsCollection);
        
        if (!productsSnapshot.empty) {
          const productsData = productsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              description: data.description,
              price: data.price,
              originalPrice: data.originalPrice,
              rating: data.rating,
              reviews: data.reviews,
              images: data.images || [],
              category: data.category,
              inStock: data.inStock,
              featured: data.featured,
              variants: data.variants || [],
              createdAt: data.createdAt,
              updatedAt: data.updatedAt
            };
          });
          
          setProducts(productsData);
          localStorage.setItem('products', JSON.stringify(productsData));
        } else {
          // If no products in Firestore, use the cached products from localStorage
          const cachedProducts = localStorage.getItem('products');
          if (cachedProducts) {
            setProducts(JSON.parse(cachedProducts));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        
        // Fallback to localStorage
        const cachedProducts = localStorage.getItem('products');
        if (cachedProducts) {
          setProducts(JSON.parse(cachedProducts));
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (authChecked) {
      fetchProducts();
    }
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [authChecked]);
  
  return (
    <>
      <PageLoader loading={loading} />
      <div className={`flex flex-col min-h-screen ${loading ? 'overflow-hidden' : ''}`}>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin" element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/search" element={<Search />} />
            
            {/* Company pages */}
            <Route path="/careers" element={<Careers />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Support pages */}
            <Route path="/support" element={<SupportHome />} />
            <Route path="/support/faqs" element={<FAQs />} />
            <Route path="/support/shipping" element={<ShippingInfo />} />
            <Route path="/support/returns" element={<ReturnsExchanges />} />
            <Route path="/support/size-guide" element={<SizeGuide />} />
            <Route path="/support/track-order" element={<TrackOrder />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
