"use client";

import Image from "next/image";
import { Doc } from "@/convex/_generated/dataModel";

interface UserListItemProps {
  user: Doc<"users">;
  onClick: () => void;
}

export function UserListItem({ user, onClick }: UserListItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg p-3 transition-colors hover:bg-secondary"
    >
      <Image
        src={user.avatarUrl}
        alt={user.name}
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium text-foreground">{user.name}</span>
        <span className="text-xs text-muted-foreground">{user.email}</span>
      </div>
    </button>
  );
}
