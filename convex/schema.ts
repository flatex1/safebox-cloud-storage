import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const fileTypes = v.union(v.literal("image"), v.literal("csv"), v.literal("pdf"), v.literal("archive"), v.literal("text"));
export const roles = v.union(v.literal("Администратор"), v.literal("Участник"));

export default defineSchema({
    folders: defineTable({
        name: v.string(),
        orgId: v.string(),
        userId: v.string(),
        parentId: v.optional(v.id("folders")),
        description: v.optional(v.string()),
    })
        .index("by_orgId", ["orgId"])
        .index("by_parentId", ["parentId"]),

    files: defineTable({
        name: v.string(),
        type: fileTypes,
        fileId: v.id("_storage"),
        orgId: v.string(),
        userId: v.id("users"),
        shouldDelete: v.optional(v.boolean()),
        folderId: v.optional(v.id("folders")),
        size: v.optional(v.number()),
    })
        .index("by_orgId", ["orgId"])
        .index("by_shouldDelete", ["shouldDelete"])
        .index("by_userId", ["userId"])
        .index("by_folderId", ["folderId"]),

    favorites: defineTable({
        fileId: v.id("files"),
        orgId: v.string(),
        userId: v.id("users"),
    }).index("by_userId_orgId_fileId", ["userId", "orgId", "fileId"]),

    users: defineTable({
        tokenIdentifier: v.string(),
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        orgIds: v.array(v.object({
            orgId: v.string(),
            role: roles
        }))
    }).index("by_tokenIdentifier", ["tokenIdentifier"]),

    // Платежи и подписки
    payments: defineTable({
        userId: v.string(),
        orgId: v.string(),
        externalPaymentId: v.string(),
        status: v.string(),
        amount: v.number(),
        planType: v.string(),
        createdAt: v.number()
      })
      .index("by_userId", ["userId"])
      .index("by_orgId", ["orgId"])
      .index("by_externalPaymentId", ["externalPaymentId"]),
      
      subscriptions: defineTable({
        userId: v.string(),
        orgId: v.string(),
        planType: v.string(),
        storageLimit: v.number(), // в мегабайтах
        expiresAt: v.number(),
        isActive: v.boolean()
      })
      .index("by_userId", ["userId"])
      .index("by_orgId", ["orgId"])
});