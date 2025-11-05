import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess'; // adjust import path

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredPermission?: keyof ReturnType<typeof useRoleAccess>; // e.g. 'canAccessOrders'
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
  requiredPermission,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const { role, ...permissions } = useRoleAccess();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Role check
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  // ✅ Permission check
  if (requiredPermission) {
    const permission = permissions[requiredPermission];
    if (!permission || !permission.read) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
