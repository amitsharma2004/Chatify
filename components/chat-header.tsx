"use client";

import Image from "next/image";
import { Doc } from "@/convex/_generated/dataModel";

interface ChatHeaderProps {
  otherParticipant: Doc<"users"> | null;
}

export function ChatHeader({ otherParticipant }: ChatHeaderProps) {
  if (!otherParticipant) {
    return null;
  }

  return (
    <div className="border-b border-border bg-background p-4">
      <div className="flex items-center gap-3">
        <Image
          src={otherParticipant.avatarUrl}
          alt={otherParticipant.name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {otherParticipant.name}
          </h2>
          <p className="text-xs text-muted-foreground">
            {otherParticipant.email}
          </p>
        </div>
      </div>
    </div>
  );
}
