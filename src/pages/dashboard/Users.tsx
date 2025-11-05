import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { UserDialog } from "@/components/dialogs/UserDialog";
import { useData } from "@/hooks/useData";
import { useActivityLog } from "@/hooks/useActivityLog";
import CRUDTable from "@/components/CRUDTable";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [localUsers, setLocalUsers] = useState<User[]>(users || []);

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
      setLocalUsers(localUsers.map((u) => (u.id === user.id ? user : u)));
      addLog('update', 'users', `Updated user: ${user.name}`);
    } else {
      setLocalUsers([...localUsers, user]);
      addLog('create', 'users', `Created user: ${user.name}`);
    }
    setDialogOpen(false);
    setSelectedUser(undefined);
  };

  const handleDelete = (user: User) => {
    setLocalUsers(localUsers.filter((u) => u.id !== user.id));
    addLog('delete', 'users', `Deleted user: ${user.name}`);
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value: string) => <span className="font-medium">{value}</span>
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'phone',
      label: 'Phone'
    },
    {
      key: 'role',
      label: 'Role',
      render: (value: string) => (
        <Badge variant={value === 'admin' ? 'default' : 'secondary'}>
          {value.replace('_', ' ')}
        </Badge>
      )
    },
    {
      key: 'address',
      label: 'Address'
    }
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
        loading={loading}
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
