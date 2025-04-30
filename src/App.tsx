import { useState, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Admin from "@/pages/Admin";
import Cart from "@/pages/Cart";
import Contact from "@/pages/Contact";
import ForgotPassword from "@/pages/ForgotPassword";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Privacy from "@/pages/Privacy";
import ProductDetail from "@/pages/ProductDetail";
import Products from "@/pages/Products";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import Returns from "@/pages/Returns";
import Search from "@/pages/Search";
import Terms from "@/pages/Terms";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { PageLoader } from "@/components/ui/page-loader";
import AdminLogin from "@/pages/AdminLogin";
import AdminCategories from "./pages/admin/Categories";

// Support pages
import SupportHome from "@/pages/support/SupportHome";
import FAQs from "@/pages/support/FAQs";
import ShippingInfo from "@/pages/support/ShippingInfo";
import ReturnsExchanges from "@/pages/support/ReturnsExchanges";
import SizeGuide from "@/pages/support/SizeGuide";
import TrackOrder from "@/pages/support/TrackOrder";

function App() {
  const location = useLocation();
  const [isPreviewing, setIsPreviewing] = useState(false);
  
  // Check if user is in Admin page or pages that don't need footer
  const isAdminPage = location.pathname === "/admin";
  const hideFooter = isAdminPage || location.pathname === "/profile" || location.pathname === "/cart";
  
  useEffect(() => {
    // Create a MutationObserver
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const body = document.body;
          if (body.classList.contains("iframe-preview")) {
            setIsPreviewing(true);
            return;
          }
        }
      }
    });
    
    // Start observing the body element for attribute changes
    observer.observe(document.body, { attributes: true });
    
    // Initial check
    if (document.body.classList.contains("iframe-preview")) {
      setIsPreviewing(true);
    }
    
    // Cleanup
    return () => observer.disconnect();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <CartProvider>
        {!isAdminPage && <Navbar />}
        
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/register" element={<Register />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/search" element={<Search />} />
              <Route path="/terms" element={<Terms />} />
              
              <Route path="/support" element={<SupportHome />} />
              <Route path="/support/faqs" element={<FAQs />} />
              <Route path="/support/shipping" element={<ShippingInfo />} />
              <Route path="/support/returns" element={<ReturnsExchanges />} />
              <Route path="/support/size-guide" element={<SizeGuide />} />
              <Route path="/support/track-order" element={<TrackOrder />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        
        {!hideFooter && <Footer />}
      </CartProvider>
      
      <Toaster />
    </div>
  );
}

export default App;
