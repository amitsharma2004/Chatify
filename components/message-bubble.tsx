"use client";

import Image from "next/image";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { formatMessageTime } from "@/lib/format-time";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface MessageWithSender {
  _id: Id<"messages">;
  conversationId: Id<"conversations">;
  senderId: Id<"users">;
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
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting || message.isDeleted) return;

    setIsDeleting(true);
    try {
      await deleteMessage({ messageId: message._id });
    } catch (error) {
      console.error("Error deleting message:", error);
    } finally {
      setIsDeleting(false);
    }
  };

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
        <div className="group relative">
          <div
            className={`max-w-xs rounded-lg px-4 py-2 ${
              isCurrentUser
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground"
            }`}
          >
            {message.isDeleted ? (
              <p className="text-sm italic opacity-70">This message was deleted</p>
            ) : (
              <p className="text-sm">{message.content}</p>
            )}
          </div>
          {isCurrentUser && !message.isDeleted && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="absolute -right-8 top-1/2 -translate-y-1/2 rounded p-1 opacity-0 transition-opacity hover:bg-secondary group-hover:opacity-100 disabled:opacity-50"
              title="Delete message"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <span className="mt-1 text-xs text-muted-foreground">
          {formatMessageTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
