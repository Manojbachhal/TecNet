import React from 'react';
import { useRole } from '@/hooks/useRole';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole | UserRole[];
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback = <div>Access Denied</div>,
}) => {
  const { hasRole, loading } = useRole();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}; 