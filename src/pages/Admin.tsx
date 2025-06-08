
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import AdminReports from "@/components/admin/AdminReports";
import UserManagement from "@/components/admin/UserManagement";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
        </div>

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-6">
            <TabsTrigger value="reports">User Reports</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports">
            <AdminReports />
          </TabsContent>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="bg-muted/40 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium">System Settings</h3>
              <p className="text-muted-foreground mt-2">
                This feature will be available soon.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
