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
  const cleanupRef = useRef(false);
  const lastUpdateTimeRef = useRef(0);

  useEffect(() => {
    if (!currentUser || mountedRef.current) return;
    
    mountedRef.current = true;
    cleanupRef.current = false;
    const MIN_UPDATE_INTERVAL = 8000;

    const setOnline = () => {
      if (cleanupRef.current) return;
      
      const now = Date.now();
      if (globalIsUpdating || now - lastUpdateTimeRef.current < MIN_UPDATE_INTERVAL) {
        return;
      }

      globalIsUpdating = true;
      lastUpdateTimeRef.current = now;
      globalLastUpdate = now;
      
      updateUserStatus({ isOnline: true })
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            globalIsUpdating = false;
          }, 500);
        });
    };

    const setOffline = () => {
      if (cleanupRef.current) return;
      
      const now = Date.now();
      if (globalIsUpdating) return;
      
      globalIsUpdating = true;
      lastUpdateTimeRef.current = now;
      
      updateUserStatus({ isOnline: false })
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            globalIsUpdating = false;
          }, 500);
        });
    };

    setTimeout(setOnline, 500);

    const handleVisibilityChange = () => {
      if (cleanupRef.current) return;
      
      if (document.hidden) {
        setOffline();
      } else {
        setOnline();
      }
    };

    const handleBeforeUnload = () => {
      cleanupRef.current = true;
      updateUserStatus({ isOnline: false }).catch(() => {});
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    const interval = setInterval(() => {
      if (!document.hidden && !cleanupRef.current) {
        setOnline();
      }
    }, 90000);

    return () => {
      cleanupRef.current = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(interval);
      mountedRef.current = false;
      setOffline();
    };
  }, [updateUserStatus, currentUser]);
}
