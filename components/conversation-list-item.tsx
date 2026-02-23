"use client";

import Image from "next/image";
import { Doc } from "@/convex/_generated/dataModel";
import { OnlineStatus } from "./online-status";
import { UnreadBadge } from "./unread-badge";
import { Users } from "lucide-react";

interface ConversationWithDetails {
  _id: string;
  participantIds: string[];
  isGroup: boolean;
  groupName?: string;
  createdAt: number;
  updatedAt: number;
  otherParticipant: Doc<"users"> | null;
  participants?: (Doc<"users"> | null)[] | null;
  lastMessage?: {
    content: string;
    createdAt: number;
  };
}

interface ConversationListItemProps {
  conversation: ConversationWithDetails;
  onClick: () => void;
  isActive?: boolean;
}

export function ConversationListItem({
  conversation,
  onClick,
  isActive,
}: ConversationListItemProps) {
  const truncateMessage = (text: string, maxLength: number = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg p-3 transition-colors ${
        isActive ? "bg-primary/10" : "hover:bg-secondary"
      }`}
    >
      {conversation.isGroup ? (
        <>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-1 flex-col items-start overflow-hidden">
            <span className="text-sm font-medium text-foreground">
              {conversation.groupName || "Unnamed Group"}
            </span>
            <span className="text-xs text-muted-foreground">
              {conversation.participantIds.length} members
            </span>
          </div>
          <UnreadBadge conversationId={conversation._id} />
        </>
      ) : conversation.otherParticipant ? (
        <>
          <div className="relative">
            <Image
              src={conversation.otherParticipant.avatarUrl}
              alt={conversation.otherParticipant.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="absolute bottom-0 right-0">
              <OnlineStatus isOnline={conversation.otherParticipant.isOnline} />
            </div>
          </div>
          <div className="flex flex-1 flex-col items-start overflow-hidden">
            <span className="text-sm font-medium text-foreground">
              {conversation.otherParticipant.name}
            </span>
            {conversation.lastMessage ? (
              <span className="text-xs text-muted-foreground">
                {truncateMessage(conversation.lastMessage.content)}
              </span>
            ) : (
              <span className="text-xs italic text-muted-foreground">
                No messages yet
              </span>
            )}
          </div>
          <UnreadBadge conversationId={conversation._id} />
        </>
      ) : null}
    </button>
  );
}
