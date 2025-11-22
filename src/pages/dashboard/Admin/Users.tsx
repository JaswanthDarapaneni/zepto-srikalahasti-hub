import Axios from "@/common/Axios";
import { useState, useEffect } from "react";
import { UserDialog } from "@/components/dialogs/UserDialog";
import { useActivityLog } from "@/hooks/useActivityLog";
import CRUDTable from "@/components/CRUDTable";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Badge } from "@/components/ui/badge";
import CustomUpdateUserForm from "@/components/forms/CustomUpdateUserForm";
import UserComponent from "@/components/users/UserComponent"; // <-- reusable component
import { client } from "@/common/apolloClient";

import {
  GetPaginatedUsersDocument,
  GetAdminMetaDocument,
  UserDto,
} from "@/__generated__/graphql";

const Users = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  // For edit
  const [showCustomEdit, setShowCustomEdit] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // For View
  const [viewOpen, setViewOpen] = useState(false);

  const [adminMeta, setAdminMeta] = useState<any>(null);

  const { addLog } = useActivityLog();
const { permissions } = useRoleAccess();

const canAccessUsers = permissions.canAccessUsers;
const canAccessPermission = permissions.canAccessPermission;
const canAccessRoles = permissions.canAccessRoles;
  // Fetch admin meta
  const fetchAdminMeta = async () => {
    try {
      const { data } = await client.query({
        query: GetAdminMetaDocument,
        fetchPolicy: "no-cache",
      });
      setAdminMeta(data.getAdminMeta);
    } catch (error) {
      console.error("Admin Meta load failed", error);
    }
  };

  const fetchUsers = async (page = 1, limit = 10, search = "") => {
    try {
      setLoading(true);

      const { data } = await client.query({
        query: GetPaginatedUsersDocument,
        variables: { page, limit, sortBy: "id", sortDir: "asc", search },
        fetchPolicy: "no-cache",
      });

      const res = data.getPaginatedUsers;

      setUsers(res.content);
      setTotalRecords(res.totalElements);
    } catch (err) {
      console.error("Pagination fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminMeta();
    fetchUsers(1, 10, "");
  }, []);

  // ADD
  const handleAdd = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  // EDIT
  const handleEdit = (user: UserDto) => {
    setSelectedUser(user);
    setShowCustomEdit(true);
  };

  // VIEW USER
  const handleView = (user: UserDto) => {
    setSelectedUser(user);
    setViewOpen(true);
  };

  // Custom Update Form Save
  const handleSaveCustom = async (updatedUser) => {
    try {
      await Axios.put(`/users/${selectedUser!.id}`, updatedUser);
      addLog("update", "users", `Updated: ${updatedUser.name}`);
      fetchUsers();
    } catch (err) {
      console.error("Update failed:", err);
    }
    setShowCustomEdit(false);
  };

  // Delete
  const handleDelete = async (user: UserDto) => {
    try {
      await Axios.delete(`/users/${user.id}`);
      addLog("delete", "users", `Deleted user: ${user.name}`);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Columns
  const columns = [
    { key: "name", label: "Name", render: (v) => <span className="font-medium">{v}</span> },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "roleName",
      label: "Role",
      render: (v) => (
        <Badge variant={v === "ADMIN" ? "default" : "secondary"}>{v}</Badge>
      ),
    },
    {
      key: "permissions",
      label: "Permissions",
      render: (p) => <Badge variant="outline">{p.length} Modules</Badge>,
    },
  ];
console.log(canAccessUsers, canAccessPermission, canAccessRoles)
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Users</h2>

      <CRUDTable
        data={users}
        columns={columns}
        title="User Management"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}           // <-- ADDED FOR VIEW
        permissions={canAccessUsers}
        loading={loading}
        rowsPerPage={10}
        serverPagination={true}
        totalRecords={totalRecords}
        customUpdate={true}
        onCustomEdit={handleEdit}
        onPageChange={(page, size, search) => fetchUsers(page, size, search)}
      />

      {/* Add Dialog */}
      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser!}
        onSave={() => {}}
      />

      {/* Custom Edit */}
      {showCustomEdit && adminMeta && (
        <CustomUpdateUserForm
          user={selectedUser}
          meta={adminMeta}
          onClose={() => setShowCustomEdit(false)}
          onSave={handleSaveCustom}
        />
      )}

      {/* VIEW USER DETAILS */}
      {viewOpen && selectedUser && (
        <UserComponent
          user={selectedUser}

          // Hooks for Actions
          onUpdate={(u) => handleEdit(u)}
          onRoleChange={(role) => console.log("change role", role)}
          onStatusChange={(status) => console.log("disable user", status)}
          onPermissionUpdate={(p) => console.log("update perms", p)}

          // Role-based controls
          canEditUser={canAccessUsers.update}
          canEditRole={canAccessRoles.update}
          canDisableUser={canAccessUsers.update}
          canSeePermissions={canAccessPermission.view}
          canEditPermissions={canAccessPermission.update}
        />
      )}
    </div>
  );
};

export default Users;
