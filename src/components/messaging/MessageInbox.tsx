import React, { useState, useEffect } from "react";
import { useMessages, Conversation } from "@/hooks/useMessages";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ConversationView from "./ConversationView";

interface MessageInboxProps {
  initialRecipientId?: string;
  onClose?: () => void;
  className?: string;
  contextType?: "trading" | "classified";
  contextId?: string;
}

const MessageInbox: React.FC<MessageInboxProps> = ({
  initialRecipientId,
  onClose,
  className,
  contextType,
  contextId,
}) => {
  const { user } = useAuth();
  const [contextData, setcontextData] = useState({
    contextId: null,
    contextType: null,
  });
  const {
    conversations,
    messages,
    currentConversation,
    isLoading,
    fetchConversations,
    fetchMessages,
    sendMessage,
    setCurrentConversation,
  } = useMessages();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (initialRecipientId && user && contextType && contextId) {
      handleOpenConversation(initialRecipientId, contextType, contextId);
    }
  }, [initialRecipientId, user, contextType, contextId]);

  const handleOpenConversation = (userId: string, contextType: any, contextId: string) => {
    setcontextData({
      contextId,
      contextType,
    });
    if (contextType && contextId) {
      fetchMessages(userId, contextType, contextId);
    }
  };

  const handleBackToInbox = () => {
    setCurrentConversation(null);
    fetchConversations();
  };

  const handleSendMessage = async (message: string): Promise<boolean> => {
    // console.log("first", currentConversation, contextId, contextType);
    if (currentConversation && contextData.contextType && contextData.contextId) {
      // console.log(message);
      return await sendMessage(
        currentConversation,
        message,
        contextData.contextType,
        contextData.contextId
      );
    }
    return false;
  };

  const filteredConversations =
    searchTerm.trim() === ""
      ? conversations
      : conversations.filter(
          (conv) =>
            conv.chatName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conv.last_message.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const currentConversationData = currentConversation
    ? conversations.find((conv) => conv.user_id === currentConversation)
    : null;

  const headerName = filteredConversations.find(
    (ele) => ele.context_id === contextId || ele.context_id == contextData.contextId
  );
  // console.log(headerName?.chatName, "test");

  return (
    <Card className={`${className || ""}`}>
      <CardHeader className="px-4 py-3 border-b flex flex-row items-center justify-between">
        {currentConversation ? (
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="mr-2 p-0 h-8 w-8"
              onClick={handleBackToInbox}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h3 className="text-lg font-semibold">
              Chat on listing : {headerName?.chatName || "Loading..."}
            </h3>
          </div>
        ) : (
          <h3 className="text-lg font-semibold flex items-center">
            <MessageCircle className="mr-2 h-5 w-5" />
            Messages
          </h3>
        )}

        {onClose && (
          <Button variant="ghost" size="sm" className="pr-5 " onClick={onClose}>
            Close
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {!currentConversation ? (
          <>
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-96">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Loading conversations...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  {searchTerm.trim() !== ""
                    ? "No conversations match your search."
                    : "No conversations yet."}
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.user_id}
                    className="w-full text-left p-3 hover:bg-muted border-b flex items-start justify-between transition-colors"
                    onClick={() =>
                      handleOpenConversation(
                        conversation.user_id,
                        conversation.context_type,
                        conversation.context_id
                      )
                    }
                  >
                    <div>
                      <div className="font-medium">Chat on listing : {conversation.chatName}</div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {conversation.last_message}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(conversation.last_message_time), {
                          addSuffix: true,
                        })}
                      </span>
                      {conversation.unread_count > 0 && (
                        <Badge variant="default" className="mt-1">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </>
        ) : (
          <ConversationView
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MessageInbox;
