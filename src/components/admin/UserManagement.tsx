
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserManagement } from "./useUserManagement";
import UserFilters from "./UserFilters";
import UserList from "./UserList";

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  
  const {
    users,
    loading,
    roleFilter,
    setRoleFilter,
    fetchUsers,
    toggleAdminStatus,
    formatDate
  } = useUserManagement(currentUser?.id);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage users and assign admin privileges
            </CardDescription>
          </div>
          <UserFilters 
            roleFilter={roleFilter} 
            setRoleFilter={setRoleFilter}
            onRefresh={fetchUsers}
          />
        </div>
      </CardHeader>
      <CardContent>
        <UserList 
          users={users}
          currentUserId={currentUser?.id}
          formatDate={formatDate}
          onToggleAdminStatus={toggleAdminStatus}
        />
      </CardContent>
    </Card>
  );
};

export default UserManagement;
