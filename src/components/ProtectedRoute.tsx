import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredPermission?: string; // NOW DYNAMIC
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
  requiredPermission,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  // 🔥 Correct destructuring
  const { role, permissions } = useRoleAccess();

  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermission) {
    const perm = permissions[requiredPermission];

    if (!perm || !perm.read) {
      console.warn(
        `⛔ Access blocked. Missing permission "${requiredPermission}".`
      );
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

