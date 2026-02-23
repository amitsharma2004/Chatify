"use client";

import { useStoreUser } from "@/hooks/use-store-user";
import { ReactNode } from "react";

export function StoreUserWrapper({ children }: { children: ReactNode }) {
  useStoreUser();
  return <>{children}</>;
}
