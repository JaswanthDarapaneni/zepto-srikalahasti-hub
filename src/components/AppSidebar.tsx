import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  MapPin,
  Ticket,
  BarChart3,
  Bell,
  Truck,
  Settings,
  FileText,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRoleAccess } from "@/hooks/useRoleAccess";

const allMenuItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard, permission: null },
  { title: "Shops", url: "/dashboard/shops", icon: Store, permission: "canAccessShops" },
  { title: "Products", url: "/dashboard/products", icon: Package, permission: "canAccessProducts" },
  { title: "Orders", url: "/dashboard/orders", icon: ShoppingCart, permission: "canAccessOrders" },
  { title: "Users", url: "/dashboard/users", icon: Users, permission: "canAccessUsers" },
  { title: "Payments", url: "/dashboard/payments", icon: CreditCard, permission: "canAccessPayments" },
  { title: "Coupons", url: "/dashboard/coupons", icon: Ticket, permission: "canAccessSettings" },
  { title: "Delivery", url: "/dashboard/delivery", icon: Truck, permission: "canAccessDelivery" },
  { title: "Map", url: "/dashboard/map", icon: MapPin, permission: "canAccessMap" },
  { title: "Tickets", url: "/dashboard/tickets", icon: Ticket, permission: "canAccessTickets" },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3, permission: "canAccessAnalytics" },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell, permission: "canAccessNotifications" },
  { title: "Banners", url: "/dashboard/banners", icon: FileText, permission: "canAccessSettings" },
  { title: "Ads", url: "/dashboard/ads", icon: FileText, permission: "canAccessSettings" },
  { title: "Offers", url: "/dashboard/offers", icon: FileText, permission: "canAccessSettings" },
  { title: "Gift Cards", url: "/dashboard/giftcards", icon: FileText, permission: "canAccessSettings" },
  { title: "Logs", url: "/dashboard/logs", icon: FileText, permission: "canAccessLogs" },
  { title: "Settings", url: "/dashboard/settings", icon: Settings, permission: "canAccessSettings" },
];

export function AppSidebar() {
  const permissions = useRoleAccess();

  const menuItems = allMenuItems.filter((item) => {
    if (!item.permission) return true;
    const perm = permissions[item.permission as keyof typeof permissions];
    // Check if perm is an object with read/view properties
    if (perm && typeof perm === "object" && ("read" in perm || "view" in perm)) {
      return (perm as any).read || (perm as any).view;
    }
    return false;
  });

  return (
    <Sidebar>
      <SidebarContent>
        {/* Header */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">Z</span>
            </div>
            <span className="text-lg font-bold">ZeptoClone</span>
          </div>
        </div>

        {/* Sidebar Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
