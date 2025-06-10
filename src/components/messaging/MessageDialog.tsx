import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import MessageInbox from "./MessageInbox";

interface MessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId?: string;
  contextType?: "trading" | "classified";
  contextId?: string;
}

const MessageDialog: React.FC<MessageDialogProps> = ({
  isOpen,
  onClose,
  recipientId,
  contextType,
  contextId,
}) => {
  if (!isOpen) return null;

  const missingProps = !recipientId || !contextType || !contextId;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        {missingProps ? (
          <div className="p-6 text-center text-red-600">
            Missing required information to start a conversation.
            <br />
            Please ensure recipient, context type, and context id are provided.
          </div>
        ) : (
          <MessageInbox
            initialRecipientId={recipientId}
            onClose={onClose}
            contextType={contextType}
            contextId={contextId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
