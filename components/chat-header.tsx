"use client";

import Image from "next/image";
import { Doc } from "@/convex/_generated/dataModel";
import { ArrowLeft } from "lucide-react";

interface ChatHeaderProps {
  otherParticipant: Doc<"users"> | null;
  onBack?: () => void;
}

export function ChatHeader({ otherParticipant, onBack }: ChatHeaderProps) {
  if (!otherParticipant) {
    return null;
  }

  return (
    <div className="border-b border-border bg-background p-4">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden rounded-lg p-2 hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
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
