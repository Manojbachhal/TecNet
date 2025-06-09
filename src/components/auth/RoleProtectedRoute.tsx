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

  if (authLoading || roleLoading) return null; // or a spinner

  if (!session || !user) {
    // Not logged in
    return <Navigate to="/auth" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    // Not authorized
    return <Navigate to="/not-authorized" replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute; 