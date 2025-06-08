
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
}

export const useUserManagement = (currentUserId: string | undefined) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch all users from the profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, created_at, role, updated_at');
      
      if (profilesError) throw profilesError;
      
      if (!profilesData) {
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Format the user data
      const formattedUsers = profilesData.map(profile => {
        return {
          id: profile.id,
          email: profile.email || 'No email',
          created_at: profile.created_at,
          last_sign_in_at: profile.updated_at, // Using updated_at as a proxy for last sign in
          is_admin: profile.role === 'admin'
        };
      });
      
      // Apply role filter if not 'all'
      const filteredUsers = roleFilter === 'all' 
        ? formattedUsers 
        : roleFilter === 'admin'
          ? formattedUsers.filter(user => user.is_admin)
          : formattedUsers.filter(user => !user.is_admin);
          
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);
  
  const toggleAdminStatus = async (userId: string, makeAdmin: boolean) => {
    try {
      // Don't allow changing your own admin status
      if (userId === currentUserId) {
        toast({
          title: "Not Allowed",
          description: "You cannot change your own admin status.",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: makeAdmin ? 'admin' : 'survivor' })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update the local state to reflect the change
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: makeAdmin } : user
      ));
      
      toast({
        title: "Status Updated",
        description: `User is now ${makeAdmin ? 'an admin' : 'a regular user'}.`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    users,
    loading,
    roleFilter,
    setRoleFilter,
    fetchUsers,
    toggleAdminStatus,
    formatDate
  };
};
