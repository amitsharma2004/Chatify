"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";
import { TypingIndicator } from "./typing-indicator";
import { EmptyState } from "./empty-state";
import { useEffect, useRef } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { MessageCircle } from "lucide-react";

interface ChatAreaProps {
  conversationId: string;
}

export function ChatArea({ conversationId }: ChatAreaProps) {
  const { user } = useUser();
  const messages = useQuery(api.messages.getMessages, {
    conversationId: conversationId as Id<"conversations">,
  });
  const sendMessage = useMutation(api.messages.sendMessage);
  const setTypingStatus = useMutation(api.users.setTypingStatus);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    await sendMessage({
      conversationId: conversationId as Id<"conversations">,
      content,
    });
  };

  const handleTypingChange = async (isTyping: boolean) => {
    try {
      await setTypingStatus({
        conversationId: isTyping ? (conversationId as Id<"conversations">) : undefined,
      });
    } catch (error) {
      console.error("Error updating typing status:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages === undefined ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <EmptyState
              icon={MessageCircle}
              title="No messages yet"
              description="Start the conversation by sending a message!"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isCurrentUser={message.sender?.clerkId === user?.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <TypingIndicator conversationId={conversationId} />
      <MessageInput onSendMessage={handleSendMessage} onTypingChange={handleTypingChange} />
    </div>
  );
}
