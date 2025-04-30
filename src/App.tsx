import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "@/components/theme-provider"
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import Returns from "./pages/Returns";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/admin/Admin";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminReturns from "./pages/admin/Returns";
import AdminCustomers from "./pages/admin/Customers";
import AdminAnalytics from "./pages/admin/Analytics";
import { Toaster } from "@/components/ui/toaster"
import { ToastProvider } from "@/hooks/use-toast"
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import { UserDataLoader } from "./components/auth/UserDataLoader";
import { PageLoader } from "./components/PageLoader";
import CookieConsent from "./components/CookieConsent";

import { CompareProvider } from "./contexts/CompareContext";
import { CompareDrawer } from "./components/product/CompareDrawer";

function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AdminProvider>
            <AuthProvider>
              <UserDataLoader>
                <CartProvider>
                  <CompareProvider>
                    <ToastProvider>
                      <CookieConsent />
                      <PageLoader>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/products/:id" element={<ProductDetail />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/blog/:id" element={<BlogDetail />} />
                          <Route path="/account" element={<Account />} />
                          <Route path="/orders" element={<Orders />} />
                          <Route path="/returns" element={<Returns />} />
                          <Route path="/wishlist" element={<Wishlist />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/admin" element={<Admin />} />
                          <Route path="/admin/products" element={<AdminProducts />} />
                          <Route path="/admin/orders" element={<AdminOrders />} />
                          <Route path="/admin/returns" element={<AdminReturns />} />
                          <Route path="/admin/customers" element={<AdminCustomers />} />
                          <Route path="/admin/analytics" element={<AdminAnalytics />} />
                        </Routes>
                      </PageLoader>
                      <CompareDrawer />
                      <Toaster />
                    </ToastProvider>
                  </CompareProvider>
                </CartProvider>
              </UserDataLoader>
            </AuthProvider>
          </AdminProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
