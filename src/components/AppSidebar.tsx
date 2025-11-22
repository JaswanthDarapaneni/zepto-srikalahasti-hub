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


export function AppSidebar() {
  const { role, permissions } = useRoleAccess();

  const menuItems = allMenuItems.filter((item) => {

    // No permission → always show (like Overview)
    if (!item.permission) return true;
    // Step 1: Check role allowed
    if (item.allowedRoles && !item.allowedRoles.includes(role)) {
      return false;
    }

    // Step 2: Check CRUD permissions
    const perm = permissions[item.permission];
    if (!perm) return false;

    // If they have read OR view, they can access
    return perm.read || perm.view;
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
