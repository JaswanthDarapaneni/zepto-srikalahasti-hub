import { Badge } from "@/components/ui/badge";
interface PermissionProps {
  permissions: any[];
  canEdit?: boolean;
  onUpdate?: (updated: any[]) => void;
}

export default function UserPermissions({
  permissions,
  canEdit = false,
  onUpdate,
}: PermissionProps) {
  if (!permissions || permissions.length === 0)
    return <p className="text-gray-400">No permissions found.</p>;

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold">Permissions</h3>

      {permissions.map((perm, index) => (
        <div
          key={index}
          className="border p-3 rounded-lg bg-gray-50 dark:bg-gray-900"
        >
          {/* Module */}
          <p className="font-semibold">{perm.module?.name}</p>

          {/* Flags */}
          <div className="flex flex-wrap gap-3 text-sm mt-1">
            <span>Read: {String(perm.canRead)}</span>
            <span>Add: {String(perm.canAdd)}</span>
            <span>Update: {String(perm.canUpdate)}</span>
            <span>Delete: {String(perm.canDelete)}</span>
            <span>View: {String(perm.canView)}</span>
          </div>

          {/* Edit Toggle (if allowed) */}
          {canEdit && (
            <button
              className="mt-2 text-blue-600 underline"
              onClick={() => console.log("Edit perm:", perm)}
            >
              Edit Permission
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
