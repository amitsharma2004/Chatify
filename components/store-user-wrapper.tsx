"use client";

import { useStoreUser } from "@/hooks/use-store-user";
import { useUserPresence } from "@/hooks/use-user-presence";
import { ReactNode } from "react";

export function StoreUserWrapper({ children }: { children: ReactNode }) {
  useStoreUser();
  useUserPresence();
  return <>{children}</>;
}
