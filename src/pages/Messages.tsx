import React from "react";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import MessageInbox from "@/components/messaging/MessageInbox";

const Messages = () => {
  const { user, loading } = useAuth();

  // Redirect to auth page if user is not logged in
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-muted-foreground">View and manage your conversations</p>
          </div>

          <div className="bg-card rounded-lg shadow">
            <MessageInbox className="min-h-[500px]" />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Messages;
