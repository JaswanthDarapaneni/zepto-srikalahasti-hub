import { useAuth } from '@/contexts/AuthContext';

type Role = 'admin' | 'manager' | 'shop_owner' | 'delivery_agent' | 'support' | 'customer';

interface RolePermissions {
  canAccessUsers: boolean;
  canAccessShops: boolean;
  canAccessProducts: boolean;
  canAccessOrders: boolean;
  canAccessPayments: boolean;
  canAccessTickets: boolean;
  canAccessAnalytics: boolean;
  canAccessSettings: boolean;
  canAccessDelivery: boolean;
  canAccessMap: boolean;
  canAccessNotifications: boolean;
  canAccessLogs: boolean;
}

const rolePermissions: Record<Role, RolePermissions> = {
  admin: {
    canAccessUsers: true,
    canAccessShops: true,
    canAccessProducts: true,
    canAccessOrders: true,
    canAccessPayments: true,
    canAccessTickets: true,
    canAccessAnalytics: true,
    canAccessSettings: true,
    canAccessDelivery: true,
    canAccessMap: true,
    canAccessNotifications: true,
    canAccessLogs: true,
  },
  manager: {
    canAccessUsers: false,
    canAccessShops: true,
    canAccessProducts: true,
    canAccessOrders: true,
    canAccessPayments: true,
    canAccessTickets: false,
    canAccessAnalytics: true,
    canAccessSettings: false,
    canAccessDelivery: true,
    canAccessMap: true,
    canAccessNotifications: true,
    canAccessLogs: false,
  },
  shop_owner: {
    canAccessUsers: false,
    canAccessShops: true,
    canAccessProducts: true,
    canAccessOrders: true,
    canAccessPayments: false,
    canAccessTickets: false,
    canAccessAnalytics: true,
    canAccessSettings: false,
    canAccessDelivery: false,
    canAccessMap: false,
    canAccessNotifications: true,
    canAccessLogs: false,
  },
  delivery_agent: {
    canAccessUsers: false,
    canAccessShops: false,
    canAccessProducts: false,
    canAccessOrders: true,
    canAccessPayments: false,
    canAccessTickets: false,
    canAccessAnalytics: false,
    canAccessSettings: false,
    canAccessDelivery: true,
    canAccessMap: true,
    canAccessNotifications: true,
    canAccessLogs: false,
  },
  support: {
    canAccessUsers: false,
    canAccessShops: false,
    canAccessProducts: false,
    canAccessOrders: true,
    canAccessPayments: false,
    canAccessTickets: true,
    canAccessAnalytics: false,
    canAccessSettings: false,
    canAccessDelivery: false,
    canAccessMap: false,
    canAccessNotifications: true,
    canAccessLogs: false,
  },
  customer: {
    canAccessUsers: false,
    canAccessShops: false,
    canAccessProducts: false,
    canAccessOrders: true,
    canAccessPayments: false,
    canAccessTickets: true,
    canAccessAnalytics: false,
    canAccessSettings: false,
    canAccessDelivery: false,
    canAccessMap: false,
    canAccessNotifications: true,
    canAccessLogs: false,
  },
};

export function useRoleAccess() {
  const { user } = useAuth();
  
  if (!user) {
    return {
      canAccessUsers: false,
      canAccessShops: false,
      canAccessProducts: false,
      canAccessOrders: false,
      canAccessPayments: false,
      canAccessTickets: false,
      canAccessAnalytics: false,
      canAccessSettings: false,
      canAccessDelivery: false,
      canAccessMap: false,
      canAccessNotifications: false,
      canAccessLogs: false,
      role: null,
    };
  }

  return {
    ...rolePermissions[user.role as Role],
    role: user.role,
  };
}
