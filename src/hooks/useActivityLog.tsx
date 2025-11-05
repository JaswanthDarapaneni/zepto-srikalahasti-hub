import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from './useLocalStorage';

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
}

export function useActivityLog() {
  const { user } = useAuth();
  const [logs, setLogs] = useLocalStorage<ActivityLog[]>('activity_logs', []);

  const addLog = (action: string, module: string, details: string) => {
    if (!user) return;

    const newLog: ActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      userName: user.name,
      action,
      module,
      details,
      timestamp: new Date().toISOString(),
    };

    setLogs((prev) => [newLog, ...prev]);
  };

  return { logs, addLog };
}
