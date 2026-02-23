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

    const allUsers = await ctx.db.query("users").collect();
    
    const typingUsers = allUsers.filter(
      (user) =>
        user.typingInConversation === args.conversationId &&
        user._id !== currentUser._id
    );

    return typingUsers;
  },
});
