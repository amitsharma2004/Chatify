"use client";

import { Header } from "@/components/header";
import { StoreUserWrapper } from "@/components/store-user-wrapper";
import { UserSidebar } from "@/components/user-sidebar";
import { useState } from "react";

export default function Home() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <StoreUserWrapper>
      <div className="flex h-screen flex-col bg-background">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <UserSidebar onUserSelect={setSelectedUserId} />
          <main className="flex flex-1 items-center justify-center">
            {selectedUserId ? (
              <div className="text-center">
                <p className="text-lg text-muted-foreground">
                  Chat with user: {selectedUserId}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Chat functionality coming soon...
                </p>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground">
                  Welcome to Chatify
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Select a user from the sidebar to start chatting
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </StoreUserWrapper>
  );
}
