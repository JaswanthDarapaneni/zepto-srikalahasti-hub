import { useAuth } from '@/contexts/AuthContext';

type Role =
  | 'admin'
  | 'manager'
  | 'shop_owner'
  | 'delivery_agent'
  | 'support'
  | 'customer';

interface CRUD {
  read: boolean;
  update: boolean;
  delete: boolean;
  view: boolean;
  add: boolean;
}

interface RolePermissions {
  canAccessUsers: CRUD;
  canAccessShops: CRUD;
  canAccessProducts: CRUD;
  canAccessOrders: CRUD;
  canAccessPayments: CRUD;
  canAccessTickets: CRUD;
  canAccessAnalytics: CRUD;
  canAccessSettings: CRUD;
  canAccessDelivery: CRUD;
  canAccessMap: CRUD;
  canAccessNotifications: CRUD;
  canAccessLogs: CRUD;
}

// Common permission presets
const fullCRUD: CRUD = { read: true, update: true, delete: true, view: true, add: true };
const readOnlyCRUD: CRUD = { read: true, update: false, delete: false, view: true, add: false };
const noAccessCRUD: CRUD = { read: false, update: false, delete: false, view: false, add: false };
const NoDeleteAccess: CRUD = { read: true, update: true, delete: false, view: true, add: false };

// Role-based permissions
const rolePermissions: Record<Role, RolePermissions> = {
  // 👑 Admin — Full access, settings, logs, analytics
  admin: {
    canAccessUsers: fullCRUD,
    canAccessShops: fullCRUD,
    canAccessProducts: fullCRUD,
    canAccessOrders: fullCRUD,
    canAccessPayments: fullCRUD,
    canAccessTickets: fullCRUD,
    canAccessAnalytics: fullCRUD,
    canAccessSettings: fullCRUD,
    canAccessDelivery: fullCRUD,
    canAccessMap: fullCRUD,
    canAccessNotifications: fullCRUD,
    canAccessLogs: fullCRUD,
  },

  // 🧑‍💼 Manager — Manage orders, shops, and inventory
  manager: {
    canAccessUsers: readOnlyCRUD,
    canAccessShops: fullCRUD,
    canAccessProducts: fullCRUD,
    canAccessOrders: fullCRUD,
    canAccessPayments: fullCRUD,
    canAccessTickets: readOnlyCRUD,
    canAccessAnalytics: fullCRUD,
    canAccessSettings: readOnlyCRUD,
    canAccessDelivery: fullCRUD,
    canAccessMap: fullCRUD,
    canAccessNotifications: fullCRUD,
    canAccessLogs: readOnlyCRUD,
  },

  // 🏪 Shop Owner — Manage products, orders, and shop analytics
  shop_owner: {
    canAccessUsers: noAccessCRUD,
    canAccessShops: NoDeleteAccess,
    canAccessProducts: fullCRUD,
    canAccessOrders: NoDeleteAccess,
    canAccessPayments: readOnlyCRUD,
    canAccessTickets: readOnlyCRUD,
    canAccessAnalytics: fullCRUD,
    canAccessSettings: noAccessCRUD,
    canAccessDelivery: noAccessCRUD,
    canAccessMap: noAccessCRUD,
    canAccessNotifications: fullCRUD,
    canAccessLogs: noAccessCRUD,
  },

  // 🚚 Delivery Agent — View assigned orders, live update location/status
  delivery_agent: {
    canAccessUsers: noAccessCRUD,
    canAccessShops: noAccessCRUD,
    canAccessProducts: noAccessCRUD,
    canAccessOrders: readOnlyCRUD,
    canAccessPayments: noAccessCRUD,
    canAccessTickets: noAccessCRUD,
    canAccessAnalytics: noAccessCRUD,
    canAccessSettings: noAccessCRUD,
    canAccessDelivery: fullCRUD, // delivery status/location updates
    canAccessMap: fullCRUD,
    canAccessNotifications: readOnlyCRUD,
    canAccessLogs: noAccessCRUD,
  },

  // 🎧 Support Agent — Handle tickets and feedback
  support: {
    canAccessUsers: readOnlyCRUD,
    canAccessShops: noAccessCRUD,
    canAccessProducts: noAccessCRUD,
    canAccessOrders: readOnlyCRUD,
    canAccessPayments: noAccessCRUD,
    canAccessTickets: fullCRUD,
    canAccessAnalytics: noAccessCRUD,
    canAccessSettings: noAccessCRUD,
    canAccessDelivery: noAccessCRUD,
    canAccessMap: noAccessCRUD,
    canAccessNotifications: fullCRUD,
    canAccessLogs: noAccessCRUD,
  },

  // 🛒 Customer — Place orders, view history, reviews
  customer: {
    canAccessUsers: noAccessCRUD,
    canAccessShops: readOnlyCRUD,
    canAccessProducts: readOnlyCRUD,
    canAccessOrders: fullCRUD, // placing and viewing orders
    canAccessPayments: readOnlyCRUD,
    canAccessTickets: fullCRUD, // support/feedback
    canAccessAnalytics: noAccessCRUD,
    canAccessSettings: noAccessCRUD,
    canAccessDelivery: readOnlyCRUD,
    canAccessMap: readOnlyCRUD,
    canAccessNotifications: fullCRUD,
    canAccessLogs: noAccessCRUD,
  },
};

export function useRoleAccess() {
  const { user } = useAuth();

  if (!user) {
    return {
      ...rolePermissions.customer, // default minimal access
      role: null,
    };
  }

  const role = user.role as Role;
  return {
    ...rolePermissions[role],
    role,
  };
}
