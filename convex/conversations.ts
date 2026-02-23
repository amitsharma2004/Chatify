import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const createOrGetConversation = mutation({
  args: {
    participantId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) {
      throw new Error("User not found");
    }

    const participantIds = [currentUser._id, args.participantId].sort();

    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) => {
        return q.and(
          q.eq(q.field("isGroup"), false),
          q.eq(q.field("participantIds"), participantIds)
        );
      })
      .first();

    if (existingConversation) {
      return existingConversation._id;
    }

    const conversationId = await ctx.db.insert("conversations", {
      participantIds,
      isGroup: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return conversationId;
  },
});

export const getConversations = query({
  args: {},
  handler: async (ctx) => {
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

    const allConversations = await ctx.db.query("conversations").collect();
    
    const userConversations = allConversations.filter((conversation) =>
      conversation.participantIds.includes(currentUser._id)
    );

    const conversationsWithDetails = await Promise.all(
      userConversations.map(async (conversation) => {
        const otherParticipantId = conversation.participantIds.find(
          (id) => id !== currentUser._id
        );

        const otherParticipant = otherParticipantId
          ? await ctx.db.get(otherParticipantId)
          : null;

        const messages = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) =>
            q.eq("conversationId", conversation._id)
          )
          .filter((q) => q.eq(q.field("isDeleted"), false))
          .collect();

        const lastMessage = messages.sort((a, b) => b.createdAt - a.createdAt)[0];

        return {
          ...conversation,
          otherParticipant,
          lastMessage,
        };
      })
    );

    return conversationsWithDetails.sort(
      (a, b) => (b.lastMessage?.createdAt || b.updatedAt) - (a.lastMessage?.createdAt || a.updatedAt)
    );
  },
});
