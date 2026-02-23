"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";

export function useStoreUser() {
  const { user, isLoaded } = useUser();
  const storeUser = useMutation(api.users.storeUser);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const syncUser = async () => {
      try {
        await storeUser({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          name: user.fullName || user.username || "Anonymous",
          avatarUrl: user.imageUrl,
        });
      } catch (error) {
        console.error("Error syncing user to Convex:", error);
      }
    };

    syncUser();
  }, [isLoaded, user, storeUser]);
}
