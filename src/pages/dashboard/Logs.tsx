import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import CRUDTable from "@/components/CRUDTable";
import { useRoleAccess } from "@/hooks/useRoleAccess";


interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
}

const Logs = () => {
  const [logs] = useLocalStorage<ActivityLog[]>('activity_logs', []);
const {canAccessSettings} = useRoleAccess();
  const getActionBadge = (action: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      create: "default",
      update: "outline",
      delete: "destructive",
      login: "secondary",
    };
    return colors[action] || "secondary";
  };

  const columns = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      render: (value: string) => (
        <span className="font-mono text-sm">
          {new Date(value).toLocaleString()}
        </span>
      )
    },
    {
      key: 'userName',
      label: 'User',
      render: (value: string) => <span className="font-medium">{value}</span>
    },
    {
      key: 'action',
      label: 'Action',
      render: (value: string) => (
        <Badge variant={getActionBadge(value)}>
          {value.toUpperCase()}
        </Badge>
      )
    },
    {
      key: 'module',
      label: 'Module',
      render: (value: string) => <Badge variant="outline">{value}</Badge>
    },
    {
      key: 'details',
      label: 'Details',
      render: (value: string) => <span className="max-w-md truncate">{value}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Activity Logs</h2>
        <p className="text-muted-foreground">Track all system activities and user actions</p>
      </div>

      <CRUDTable
        data={logs}
        columns={columns}
        title={`Recent Activities (${logs.length})`}
        onAdd={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        rowsPerPage={10}
        permissions={canAccessSettings}
        searchPlaceholder="Search logs..."
      />
    </div>
  );
};

export default Logs;
