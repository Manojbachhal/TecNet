
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import UserActions from "./UserActions";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
}

interface UserListProps {
  users: User[];
  currentUserId: string | undefined;
  formatDate: (dateString: string | null) => string;
  onToggleAdminStatus: (userId: string, makeAdmin: boolean) => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  currentUserId,
  formatDate,
  onToggleAdminStatus,
}) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No users found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Registered</TableHead>
          <TableHead>Last Sign In</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              {user.email}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {formatDate(user.created_at)}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {formatDate(user.last_sign_in_at)}
            </TableCell>
            <TableCell>
              {user.is_admin ? (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  <Shield className="h-3 w-3 mr-1" /> Admin
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                  User
                </Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <UserActions
                  userId={user.id}
                  isAdmin={user.is_admin}
                  isCurrentUser={user.id === currentUserId}
                  onToggleAdminStatus={onToggleAdminStatus}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserList;
