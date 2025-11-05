import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useData } from "@/hooks/useData";
import { useActivityLog } from "@/hooks/useActivityLog";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import CRUDTable from "@/components/CRUDTable";
import { Badge } from "@/components/ui/badge";
import { NotificationDialog } from "@/components/dialogs/NotificationDialog";
import { ShoppingCart, Package, AlertTriangle, Bell, Calendar } from "lucide-react";

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "order" | "delivery" | "inventory" | "promotion" | "system";
  priority: "urgent" | "normal" | "low";
  read: boolean;
  scheduledFor?: string;
  createdAt: string;
}

const Notifications = () => {
  // 🔗 Load data from JSON
  const { data: notifications, loading } = useData<Notification[]>("/src/data/notifications.json");
  const { addLog } = useActivityLog();
  const { canAccessNotifications } = useRoleAccess();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | undefined>();
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);

  // 🔄 Sync local data when fetched
  useEffect(() => {
    if (notifications) setLocalNotifications(notifications);
  }, [notifications]);

  // ✨ Helpers
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-4 w-4 text-primary" />;
      case "delivery":
        return <Package className="h-4 w-4 text-primary" />;
      case "inventory":
        return <AlertTriangle className="h-4 w-4 text-primary" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  // 🧩 CRUD Handlers
  const handleAdd = () => {
    setSelectedNotification(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (notification: Notification) => {
    setSelectedNotification(notification);
    setDialogOpen(true);
  };

  const handleSave = (notification: Notification) => {
    if (selectedNotification) {
      // Update
      setLocalNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? notification : n))
      );
      addLog("update", "notifications", `Updated notification: ${notification.title}`);
      toast.success("Notification updated successfully");
    } else {
      // Create new
      const newNotification = {
        ...notification,
        id: `notif-${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setLocalNotifications((prev) => [newNotification, ...prev]);
      addLog("create", "notifications", `Created new notification: ${notification.title}`);
      toast.success("Notification created successfully");
    }
    setDialogOpen(false);
    setSelectedNotification(undefined);
  };

  const handleDelete = (notification: Notification) => {
    setLocalNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    addLog("delete", "notifications", `Deleted notification: ${notification.title}`);
    toast.success("Notification deleted successfully");
  };

  // 💡 Columns for CRUDTable
  const columns = [
    {
      key: "title",
      label: "Title",
      render: (_: any, notification: Notification) => (
        <div className="flex items-center gap-2">
          {getIcon(notification.type)}
          <span className="font-medium">{notification.title}</span>
        </div>
      ),
    },
    {
      key: "message",
      label: "Message",
    },
    {
      key: "priority",
      label: "Priority",
      render: (value: string) => <Badge variant={getPriorityColor(value)}>{value}</Badge>,
    },
    {
      key: "scheduledFor",
      label: "Scheduled",
      render: (value: string | undefined) =>
        value ? (
          <Badge variant="outline" className="gap-1">
            <Calendar className="h-3 w-3" /> {new Date(value).toLocaleString()}
          </Badge>
        ) : (
          "-"
        ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value: string) => new Date(value).toLocaleString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Notifications</h2>
        <p className="text-muted-foreground">
          Manage system notifications and scheduled alerts
        </p>
      </div>

      <CRUDTable
        data={localNotifications}
        columns={columns}
        title="Notification Management"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        permissions={canAccessNotifications}
        rowsPerPage={10}
        loading={loading}
        searchPlaceholder="Search notifications..."
      />

      <NotificationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        notification={selectedNotification}
        onSave={handleSave}
      />
    </div>
  );
};

export default Notifications;
