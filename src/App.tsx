import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Chatbot } from "@/components/Chatbot";
import Navbar from "@/components/Navbar";

// Customer Pages
import CustomerHome from "./pages/customer/Home";
import Categories from "./pages/customer/Categories";
import Products from "./pages/customer/Products";
import Shops from "./pages/customer/Shops";
import ProductDetails from "./pages/customer/ProductDetails";
import ShopDetails from "./pages/ShopDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";

// Auth & Dashboard
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";

// Dashboard Pages
import DashboardShops from "./pages/dashboard/Shops";
import DashboardProducts from "./pages/dashboard/Products";
import Orders from "./pages/dashboard/Orders";
import Users from "./pages/dashboard/Users";
import Payments from "./pages/dashboard/Payments";
import Delivery from "./pages/dashboard/Delivery";
import MapView from "./pages/dashboard/MapView";
import Tickets from "./pages/dashboard/Tickets";
import Analytics from "./pages/dashboard/Analytics";
import Notifications from "./pages/dashboard/Notifications";
import Settings from "./pages/dashboard/Settings";
import Logs from "./pages/dashboard/Logs";
import Coupons from "./pages/dashboard/Coupons";
import Banners from "./pages/dashboard/Banners";
import Ads from "./pages/dashboard/Ads";
import Offers from "./pages/dashboard/Offers";
import GiftCards from "./pages/dashboard/GiftCards";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            {/* <Sonner /> */}
            <BrowserRouter>
              <Routes>
                {/* Customer Routes */}
                <Route path="/customer" element={<><Navbar /><Chatbot /></>}>
                  <Route index element={<CustomerHome />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/:id" element={<ProductDetails />} />
                  <Route path="shops" element={<Shops />} />
                  <Route path="shop/:slug" element={<ShopDetails />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="order-tracking/:orderId" element={<OrderTracking />} />
                </Route>

                <Route path="/" element={<Navigate to="/customer" replace />} />
                <Route path="/login" element={<Login />} />

                {/* Dashboard Routes - Protected */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
                  <Route index element={<DashboardHome />} />
                  <Route path="shops" element={<DashboardShops />} />
                  <Route path="products" element={<DashboardProducts />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="users" element={<Users />} />
                  <Route path="payments" element={<Payments />} />
                  <Route path="delivery" element={<Delivery />} />
                  <Route path="map" element={<MapView />} />
                  <Route path="tickets" element={<Tickets />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="logs" element={<Logs />} />
                  <Route path="coupons" element={<Coupons />} />
                  <Route path="banners" element={<Banners />} />
                  <Route path="ads" element={<Ads />} />
                  <Route path="offers" element={<Offers />} />
                  <Route path="giftcards" element={<GiftCards />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
