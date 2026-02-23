"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConversationListItem } from "./conversation-list-item";
import { UserListSkeleton } from "./user-list-skeleton";
import { EmptyState } from "./empty-state";
import { MessageSquare, MessagesSquare } from "lucide-react";

interface ConversationSidebarProps {
  selectedConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
}

export function ConversationSidebar({
  selectedConversationId,
  onConversationSelect,
}: ConversationSidebarProps) {
  const conversations = useQuery(api.conversations.getConversations);

  return (
    <div className="flex h-full w-full flex-col border-r border-border bg-background">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Conversations</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {conversations === undefined ? (
          <UserListSkeleton />
        ) : conversations.length === 0 ? (
          <EmptyState
            icon={MessagesSquare}
            title="No conversations yet"
            description="Start a conversation by selecting a user from the user list."
          />
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <ConversationListItem
                key={conversation._id}
                conversation={conversation}
                onClick={() => onConversationSelect(conversation._id)}
                isActive={selectedConversationId === conversation._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
