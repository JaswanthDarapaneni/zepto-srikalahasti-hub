import { useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';

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

export const NotificationScheduler = () => {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', []);

  useEffect(() => {
    const checkScheduledNotifications = () => {
      const now = new Date();
      
      notifications.forEach((notification) => {
        if (notification.scheduledFor && !notification.read) {
          const scheduledTime = new Date(notification.scheduledFor);
          
          // If scheduled time has passed, show the notification
          if (scheduledTime <= now) {
            toast({
              title: notification.title,
              description: notification.message,
              variant: notification.priority === 'urgent' ? 'destructive' : 'default',
            });
            
            // Mark as delivered (read)
            setNotifications((prev) =>
              prev.map((n) =>
                n.id === notification.id ? { ...n, read: true } : n
              )
            );
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkScheduledNotifications, 60000);
    
    // Check immediately on mount
    checkScheduledNotifications();

    return () => clearInterval(interval);
  }, [notifications, setNotifications]);

  return null;
};
