import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { UserDialog } from "@/components/dialogs/UserDialog";
import { useData } from "@/hooks/useData";
import { useActivityLog } from "@/hooks/useActivityLog";
import CRUDTable from "@/components/CRUDTable";
import { useRoleAccess } from "@/hooks/useRoleAccess";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  createdAt: string;
}

const Users = () => {
  const { data: users, loading } = useData<User[]>("/src/data/users.json");
  const { addLog } = useActivityLog();
  const { canAccessUsers } = useRoleAccess();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [localUsers, setLocalUsers] = useState<User[]>([]);

  // 🔄 Sync fetched users into local state
  useEffect(() => {
    if (users) setLocalUsers(users);
  }, [users]);

  const handleAdd = () => {
    setSelectedUser(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleSave = (user: User) => {
    if (selectedUser) {
      setLocalUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
      addLog("update", "users", `Updated user: ${user.name}`);
    } else {
      setLocalUsers((prev) => [...prev, user]);
      addLog("create", "users", `Created user: ${user.name}`);
    }
    setDialogOpen(false);
    setSelectedUser(undefined);
  };

  const handleDelete = (user: User) => {
    setLocalUsers((prev) => prev.filter((u) => u.id !== user.id));
    addLog("delete", "users", `Deleted user: ${user.name}`);
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (v: string) => <span className="font-medium">{v}</span>,
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "role",
      label: "Role",
      render: (v: string) => (
        <Badge variant={v === "admin" ? "default" : "secondary"}>
          {v.replace("_", " ")}
        </Badge>
      ),
    },
    { key: "address", label: "Address" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Users</h2>
        <p className="text-muted-foreground">Manage system users and roles</p>
      </div>

      <CRUDTable
        data={localUsers}
        columns={columns}
        title="User Management"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        permissions={canAccessUsers}
        loading={loading}
        rowsPerPage={10}
        searchPlaceholder="Search users..."
      />

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        onSave={handleSave}
      />
    </div>
  );
};

export default Users;
