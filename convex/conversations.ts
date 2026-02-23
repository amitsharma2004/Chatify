import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const createGroupConversation = mutation({
  args: {
    participantIds: v.array(v.id("users")),
    groupName: v.string(),
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

    if (args.participantIds.length < 2) {
      throw new Error("Group must have at least 2 members");
    }

    const allParticipantIds = [...args.participantIds, currentUser._id];
    const uniqueParticipantIds = Array.from(new Set(allParticipantIds));

    const conversationId = await ctx.db.insert("conversations", {
      participantIds: uniqueParticipantIds,
      isGroup: true,
      groupName: args.groupName,
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
        let otherParticipant = null;
        let participants = null;

        if (conversation.isGroup) {
          participants = await Promise.all(
            conversation.participantIds.map((id) => ctx.db.get(id))
          );
        } else {
          const otherParticipantId = conversation.participantIds.find(
            (id) => id !== currentUser._id
          );
          otherParticipant = otherParticipantId
            ? await ctx.db.get(otherParticipantId)
            : null;
        }

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
          participants,
          lastMessage,
        };
      })
    );

    return conversationsWithDetails.sort(
      (a, b) => (b.lastMessage?.createdAt || b.updatedAt) - (a.lastMessage?.createdAt || a.updatedAt)
    );
  },
});

export const markAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return;
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) {
      return;
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) => q.eq(q.field("isDeleted"), false))
      .collect();

    const lastMessage = messages.sort((a, b) => b.createdAt - a.createdAt)[0];

    if (!lastMessage) {
      return;
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      return;
    }

    const lastReadBy = conversation.lastReadBy || [];
    const existingEntry = lastReadBy.find(
      (entry) => entry.userId === currentUser._id
    );

    if (existingEntry && existingEntry.messageId === lastMessage._id) {
      return;
    }

    const updatedLastReadBy = lastReadBy.filter(
      (entry) => entry.userId !== currentUser._id
    );
    updatedLastReadBy.push({
      userId: currentUser._id,
      messageId: lastMessage._id,
    });

    await ctx.db.patch(args.conversationId, {
      lastReadBy: updatedLastReadBy,
    });
  },
});

export const getUnreadCount = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return 0;
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) {
      return 0;
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      return 0;
    }

    const lastReadEntry = conversation.lastReadBy?.find(
      (entry) => entry.userId === currentUser._id
    );

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) => q.eq(q.field("isDeleted"), false))
      .collect();

    if (!lastReadEntry) {
      return messages.filter((m) => m.senderId !== currentUser._id).length;
    }

    const lastReadMessage = await ctx.db.get(lastReadEntry.messageId);
    if (!lastReadMessage) {
      return messages.filter((m) => m.senderId !== currentUser._id).length;
    }

    const unreadMessages = messages.filter(
      (m) =>
        m.createdAt > lastReadMessage.createdAt &&
        m.senderId !== currentUser._id
    );

    return unreadMessages.length;
  },
});
