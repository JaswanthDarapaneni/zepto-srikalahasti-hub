import { BarChart3, Bell, CreditCard, FileText, LayoutDashboard, MapPin, Package, Settings, ShoppingCart, Store, Ticket, Truck, Users } from "lucide-react";

export const MenuItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard, permission: null },

  { title: "Shops", url: "/dashboard/shops", icon: Store, permission: "canAccessShops", allowedRoles: ["admin", "manager", "shop_owner"] },

  { title: "Products", url: "/dashboard/products", icon: Package, permission: "canAccessProducts", allowedRoles: ["admin", "manager", "shop_owner"] },

  { title: "Orders", url: "/dashboard/orders", icon: ShoppingCart, permission: "canAccessOrders", allowedRoles: ["admin", "manager", "delivery_agent"] },

  { title: "Users", url: "/dashboard/users", icon: Users, permission: "canAccessUsers", allowedRoles: ["admin", "manager", "support"] },

  { title: "Payments", url: "/dashboard/payments", icon: CreditCard, permission: "canAccessPayments", allowedRoles: ["admin"] },

  { title: "Coupons", url: "/dashboard/coupons", icon: Ticket, permission: "canAccessSettings", allowedRoles: ["admin"] },

  { title: "Delivery", url: "/dashboard/delivery", icon: Truck, permission: "canAccessDelivery", allowedRoles: ["admin", "delivery_agent"] },

  { title: "Map", url: "/dashboard/map", icon: MapPin, permission: "canAccessMap", allowedRoles: ["admin", "delivery_agent"] },

  { title: "Tickets", url: "/dashboard/tickets", icon: Ticket, permission: "canAccessTickets", allowedRoles: ["admin", "support"] },

  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3, permission: "canAccessAnalytics", allowedRoles: ["admin"] },

  { title: "Notifications", url: "/dashboard/notifications", icon: Bell, permission: "canAccessNotifications", allowedRoles: ["admin", "support", "manager"] },

  { title: "Logs", url: "/dashboard/logs", icon: FileText, permission: "canAccessLogs", allowedRoles: ["admin"] },

  { title: "Settings", url: "/dashboard/settings", icon: Settings, permission: "canAccessSettings", allowedRoles: ["admin"] },
];

export const accessRole = 
  {
    customer: "customer",
    admin:"admin",
    manager: "manager",
    shop: "shop_owner",
    delivery: "delivery_agent",
    support: "support"
  }
