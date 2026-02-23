"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convex = useMemo(() => {
    // Only run on client side
    if (typeof window === "undefined") {
      return null;
    }
    
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      console.warn("NEXT_PUBLIC_CONVEX_URL is not set. Convex features will not work.");
      return null;
    }
    return new ConvexReactClient(convexUrl);
  }, []);

  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder";

  // If no Convex client, just use ClerkProvider
  if (!convex) {
    return <ClerkProvider publishableKey={clerkPubKey}>{children}</ClerkProvider>;
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
