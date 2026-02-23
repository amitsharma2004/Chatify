"use client";

import { UserProfile } from "./user-profile";
import { LogoutButton } from "./logout-button";

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-primary">Chatify</h1>
        </div>
        <div className="flex items-center gap-4">
          <UserProfile />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
