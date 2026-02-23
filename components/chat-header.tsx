"use client";

import Image from "next/image";
import { Doc } from "@/convex/_generated/dataModel";
import { OnlineStatus } from "./online-status";
import { ArrowLeft, Users } from "lucide-react";

interface ChatHeaderProps {
  otherParticipant?: Doc<"users"> | null;
  isGroup?: boolean;
  groupName?: string;
  memberCount?: number;
  onBack?: () => void;
}

export function ChatHeader({ otherParticipant, isGroup, groupName, memberCount, onBack }: ChatHeaderProps) {
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
        {isGroup ? (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {groupName || "Unnamed Group"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {memberCount} members
              </p>
            </div>
          </>
        ) : otherParticipant ? (
          <>
            <div className="relative">
              <Image
                src={otherParticipant.avatarUrl}
                alt={otherParticipant.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="absolute bottom-0 right-0">
                <OnlineStatus isOnline={otherParticipant.isOnline} size="md" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {otherParticipant.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                {otherParticipant.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
