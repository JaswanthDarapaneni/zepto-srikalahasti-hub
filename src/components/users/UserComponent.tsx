import UserPermissions from "./UserPermissions";
import { Badge } from "@/components/ui/badge";

interface UserComponentProps {
  user: any;

  // Actions
  onUpdate?: (data: any) => void;
  onRoleChange?: (role: string) => void;
  onPermissionUpdate?: (permissions: any[]) => void;
  onStatusChange?: (status: string) => void;

  // Visibility / Access
  canEditUser?: boolean;
  canEditRole?: boolean;
  canEditPermissions?: boolean;
  canDisableUser?: boolean;
  canSeePermissions?: boolean;
}

export default function UserComponent({
  user,
  onUpdate,
  onRoleChange,
  onPermissionUpdate,
  onStatusChange,

  canEditUser = false,
  canEditRole = false,
  canEditPermissions = false,
  canDisableUser = false,
  canSeePermissions = true,
}: UserComponentProps) {
  if (!user)
    return (
      <p className="text-gray-500 dark:text-gray-400">User not found.</p>
    );

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{user.name}</h2>

        {canDisableUser && (
          <button
            onClick={() => onStatusChange && onStatusChange("INACTIVE")}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Disable User
          </button>
        )}
      </div>

      {/* User Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Email:</p>
          <p className="font-medium">{user.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Phone:</p>
          <p className="font-medium">{user.phone}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Role:</p>

          {canEditRole ? (
            <select
              className="border rounded px-2 py-1"
              value={user.roleName}
              onChange={(e) => onRoleChange && onRoleChange(e.target.value)}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="SUPPORT">SUPPORT</option>
              <option value="MANAGER">MANAGER</option>
              <option value="CUSTOMER">CUSTOMER</option>
            </select>
          ) : (
            <Badge>{user.roleName}</Badge>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500">Status:</p>
          <Badge variant={user.active ? "default" : "destructive"}>
            {user.active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      {/* Permissions Seaction */}
      {canSeePermissions && (
        <UserPermissions
          permissions={user.permissions || []}
          canEdit={canEditPermissions}
          onUpdate={onPermissionUpdate}
        />
      )}

      {/* Update Button */}
      {canEditUser && (
        <button
          onClick={() => onUpdate && onUpdate(user)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update User
        </button>
      )}
    </div>
  );
}
