"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface UnreadBadgeProps {
  conversationId: string;
}

export function UnreadBadge({ conversationId }: UnreadBadgeProps) {
  const unreadCount = useQuery(api.conversations.getUnreadCount, {
    conversationId: conversationId as Id<"conversations">,
  });

  if (!unreadCount || unreadCount === 0) {
    return null;
  }

  return (
    <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
      {unreadCount > 99 ? "99+" : unreadCount}
    </div>
  );
}
