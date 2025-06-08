
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { ListingItem } from './types/tradingTypes';

interface MessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: ListingItem | null;
}

export default function MessageDialog({ isOpen, onClose, item }: MessageDialogProps) {
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  if (!item) return null;

  const handleSend = () => {
    if (message.trim() === '') {
      toast({
        title: "Empty Message",
        description: "Please enter a message to the seller.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would send the message to an API
    toast({
      title: "Message Sent",
      description: `Your message about "${item.title}" has been sent to ${item.sellerName}.`,
    });

    setMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
          <DialogDescription>
            Send a message to {item.sellerName} about {item.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm text-muted-foreground">Item:</span>
              <p className="font-medium">{item.title}</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-muted-foreground">Price:</span>
              <p className="font-medium">${item.price.toLocaleString()}</p>
            </div>
          </div>
          
          <Textarea
            placeholder="Write your message to the seller..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="mb-4"
          />
          
          <div className="text-sm text-muted-foreground">
            <p>Tips for contacting sellers:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Be specific about your interest</li>
              <li>Ask about condition or additional details</li>
              <li>Suggest a safe meeting place if local</li>
              <li>Be respectful and professional</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend}>
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
