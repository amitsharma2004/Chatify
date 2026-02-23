"use client";

import { Header } from "@/components/header";
import { StoreUserWrapper } from "@/components/store-user-wrapper";
import { UserSidebar } from "@/components/user-sidebar";
import { ConversationSidebar } from "@/components/conversation-sidebar";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function Home() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showUserList, setShowUserList] = useState(false);
  const createOrGetConversation = useMutation(api.conversations.createOrGetConversation);

  const handleUserSelect = async (userId: string) => {
    try {
      const conversationId = await createOrGetConversation({
        participantId: userId as Id<"users">,
      });
      setSelectedConversationId(conversationId);
      setShowUserList(false);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  return (
    <StoreUserWrapper>
      <div className="flex h-screen flex-col bg-background">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          {showUserList ? (
            <UserSidebar onUserSelect={handleUserSelect} />
          ) : (
            <ConversationSidebar
              selectedConversationId={selectedConversationId}
              onConversationSelect={setSelectedConversationId}
            />
          )}
          
          <main className="flex flex-1 flex-col items-center justify-center">
            {selectedConversationId ? (
              <div className="text-center">
                <p className="text-lg text-muted-foreground">
                  Chat view coming soon...
                </p>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground">
                  Welcome to Chatify
                </h2>
                <p className="mt-2 text-muted-foreground">
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
