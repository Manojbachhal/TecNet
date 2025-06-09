
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX } from "lucide-react";

interface UserActionsProps {
  userId: string;
  isAdmin: boolean;
  isCurrentUser: boolean;
  onToggleAdminStatus: (userId: string, makeAdmin: boolean) => void;
}

const UserActions: React.FC<UserActionsProps> = ({
  userId,
  isAdmin,
  isCurrentUser,
  onToggleAdminStatus,
}) => {
  if (isCurrentUser) {
    return (
      <Badge variant="outline" className="bg-blue-100 text-blue-800">
        Current User
      </Badge>
    );
  }

  if (isAdmin) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="text-amber-600 border-amber-200 hover:bg-amber-50"
        onClick={() => onToggleAdminStatus(userId, false)}
      >
        <UserX className="h-4 w-4 mr-1" />
        Remove Admin
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="text-primary border-primary/20 hover:bg-primary/10"
      onClick={() => onToggleAdminStatus(userId, true)}
    >
      <UserCheck className="h-4 w-4 mr-1" />
      Make Admin
    </Button>
  );
};

export default UserActions;
