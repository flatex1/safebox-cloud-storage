import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, internalMutation, mutation, query } from "./_generated/server";
import { fileTypes } from "./schema";
import { Doc, Id } from "./_generated/dataModel";

function assertCanDeleteFile(user: Doc<"users">, file: Doc<"files">) {
  const canDelete = 
    file.userId === user._id ||
    user.orgIds.find(org => org.orgId === file.orgId)?.role === "Администратор";

    if (!canDelete) {
      throw new ConvexError("У вас нет прав на удаление этого файла");
    }
}

async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  const user = await ctx.db.query("users").withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier)).first();

  if (!user) {
    return false;
  }

  const hasAccess =
    user.orgIds.some((item) => item.orgId === orgId) || user.tokenIdentifier.includes(orgId);

  if (!hasAccess) {
    return null;
  }

  return { user };
}

async function hasAccessToFile(ctx: QueryCtx | MutationCtx, fileId: Id<"files">) {
  const file = await ctx.db.get(fileId);

  if (!file) {
    return null;
  }

  const hasAccess = await hasAccessToOrg(
    ctx,
    file.orgId
  );

  if (!hasAccess) {
    return null;
  }

  return { user: hasAccess.user, file };
}

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return [];
  }

  return await ctx.storage.generateUploadUrl();
});

export const getFileUrl = query({
  args: {
    fileId: v.id("_storage"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Ограничено в доступе");
    }

    const fileUrl = await ctx.storage.getUrl(args.fileId);

    if (!fileUrl) {
      throw new ConvexError("Файл не найден");
    }

    return fileUrl;
  },
});

export const createFile = mutation({
  args: {
    name: v.string(),
    type: fileTypes,
    fileId: v.id("_storage"),
    orgId: v.string()
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(
      ctx,
      args.orgId
    );

    if (!hasAccess) {
      throw new ConvexError("Вы не имеете доступа к этой организации.")
    }

    await ctx.db.insert("files", {
      name: args.name,
      type: args.type,
      fileId: args.fileId,
      orgId: args.orgId,
      userId: hasAccess.user._id,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    favorites: v.optional(v.boolean()),
    deletedOnly: v.optional(v.boolean()),
    type: v.optional(fileTypes),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      args.orgId
    );

    if (!hasAccess) {
      return [];
    }

    let files = await ctx.db
      .query('files')
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();

    const query = args.query;

    if (query) {
      files = files.filter((file) => file.name.toLowerCase().includes(query.toLowerCase()));
    }

    if (args.favorites) {
      const favorites = await ctx.db
        .query("favorites")
        .withIndex("by_userId_orgId_fileId", (q) =>
          q.eq("userId", hasAccess.user._id)
            .eq("orgId", args.orgId)
        )
        .collect();

      files = files.filter((file) => favorites.some((favorite) => favorite.fileId === file._id));
    }

    if (args.deletedOnly) {
      files = files.filter((file) => file.shouldDelete);
    } else {
      files = files.filter((file) => !file.shouldDelete);
    }

    if (args.type) {
      files = files.filter((file) => file.type === args.type);
    }

    return files;
  },
});

export const deleteAllFiles = internalMutation({
  args: {},
  async handler(ctx) {

    const files = await ctx.db
      .query("files")
      .withIndex("by_shouldDelete", (q) => q.eq("shouldDelete", true))
      .collect();

    await Promise.all(files.map(async (file) => {
      await ctx.storage.delete(file.fileId);
      return await ctx.db.delete(file._id);
    })
  );
},
});

export const deleteFile = mutation({
  args: {
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access) {
      throw new ConvexError("Ограничено в доступе к этому файлу");
    }

    assertCanDeleteFile(access.user, access.file);

    await ctx.db.patch(args.fileId, {
      shouldDelete: true,
    });
  }
});

export const restoreFile = mutation({
  args: {
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access) {
      throw new ConvexError("Ограничено в доступе к этому файлу");
    }

    assertCanDeleteFile(access.user, access.file);

    await ctx.db.patch(args.fileId, {
      shouldDelete: false,
    });
  }
});

export const toggleFavorite = mutation({
  args: {
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access) {
      throw new ConvexError("Ограничено в доступе к этому файлу");
    }
    const favorite = await ctx.db.query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q.eq("userId", access.user._id)
          .eq("orgId", access.file.orgId)
          .eq("fileId", access.file._id)
      )
      .first();

    if (!favorite) {
      await ctx.db.insert("favorites", {
        userId: access.user._id,
        orgId: access.file.orgId,
        fileId: access.file._id,
      });
    } else {
      await ctx.db.delete(favorite._id);
    }
  }
});

export const getAllFavorites = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(
      ctx,
      args.orgId
    );

    if (!hasAccess) {
      return [];
    }
    const favorites = await ctx.db.query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q.eq("userId", hasAccess.user._id)
          .eq("orgId", args.orgId)
      )
      .collect();

    return favorites;
  }
});

export const getFile = query({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const file = await ctx.db.get(args.fileId);
    return file;
  },
});

export const generatePublicDownloadUrl = query({
  args: {
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new ConvexError("Файл не найден");
    }
    const url = await ctx.storage.getUrl(file.fileId);
    return url;
  },
});