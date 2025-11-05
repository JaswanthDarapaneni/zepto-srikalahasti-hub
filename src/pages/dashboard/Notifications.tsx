import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Package, ShoppingCart, AlertTriangle } from "lucide-react";
import notifications from "@/data/notifications.json";

const Notifications = () => {
  const getIcon = (type: string) => {
    const icons: Record<string, any> = {
      order: ShoppingCart,
      delivery: Package,
      inventory: AlertTriangle,
      system: Bell,
    };
    return icons[type] || Bell;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Notifications</h2>
        <p className="text-muted-foreground">View all system notifications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications ({notifications.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((notification) => {
            const Icon = getIcon(notification.type);
            return (
              <div
                key={notification.id}
                className={`flex gap-4 rounded-lg border p-4 ${
                  notification.read ? "bg-background" : "bg-muted/50"
                }`}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold">{notification.title}</h4>
                    {!notification.read && (
                      <Badge variant="default" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
