"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { X, Users, Check } from "lucide-react";
import Image from "next/image";
import { Id } from "@/convex/_generated/dataModel";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (participantIds: Id<"users">[], groupName: string) => Promise<void>;
}

export function CreateGroupModal({ isOpen, onClose, onCreateGroup }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [isCreating, setIsCreating] = useState(false);
  const users = useQuery(api.users.getUsers);

  if (!isOpen) return null;

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUserIds);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUserIds(newSelection);
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedUserIds.size < 2) return;

    setIsCreating(true);
    try {
      await onCreateGroup(
        Array.from(selectedUserIds) as Id<"users">[],
        groupName.trim()
      );
      setGroupName("");
      setSelectedUserIds(new Set());
      onClose();
    } catch (error) {
      console.error("Error creating group:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-background shadow-lg">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Create Group</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-foreground">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name..."
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-foreground">
              Select Members (minimum 2)
            </label>
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-border p-2">
              {users === undefined ? (
                <p className="text-center text-sm text-muted-foreground">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">No users available</p>
              ) : (
                users.map((user) => {
                  const isSelected = selectedUserIds.has(user._id);
                  return (
                    <button
                      key={user._id}
                      onClick={() => toggleUserSelection(user._id)}
                      className={`flex w-full items-center gap-3 rounded-lg p-2 transition-colors ${
                        isSelected ? "bg-primary/10" : "hover:bg-secondary"
                      }`}
                    >
                      <Image
                        src={user.avatarUrl}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      {isSelected && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="mb-2 text-xs text-muted-foreground">
            {selectedUserIds.size} member{selectedUserIds.size !== 1 ? "s" : ""} selected
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!groupName.trim() || selectedUserIds.size < 2 || isCreating}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create Group"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
