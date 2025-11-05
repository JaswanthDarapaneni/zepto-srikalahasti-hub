import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Package, AlertTriangle, Bell, Plus, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import notificationsData from '@/data/notifications.json';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'order' | 'delivery' | 'inventory' | 'promotion' | 'system';
  priority: 'urgent' | 'normal' | 'low';
  read: boolean;
  scheduledFor?: string;
  createdAt: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>(
    'notifications',
    notificationsData.map(n => ({ 
      ...n, 
      priority: 'normal' as const,
      type: (n.type || 'system') as Notification['type']
    }))
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Notification>>({
    title: '',
    message: '',
    type: 'system',
    priority: 'normal',
    user_id: '',
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'normal': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="h-5 w-5 text-primary" />;
      case 'delivery': return <Package className="h-5 w-5 text-primary" />;
      case 'inventory': return <AlertTriangle className="h-5 w-5 text-primary" />;
      default: return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const handleSave = () => {
    const newNotification: Notification = {
      id: `notif${Date.now()}`,
      user_id: formData.user_id || 'user6',
      title: formData.title || '',
      message: formData.message || '',
      type: formData.type as Notification['type'] || 'system',
      priority: formData.priority as Notification['priority'] || 'normal',
      read: false,
      scheduledFor: formData.scheduledFor,
      createdAt: new Date().toISOString(),
    };

    setNotifications([newNotification, ...notifications]);
    setDialogOpen(false);
    setFormData({
      title: '',
      message: '',
      type: 'system',
      priority: 'normal',
      user_id: '',
    });
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    const priorityOrder = { urgent: 0, normal: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">System notifications and alerts</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Notification</DialogTitle>
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
                  placeholder="Notification message"
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as Notification['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
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
                  onValueChange={(value) => setFormData({ ...formData, priority: value as Notification['priority'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Schedule For (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={formData.scheduledFor?.slice(0, 16) || ''}
                  onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                />
              </div>
              <div>
                <Label>User ID</Label>
                <Input
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  placeholder="user6"
                />
              </div>
              <Button onClick={handleSave} className="w-full">Schedule</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>Sorted by priority (Urgent → Normal → Low)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold">{notification.title}</h3>
                    <Badge variant={getPriorityColor(notification.priority)}>
                      {notification.priority}
                    </Badge>
                    {!notification.read && (
                      <Badge variant="default">New</Badge>
                    )}
                    {notification.scheduledFor && (
                      <Badge variant="outline" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        Scheduled
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Created: {new Date(notification.createdAt).toLocaleString()}</span>
                    {notification.scheduledFor && (
                      <span>Scheduled: {new Date(notification.scheduledFor).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
