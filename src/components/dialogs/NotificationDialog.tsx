import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

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

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification?: Notification;
  onSave: (notification: Notification) => void;
}

export const NotificationDialog = ({
  open,
  onOpenChange,
  notification,
  onSave,
}: NotificationDialogProps) => {
  const [formData, setFormData] = useState<Partial<Notification>>({
    title: "",
    message: "",
    type: "system",
    priority: "normal",
    user_id: "",
    scheduledFor: "",
  });

  useEffect(() => {
    if (notification) {
      setFormData(notification);
    } else {
      setFormData({
        title: "",
        message: "",
        type: "system",
        priority: "normal",
        user_id: "",
        scheduledFor: "",
      });
    }
  }, [notification]);

  const handleSave = () => {
    const newNotification: Notification = {
      id: notification?.id || `notif-${Date.now()}`,
      title: formData.title || "",
      message: formData.message || "",
      type: formData.type as Notification["type"],
      priority: formData.priority as Notification["priority"],
      user_id: formData.user_id || "user-default",
      scheduledFor: formData.scheduledFor || "",
      createdAt: notification?.createdAt || new Date().toISOString(),
      read: notification?.read || false,
    };
    onSave(newNotification);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {notification ? "Edit Notification" : "Create Notification"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Notification title"
            />
          </div>

          <div>
            <Label>Message</Label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter notification message"
            />
          </div>

          <div>
            <Label>Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value as Notification["type"] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="order">Order</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
                <SelectItem value="promotion">Promotion</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) =>
                setFormData({ ...formData, priority: value as Notification["priority"] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Schedule For (optional)</Label>
            <Input
              type="datetime-local"
              value={formData.scheduledFor?.slice(0, 16) || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  scheduledFor: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : undefined,
                })
              }
            />
          </div>

          <div>
            <Label>User ID</Label>
            <Input
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              placeholder="user123"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            {notification ? "Save Changes" : "Create Notification"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
