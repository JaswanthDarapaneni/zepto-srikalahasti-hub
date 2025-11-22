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
import { NotificationScheduler } from "@/components/NotificationScheduler";
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
import Users from "./pages/dashboard/Admin/Users";
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
import UserView from "./pages/dashboard/Admin/UserView";
import { useRoleAccess } from "./hooks/useRoleAccess";
import { accessRole } from "./lib/route_config";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <NotificationScheduler />
            <BrowserRouter>
              <Routes>
                {/* Customer Routes */}
                <Route
                  path="/customer/*"
                  element={
                    <>
                      <Navbar />
                      <Routes>
                        <Route index element={<CustomerHome />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="products" element={<Products />} />
                        <Route
                          path="products/:id"
                          element={<ProductDetails />}
                        />
                        <Route path="shops" element={<Shops />} />
                        <Route path="shop/:slug" element={<ShopDetails />} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="checkout" element={<Checkout />} />
                        <Route
                          path="order-tracking/:orderId"
                          element={<OrderTracking />}
                        />
                      </Routes>
                      <Chatbot />
                    </>
                  }
                />

                <Route path="/" element={<Navigate to="/customer" replace />} />
                <Route path="/login" element={<Login />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardHome />} />

                  {/* Shop Management */}
                  <Route
                    path="shops"
                    element={
                      <ProtectedRoute requiredPermission="canAccessShops">
                        <DashboardShops />
                      </ProtectedRoute>
                    }
                  />

                  {/* Product Management */}
                  <Route
                    path="products"
                    element={
                      <ProtectedRoute requiredPermission="canAccessProducts">
                        <DashboardProducts />
                      </ProtectedRoute>
                    }
                  />

                  {/* Orders */}
                  <Route
                    path="orders"
                    element={
                      <ProtectedRoute requiredPermission="canAccessOrders">
                        <Orders />
                      </ProtectedRoute>
                    }
                  />

                  {/* Users */}
                  <Route
                    path="users"
                    element={
                      <ProtectedRoute  requiredPermission="canAccessUsers">
                        <Users />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="users/:id"
                    element={
                      <ProtectedRoute requiredPermission="canAccessUsers">
                        <UserView />
                      </ProtectedRoute>
                    }
                  />

                  {/* Payments */}
                  <Route
                    path="payments"
                    element={
                      <ProtectedRoute requiredPermission="canAccessPayments">
                        <Payments />
                      </ProtectedRoute>
                    }
                  />

                  {/* Delivery */}
                  <Route
                    path="delivery"
                    element={
                      <ProtectedRoute requiredPermission="canAccessDelivery">
                        <Delivery />
                      </ProtectedRoute>
                    }
                  />

                  {/* Map */}
                  <Route
                    path="map"
                    element={
                      <ProtectedRoute requiredPermission="canAccessMap">
                        <MapView />
                      </ProtectedRoute>
                    }
                  />

                  {/* Tickets */}
                  <Route
                    path="tickets"
                    element={
                      <ProtectedRoute requiredPermission="canAccessTickets">
                        <Tickets />
                      </ProtectedRoute>
                    }
                  />

                  {/* Analytics */}
                  <Route
                    path="analytics"
                    element={
                      <ProtectedRoute requiredPermission="canAccessAnalytics">
                        <Analytics />
                      </ProtectedRoute>
                    }
                  />

                  {/* Settings */}
                  <Route
                    path="settings"
                    element={
                      <ProtectedRoute requiredPermission="canAccessSettings">
                        <Settings />
                      </ProtectedRoute>
                    }
                  />

                  {/* Logs */}
                  <Route
                    path="logs"
                    element={
                      <ProtectedRoute requiredPermission="canAccessLogs">
                        <Logs />
                      </ProtectedRoute>
                    }
                  />

                  {/* Logs */}
                  <Route
                    path="notifications"
                    element={
                      <ProtectedRoute requiredPermission="canAccessNotifications">
                        <Notifications />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallbacks */}
                  <Route path="*" element={<NotFound />} />
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
