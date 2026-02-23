"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";

interface MessageReactionsProps {
  messageId: Id<"messages">;
  onReactionClick: (emoji: string) => void;
}

export function MessageReactions({
  messageId,
  onReactionClick,
}: MessageReactionsProps) {
  const reactions = useQuery(api.reactions.getMessageReactions, { messageId });
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);

  if (!reactions || reactions.length === 0) {
    return null;
  }

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {reactions.map((reactionGroup) => (
        <div key={reactionGroup.emoji} className="relative">
          <button
            onClick={() => onReactionClick(reactionGroup.emoji)}
            onMouseEnter={() => setHoveredEmoji(reactionGroup.emoji)}
            onMouseLeave={() => setHoveredEmoji(null)}
            className="flex items-center gap-1 rounded-full border border-border bg-secondary px-2 py-0.5 text-xs transition-colors hover:bg-secondary/80"
          >
            <span>{reactionGroup.emoji}</span>
            <span className="text-muted-foreground">{reactionGroup.count}</span>
          </button>

          {hoveredEmoji === reactionGroup.emoji && (
            <div className="absolute bottom-full left-0 z-10 mb-2 whitespace-nowrap rounded-lg border border-border bg-background px-2 py-1 text-xs shadow-lg">
              {reactionGroup.reactions.map((r, i) => (
                <span key={r._id}>
                  {r.user?.name}
                  {i < reactionGroup.reactions.length - 1 && ", "}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
