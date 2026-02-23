"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useUserPresence() {
  const updateUserStatus = useMutation(api.users.updateUserStatus);

  useEffect(() => {
    const setOnline = () => {
      updateUserStatus({ isOnline: true }).catch(console.error);
    };

    const setOffline = () => {
      updateUserStatus({ isOnline: false }).catch(console.error);
    };

    setOnline();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setOffline();
      } else {
        setOnline();
      }
    };

    const handleBeforeUnload = () => {
      setOffline();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    const interval = setInterval(() => {
      if (!document.hidden) {
        setOnline();
      }
    }, 30000);

    return () => {
      setOffline();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(interval);
    };
  }, [updateUserStatus]);
}
