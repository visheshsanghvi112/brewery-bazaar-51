
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "./components/ui/toaster";
import { CartProvider } from "./contexts/CartContext";
import { AdminProvider } from "./contexts/AdminContext";
import { CompareProvider } from "./contexts/CompareContext";
import { CompareDrawer } from "./components/product/CompareDrawer";

function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AdminProvider>
            <CartProvider>
              <CompareProvider>
                <CookieConsent />
                <PageLoader>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Routes>
                </PageLoader>
                <CompareDrawer />
                <Toaster />
              </CompareProvider>
            </CartProvider>
          </AdminProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
