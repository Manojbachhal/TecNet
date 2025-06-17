import React, { useState } from "react";
import { Classified } from "./types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Pencil, Trash2, DollarSign, User, MessageCircle, Phone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import MessageDialog from "@/components/messaging/MessageDialog";
import { useAuth } from "@/contexts/AuthContext";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipTrigger } from "../ui/tooltip";

interface ClassifiedCardProps {
  classified: Classified;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const ClassifiedCard = ({ classified, isOwner, onEdit, onDelete }: ClassifiedCardProps) => {
  const { user } = useAuth();
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  const handleContactClick = () => {
    if (classified.contactInfo) {
      // If it looks like an email, open mail app
      if (classified.contactInfo.includes("@")) {
        window.location.href = `mailto:${classified.contactInfo}`;
      }
      // // If it looks like a phone number, open phone app
      // else if (classified.phone_number.replace(/\D/g, "").length >= 7) {
      //   window.location.href = `tel:${classified.phone_number.replace(/\D/g, "")}`;
      // }
    }
  };

  const handleMessageClick = () => {
    if (user && classified.userId) {
      setIsMessageOpen(true);
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "Recently";
    }
  };
  console.log(classified, "classified");
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-all group">
      {classified.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={classified.imageUrl}
            alt={classified.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          {classified.price !== null && classified.price > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-sm font-medium flex items-center">
              <DollarSign className="h-3 w-3 mr-1" />
              {classified.price.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{classified.title}</CardTitle>
      </CardHeader>

      <CardContent className="pb-4 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {classified.description || "No description provided."}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col border-t pt-4 gap-2">
        <div className="flex justify-between items-center w-full">
          <div className="text-xs text-muted-foreground">{getTimeAgo(classified.createdAt)}</div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{classified.postedBy || "Anonymous"}</span>
          </div>
        </div>

        <div className="flex justify-end w-full gap-2">
          {isOwner ? (
            <>
              <Button variant="outline" size="sm" onClick={onEdit} className="h-8">
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={onDelete} className="h-8">
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete
              </Button>
            </>
          ) : (
            <>
              {user && classified.userId && (
                <Button variant="outline" size="sm" onClick={handleMessageClick} className="h-8">
                  <MessageCircle className="h-3.5 w-3.5 mr-1" />
                  Message
                </Button>
              )}
              {/* <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleContactClick}
                    disabled={!classified.contactInfo}
                    className="h-8"
                  >
                    <Phone className="h-3.5 w-3.5 mr-1" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="bg-slate-700 text-sm px-[10px] py-[3px] mb-1 rounded">
                    {classified.phoneNumber || "No Phone number available"}
                  </p>
                </TooltipContent>
              </Tooltip> */}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleContactClick}
                    disabled={!classified.contactInfo}
                    className="h-8"
                  >
                    <Mail className="h-3.5 w-3.5 mr-1" />
                    Contact
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="bg-slate-700 text-sm px-[10px] py-[3px] mb-1 rounded">
                    {classified.contactInfo || "No email available"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </CardFooter>

      {/* Message Dialog */}
      <MessageDialog
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        recipientId={classified.userId || undefined}
        contextType={"classified"}
        contextId={classified.id}
      />
    </Card>
  );
};

export default ClassifiedCard;
