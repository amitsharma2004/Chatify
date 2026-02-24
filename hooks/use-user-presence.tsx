"use client";

import { useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Heartbeat interval - how often to ping the server
const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const INITIAL_DELAY = 500; // Initial delay before first update

export function useUserPresence() {
  const updateUserStatus = useMutation(api.users.updateUserStatus);
  const currentUser = useQuery(api.users.getCurrentUser);
  const mountedRef = useRef(false);
  const cleanupRef = useRef(false);

  useEffect(() => {
    if (!currentUser || mountedRef.current) return;
    
    mountedRef.current = true;
    cleanupRef.current = false;

    const setOnline = () => {
      if (cleanupRef.current) return;
      updateUserStatus({ isOnline: true }).catch(() => {});
    };

    const setOffline = () => {
      if (cleanupRef.current) return;
      updateUserStatus({ isOnline: false }).catch(() => {});
    };

    // Set online immediately after mount
    const initialTimeout = setTimeout(setOnline, INITIAL_DELAY);

    // Handle visibility changes (tab switching)
    const handleVisibilityChange = () => {
      if (cleanupRef.current) return;
      
      if (document.hidden) {
        setOffline();
      } else {
        setOnline();
      }
    };

    // Handle page unload
    const handleBeforeUnload = () => {
      cleanupRef.current = true;
      updateUserStatus({ isOnline: false }).catch(() => {});
    };

    // Heartbeat to keep status fresh
    const heartbeatInterval = setInterval(() => {
      if (!document.hidden && !cleanupRef.current) {
        setOnline();
      }
    }, HEARTBEAT_INTERVAL);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup on unmount
    return () => {
      cleanupRef.current = true;
      clearTimeout(initialTimeout);
      clearInterval(heartbeatInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      mountedRef.current = false;
      setOffline();
    };
  }, [updateUserStatus, currentUser]);
}
