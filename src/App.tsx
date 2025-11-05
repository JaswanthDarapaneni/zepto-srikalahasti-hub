import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ShopDetails from "./pages/ShopDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import Shops from "./pages/dashboard/Shops";
import Products from "./pages/dashboard/Products";
import Orders from "./pages/dashboard/Orders";
import Users from "./pages/dashboard/Users";
import Payments from "./pages/dashboard/Payments";
import Delivery from "./pages/dashboard/Delivery";
import MapView from "./pages/dashboard/MapView";
import Tickets from "./pages/dashboard/Tickets";
import Analytics from "./pages/dashboard/Analytics";
import Notifications from "./pages/dashboard/Notifications";
import Settings from "./pages/dashboard/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop/:slug" element={<ShopDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<DashboardHome />} />
                <Route path="shops" element={<Shops />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="users" element={<Users />} />
                <Route path="payments" element={<Payments />} />
                <Route path="delivery" element={<Delivery />} />
                <Route path="map" element={<MapView />} />
                <Route path="tickets" element={<Tickets />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
