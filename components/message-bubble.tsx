"use client";

import Image from "next/image";
import { Doc } from "@/convex/_generated/dataModel";
import { formatMessageTime } from "@/lib/format-time";

interface MessageWithSender {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: number;
  isDeleted: boolean;
  sender: Doc<"users"> | null;
}

interface MessageBubbleProps {
  message: MessageWithSender;
  isCurrentUser: boolean;
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  return (
    <div
      className={`flex items-end gap-2 ${
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {message.sender && (
        <Image
          src={message.sender.avatarUrl}
          alt={message.sender.name}
          width={32}
          height={32}
          className="rounded-full"
        />
      )}
      <div
        className={`flex flex-col ${
          isCurrentUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`max-w-xs rounded-lg px-4 py-2 ${
            isCurrentUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-foreground"
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <span className="mt-1 text-xs text-muted-foreground">
          {formatMessageTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
