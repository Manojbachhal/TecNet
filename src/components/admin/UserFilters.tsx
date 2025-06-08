
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface UserFiltersProps {
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  onRefresh: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  roleFilter,
  setRoleFilter,
  onRefresh,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Select value={roleFilter} onValueChange={setRoleFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Users</SelectItem>
          <SelectItem value="admin">Admins</SelectItem>
          <SelectItem value="user">Regular Users</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={onRefresh}>Refresh</Button>
    </div>
  );
};

export default UserFilters;
