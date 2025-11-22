import { useAuth } from "@/contexts/AuthContext";
import { secureGetItem } from "@/lib/utils";

type Role =
  | "admin"
  | "manager"
  | "shop_owner"
  | "delivery_agent"
  | "support"
  | "customer";


interface RoleAccess {
  role: Role;
  permissions: Record<string, CRUD>;
}

interface CRUD {
  read: boolean;
  update: boolean;
  delete: boolean;
  view: boolean;
  add: boolean;
}

interface PermissionDTO {
  module: string;
  canRead: boolean;
  canAdd: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canView: boolean;
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
  canAccessPermission: CRUD;
}

// ---- Predefined Defaults (fallback) ----
const fullCRUD: CRUD = {
  read: true,
  update: true,
  delete: true,
  view: true,
  add: true,
};
const readOnlyCRUD: CRUD = {
  read: true,
  update: false,
  delete: false,
  view: true,
  add: false,
};
const noAccessCRUD: CRUD = {
  read: false,
  update: false,
  delete: false,
  view: false,
  add: false,
};
const NoDeleteAccess: CRUD = {
  read: true,
  update: true,
  delete: false,
  view: true,
  add: false,
};


// ---- Local fallback roles (used if API doesn’t provide permissions) ----
const defaultRolePermissions: Record<Role, Record<string, CRUD>> = {
  customer: {
    canAccessUsers: noAccessCRUD,
    canAccessShops: readOnlyCRUD,
    canAccessProducts: readOnlyCRUD,
    canAccessOrders: fullCRUD,
    canAccessPayments: readOnlyCRUD,
    canAccessTickets: fullCRUD,
    canAccessAnalytics: noAccessCRUD,
    canAccessSettings: noAccessCRUD,
    canAccessDelivery: readOnlyCRUD,
    canAccessMap: readOnlyCRUD,
    canAccessNotifications: fullCRUD,
    canAccessLogs: noAccessCRUD,
    canAccessPermission: noAccessCRUD,
    canAccessRoles:noAccessCRUD
  },
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
    canAccessPermission: noAccessCRUD,
    canAccessRoles: readOnlyCRUD
  },
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
    canAccessPermission: fullCRUD,
    canAccessRoles: fullCRUD
  },
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
    canAccessPermission: fullCRUD,
    canAccessRoles: fullCRUD
  },

  delivery_agent: {
    canAccessUsers: noAccessCRUD,
    canAccessShops: noAccessCRUD,
    canAccessProducts: noAccessCRUD,
    canAccessOrders: readOnlyCRUD,
    canAccessPayments: noAccessCRUD,
    canAccessTickets: noAccessCRUD,
    canAccessAnalytics: noAccessCRUD,
    canAccessSettings: noAccessCRUD,
    canAccessDelivery: fullCRUD,
    canAccessMap: fullCRUD,
    canAccessNotifications: readOnlyCRUD,
    canAccessLogs: noAccessCRUD,
    canAccessPermission: noAccessCRUD,
    canAccessRoles: noAccessCRUD
  },
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
    canAccessPermission: noAccessCRUD,
    canAccessRoles: noAccessCRUD
  },
};

// ----- helper to map PermissionDTO[] → { [module]: CRUD } -----
function mapPermissionsToCRUD(perms: PermissionDTO[]): Record<string, CRUD> {
  const mapped: Record<string, CRUD> = {};
  perms.forEach((p) => {
    mapped[p.module] = {
      read: !!p.canRead,
      add: !!p.canAdd,
      update: !!p.canUpdate,
      delete: !!p.canDelete,
      view: !!p.canView,
    };
  });

  return mapped;
}


export function useRoleAccess(): RoleAccess {
  const { user } = useAuth();

  const role: Role = (user?.role as Role) || "customer";

  const stored = secureGetItem("permission");

  let serverPermissions: Record<string, CRUD> | null = null;

  try {
    const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
    if (Array.isArray(parsed)) {
      serverPermissions = mapPermissionsToCRUD(parsed);
    }
  } catch (err) {
    console.warn("Invalid permission data, using defaults:", err);
  }

  const mergedPermissions: Record<string, CRUD> = {
    ...defaultRolePermissions[role],
    ...(serverPermissions || {}),
  };

  return {
    role,
    permissions: mergedPermissions,
  };
}





