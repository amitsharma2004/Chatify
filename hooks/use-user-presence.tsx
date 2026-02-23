"use client";

import { useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Global state to prevent multiple instances from firing simultaneously
let globalLastUpdate = 0;
let globalIsUpdating = false;

export function useUserPresence() {
  const updateUserStatus = useMutation(api.users.updateUserStatus);
  const currentUser = useQuery(api.users.getCurrentUser);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!currentUser || mountedRef.current) return;
    
    mountedRef.current = true;
    const MIN_UPDATE_INTERVAL = 10000; // 10 seconds minimum between any updates

    const setOnline = () => {
      const now = Date.now();
      if (globalIsUpdating || now - globalLastUpdate < MIN_UPDATE_INTERVAL) {
        return;
      }

      globalIsUpdating = true;
      globalLastUpdate = now;
      
      updateUserStatus({ isOnline: true })
        .catch(() => {}) // Silently fail
        .finally(() => {
          setTimeout(() => {
            globalIsUpdating = false;
          }, 1000);
        });
    };

    const setOffline = () => {
      if (globalIsUpdating) return;
      
      globalIsUpdating = true;
      updateUserStatus({ isOnline: false })
        .catch(() => {})
        .finally(() => {
          globalIsUpdating = false;
        });
    };

    // Only set online once on mount
    setTimeout(setOnline, 1000);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setOffline();
      } else {
        setOnline();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Much longer heartbeat - 2 minutes
    const interval = setInterval(() => {
      if (!document.hidden) {
        setOnline();
      }
    }, 120000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
      mountedRef.current = false;
      // Don't call setOffline on unmount during development (hot reload)
      if (process.env.NODE_ENV === 'production') {
        setOffline();
      }
    };
  }, [updateUserStatus, currentUser]);
}
