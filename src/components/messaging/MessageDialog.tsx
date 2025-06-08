
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import MessageInbox from './MessageInbox';

interface MessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId?: string;
}

const MessageDialog: React.FC<MessageDialogProps> = ({ isOpen, onClose, recipientId }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <MessageInbox initialRecipientId={recipientId} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
