import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.string(),
    createdAt: v.number(),
    isOnline: v.optional(v.boolean()),
    lastSeen: v.optional(v.number()),
    typingInConversation: v.optional(v.id("conversations")),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  conversations: defineTable({
    participantIds: v.array(v.id("users")),
    isGroup: v.boolean(),
    groupName: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastReadBy: v.optional(
      v.array(
        v.object({
          userId: v.id("users"),
          messageId: v.id("messages"),
        })
      )
    ),
  })
    .index("by_participant", ["participantIds"])
    .index("by_updated_at", ["updatedAt"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
    isDeleted: v.boolean(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_conversation_created", ["conversationId", "createdAt"]),
});
