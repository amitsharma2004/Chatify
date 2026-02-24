import { v } from "convex/values";
import { query } from "./_generated/server";

export const getTypingUsers = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) {
      return [];
    }

    const STALE_THRESHOLD = 25000; // 25 seconds (1.67x heartbeat of 15s)
    const now = Date.now();

    const allUsers = await ctx.db.query("users").collect();
    
    const typingUsers = allUsers.filter((user) => {
      // Check if user is typing in this conversation
      if (user.typingInConversation !== args.conversationId) {
        return false;
      }
      
      // Exclude current user
      if (user._id === currentUser._id) {
        return false;
      }
      
      // Only show typing if user is actually online
      const isStale = user.lastSeen ? (now - user.lastSeen) > STALE_THRESHOLD : true;
      const isOnline = user.isOnline && !isStale;
      
      return isOnline;
    });

    return typingUsers;
  },
});
