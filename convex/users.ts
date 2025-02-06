import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, internalMutation, query } from "./_generated/server";
import { roles } from "./schema";

export async function getUser(
    ctx: QueryCtx | MutationCtx, tokenIdentifier: string
) {
    const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) =>
            q.eq("tokenIdentifier", tokenIdentifier))
        .first();

    if (!user) {
        throw new ConvexError("Пользователь должен быть определен.")
    }

    return user;
}

export const createUser = internalMutation({
    args: { tokenIdentifier: v.string(), name: v.string(), image: v.string() },
    async handler(ctx, args) {
        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            orgIds: [],
            name: args.name,
            image: args.image,
        });
    }
})

export const updateUser = internalMutation({
    args: { tokenIdentifier: v.string(), name: v.string(), image: v.string() },
    async handler(ctx, args) {
        const user = await ctx.db.query("users").withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier)).first();

        if (!user) {
            throw new ConvexError("Не найдено пользователя с таким идентификатором.")
        }

        await ctx.db.patch(user._id, {
            name: args.name,
            image: args.image
        });
    }
})

export const addOrgIdToUser = internalMutation({
    args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
    async handler(ctx, args) {
        const user = await getUser(ctx, args.tokenIdentifier);

        await ctx.db.patch(user._id, {
            orgIds: [...user.orgIds, { orgId: args.orgId, role: args.role }]
        })
    },
});

export const updateRoleInOrgForUser = internalMutation({
    args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
    async handler(ctx, args) {
        const user = await getUser(ctx, args.tokenIdentifier);

        const org = user.orgIds.find((org) => org.orgId === args.orgId);
        if (!org) {
            throw new ConvexError("Организация не найдена при обновлении роли пользователя.")
        }
        org.role = args.role;
        await ctx.db.patch(user._id, {
            orgIds: user.orgIds
        })
    },
});

export const getUserProfile = query({
    args: { userId: v.id("users") },
    async handler(ctx, args) {
        const user = await ctx.db.get(args.userId);

        return {
            name: user?.name,
            image: user?.image
        }
    }
})

export const getMe = query({
    args: {},
    async handler(ctx) {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return null;
        }
        
        const user = await getUser(ctx, identity.tokenIdentifier);

        if (!user) {
            return null;
        }

        return user;
    }
})