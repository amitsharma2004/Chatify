"use client";

import { Header } from "@/components/header";
import { StoreUserWrapper } from "@/components/store-user-wrapper";
import { UserSidebar } from "@/components/user-sidebar";
import { ConversationSidebar } from "@/components/conversation-sidebar";
import { ChatArea } from "@/components/chat-area";
import { ChatHeader } from "@/components/chat-header";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showUserList, setShowUserList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createOrGetConversation = useMutation(api.conversations.createOrGetConversation);
  const conversations = useQuery(api.conversations.getConversations);

  const selectedConversation = conversations?.find(
    (conv) => conv._id === selectedConversationId
  );

  const handleUserSelect = async (userId: string) => {
    try {
      setError(null);
      const conversationId = await createOrGetConversation({
        participantId: userId as Id<"users">,
      });
      setSelectedConversationId(conversationId);
      setShowUserList(false);
    } catch (error) {
      console.error("Error creating conversation:", error);
      setError(error instanceof Error ? error.message : "Failed to create conversation");
    }
  };

  const handleBackToList = () => {
    setSelectedConversationId(null);
  };

  return (
    <StoreUserWrapper>
      <div className="flex h-screen flex-col bg-background">
        <Header />
        {error && (
          <div className="flex items-center gap-2 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-xs underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}
        <div className="flex flex-1 overflow-hidden">
          <div
            className={`${
              selectedConversationId ? "hidden md:flex" : "flex"
            } w-full md:w-80`}
          >
            {showUserList ? (
              <UserSidebar onUserSelect={handleUserSelect} />
            ) : (
              <ConversationSidebar
                selectedConversationId={selectedConversationId}
                onConversationSelect={setSelectedConversationId}
              />
            )}
          </div>

          <main
            className={`${
              selectedConversationId ? "flex" : "hidden md:flex"
            } flex-1 flex-col`}
          >
            {selectedConversationId && selectedConversation ? (
              <>
                <ChatHeader
                  otherParticipant={selectedConversation.otherParticipant}
                  onBack={handleBackToList}
                />
                <ChatArea conversationId={selectedConversationId} />
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Welcome to Chatify
                </h2>
                <p className="mt-2 text-center text-muted-foreground">
                  Select a conversation or start a new one
                </p>
                <button
                  onClick={() => setShowUserList(!showUserList)}
                  className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  {showUserList ? "View Conversations" : "New Conversation"}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </StoreUserWrapper>
  );
}
