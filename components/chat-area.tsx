"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";
import { TypingIndicator } from "./typing-indicator";
import { EmptyState } from "./empty-state";
import { useEffect, useRef, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { MessageCircle, ArrowDown } from "lucide-react";

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
  const markAsRead = useMutation(api.conversations.markAsRead);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const previousMessageCountRef = useRef(0);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const checkIfAtBottom = () => {
    const container = scrollContainerRef.current;
    if (!container) return true;

    const threshold = 100;
    const isBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold;
    
    setIsAtBottom(isBottom);
    return isBottom;
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const atBottom = checkIfAtBottom();
      if (atBottom) {
        setShowNewMessageButton(false);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!messages) return;

    const currentMessageCount = messages.length;
    const hasNewMessages = currentMessageCount > previousMessageCountRef.current;

    if (hasNewMessages) {
      if (isAtBottom) {
        scrollToBottom("smooth");
        setShowNewMessageButton(false);
      } else {
        setShowNewMessageButton(true);
      }
    }

    previousMessageCountRef.current = currentMessageCount;
  }, [messages, isAtBottom]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      markAsRead({
        conversationId: conversationId as Id<"conversations">,
      }).catch(console.error);
    }
  }, [messages, conversationId, markAsRead]);

  const handleSendMessage = async (content: string) => {
    await sendMessage({
      conversationId: conversationId as Id<"conversations">,
      content,
    });
    scrollToBottom("smooth");
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

  const handleNewMessageClick = () => {
    scrollToBottom("smooth");
    setShowNewMessageButton(false);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div
        ref={scrollContainerRef}
        className="relative flex-1 overflow-y-auto p-4"
      >
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

        {showNewMessageButton && (
          <button
            onClick={handleNewMessageClick}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90"
          >
            <ArrowDown className="h-4 w-4" />
            New messages
          </button>
        )}
      </div>
      <TypingIndicator conversationId={conversationId} />
      <MessageInput onSendMessage={handleSendMessage} onTypingChange={handleTypingChange} />
    </div>
  );
}
