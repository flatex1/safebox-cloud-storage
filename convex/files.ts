import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { fileTypes } from "./schema";
import { hasAccessToOrg, hasAccessToFile, assertCanDeleteFile } from "./access";

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
    orgId: v.string(),
    folderId: v.optional(v.id("folders")),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      throw new ConvexError("Вы не имеете доступа к этой организации.");
    }

    if (args.folderId) {
      const folder = await ctx.db.get(args.folderId);
      if (!folder) {
        throw new ConvexError("Папка не найдена");
      }
      if (folder.orgId !== args.orgId) {
        throw new ConvexError("Вы не имеете доступа к этой папке.");
      }
    }

    await ctx.db.insert("files", {
      name: args.name,
      type: args.type,
      fileId: args.fileId,
      orgId: args.orgId,
      shouldDelete: false,
      userId: hasAccess.user._id,
      folderId: args.folderId,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
    folderId: v.optional(v.id("folders")),
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

    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      return [];
    }

    let filesQuery = ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId));

    // Фильтрация по папке
    if (args.folderId !== undefined) {
      filesQuery = filesQuery.filter((q) =>
        q.eq(q.field("folderId"), args.folderId)
      );
    } else if (
      args.folderId === undefined &&
      !args.deletedOnly &&
      !args.favorites
    ) {
      // Если папка не указана и не смотрим корзину или избранное, показываем только файлы корневого уровня
      filesQuery = filesQuery.filter((q) =>
        q.eq(q.field("folderId"), undefined)
      );
    }

    if (args.deletedOnly) {
      filesQuery = filesQuery.filter((q) =>
        q.eq(q.field("shouldDelete"), true)
      );
    } else {
      filesQuery = filesQuery.filter((q) =>
        q.eq(q.field("shouldDelete"), false)
      );
    }

    // Поиск по имени
    if (args.query) {
      filesQuery = filesQuery.filter((q) =>
        q.eq(q.field("name"), args.query!.toLowerCase())
      );
    }

    const files = await filesQuery.collect();

    // Фильтр избранного
    if (args.favorites) {
      const favorites = await ctx.db
        .query("favorites")
        .withIndex("by_userId_orgId_fileId", (q) =>
          q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
        )
        .collect();

      const favoriteIds = new Set(favorites.map((f) => f.fileId));

      // Если указан folderId, показываем только файлы в этой папке
      // Если folderId не указан, показываем только файлы БЕЗ папки
      const result = files
        .filter((file) => favoriteIds.has(file._id))
        .filter((file) => {
          if (args.folderId !== undefined) {
            return file.folderId === args.folderId;
          } else {
            return file.folderId === undefined;
          }
        })
        .map((file) => ({ ...file, isFavorited: true }));

      return result;
    }

    // Получение избранных файлов
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
      )
      .collect();

    const favoriteIds = new Set(favorites.map((f) => f.fileId));

    if (args.type) {
      files.filter((file) => file.type === args.type);
    }

    return files.map((file) => ({
      ...file,
      isFavorited: favoriteIds.has(file._id),
    }));
  },
});

export const deleteAllFiles = internalMutation({
  args: {},
  async handler(ctx) {
    const files = await ctx.db
      .query("files")
      .withIndex("by_shouldDelete", (q) => q.eq("shouldDelete", true))
      .collect();

    await Promise.all(
      files.map(async (file) => {
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
    const hasAccess = await hasAccessToFile(ctx, args.fileId);

    if (!hasAccess) {
      throw new ConvexError("Ограничено в доступе к этому файлу");
    }

    assertCanDeleteFile(hasAccess.user, hasAccess.file);

    await ctx.db.patch(args.fileId, {
      shouldDelete: true,
    });
  },
});

export const restoreFile = mutation({
  args: {
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToFile(ctx, args.fileId);

    if (!hasAccess) {
      throw new ConvexError("Ограничено в доступе к этому файлу");
    }

    assertCanDeleteFile(hasAccess.user, hasAccess.file);

    await ctx.db.patch(args.fileId, {
      shouldDelete: false,
    });
  },
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

export const getUser = query({
  args: {},
  async handler(ctx) {
    const user = await ctx.auth.getUserIdentity();

    return user;
  },
});
