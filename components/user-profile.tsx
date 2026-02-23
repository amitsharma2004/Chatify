"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export function UserProfile() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <Image
        src={user.imageUrl}
        alt={user.fullName || "User avatar"}
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">
          {user.fullName || user.username || "User"}
        </span>
        <span className="text-xs text-muted-foreground">
          {user.primaryEmailAddress?.emailAddress}
        </span>
      </div>
    </div>
  );
}
