import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";

interface RoleProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { session, user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useRole();

  // While loading, show a loader or null
  if (authLoading || roleLoading) return null;

  // Not logged in
  if (!session || !user) {
    return <Navigate to="/auth" replace />;
  }

  // Role is still not resolved (e.g., null or undefined)
  if (!role) {
    return null; // still waiting
  }

  // Role exists but not authorized
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute; 