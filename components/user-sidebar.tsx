"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserListItem } from "./user-list-item";
import { UserListSkeleton } from "./user-list-skeleton";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";

interface UserSidebarProps {
  onUserSelect: (userId: string) => void;
}

export function UserSidebar({ onUserSelect }: UserSidebarProps) {
  const users = useQuery(api.users.getUsers);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  return (
    <div className="flex h-full w-80 flex-col border-r border-border bg-background">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">Messages</h2>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {users === undefined ? (
          <UserListSkeleton />
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No users found" : "No users available"}
            </p>
            {searchQuery && (
              <p className="mt-1 text-xs text-muted-foreground">
                Try a different search term
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredUsers.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                onClick={() => onUserSelect(user._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
