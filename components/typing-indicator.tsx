"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface TypingIndicatorProps {
  conversationId: string;
}

export function TypingIndicator({ conversationId }: TypingIndicatorProps) {
  const typingUsers = useQuery(api.typing.getTypingUsers, {
    conversationId: conversationId as Id<"conversations">,
  });

  if (!typingUsers || typingUsers.length === 0) {
    return null;
  }

  const typingUser = typingUsers[0];

  return (
    <div className="px-4 py-2 text-sm text-muted-foreground">
      <span className="font-medium">{typingUser.name}</span> is typing
      <span className="inline-flex gap-1 ml-1">
        <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
        <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
        <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
      </span>
    </div>
  );
}
