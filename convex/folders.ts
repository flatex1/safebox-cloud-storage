import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

import { hasAccessToOrg } from "./access";

export const createFolder = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
    parentId: v.optional(v.id("folders")),
    description: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Вы должны войти в систему");
    }

    const userId = identity.subject;

    // Проверка существования родительской папки, если указана
    if (args.parentId) {
      const parentFolder = await ctx.db.get(args.parentId);
      if (!parentFolder) {
        throw new ConvexError("Родительская папка не найдена");
      }

      if (parentFolder.orgId !== args.orgId) {
        throw new ConvexError("Недопустимая родительская папка");
      }
    }

    const folderId = await ctx.db.insert("folders", {
      name: args.name,
      orgId: args.orgId,
      userId,
      parentId: args.parentId,
      description: args.description,
    });

    return folderId;
  },
});

// Получение папок в текущей директории
export const getFolders = query({
  args: {
    orgId: v.string(),
    parentId: v.optional(v.id("folders")),
    query: v.optional(v.string()),
    favoritesOnly: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Вы должны войти в систему");
    }

    if (!args.favoritesOnly) {
      let foldersQuery;

      if (args.parentId) {
        foldersQuery = ctx.db
          .query("folders")
          .withIndex("by_parentId", (q) => q.eq("parentId", args.parentId))
          .filter((q) => q.eq(q.field("orgId"), args.orgId));
      } else {
        foldersQuery = ctx.db
          .query("folders")
          .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
          .filter((q) => q.eq(q.field("parentId"), undefined));
      }

      // Фильтр по названию, если указан запрос
      if (args.query) {
        foldersQuery = foldersQuery.filter((q) =>
          q.or(
            q.eq(q.field("name"), `%${args.query!.toLowerCase()}%`),
            q.eq(q.field("description"), `%${args.query!.toLowerCase()}%`)
          )
        );
      }

      return await foldersQuery.collect();
    }

    // Проверяем пользователя на доступ к организации
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      return [];
    }

    // Получаем все избранные файлы пользователя
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
      )
      .collect();

    // Если нет избранного вообще, возвращаем пустой массив
    if (favorites.length === 0) {
      return [];
    }

    const favoriteFileIds = favorites.map((fav) => fav.fileId);
    const favoriteFiles = await Promise.all(
      favoriteFileIds.map((fileId) => ctx.db.get(fileId))
    );

    // Фильтруем файлы по текущей папке и не помеченные на удаление
    const filesInCurrentFolder = favoriteFiles
      .filter(Boolean)
      .filter(
        (file) =>
          file?.folderId === args.parentId && file?.shouldDelete === false
      );

    // Если в текущей папке нет избранных файлов
    if (filesInCurrentFolder.length === 0 && args.parentId !== undefined) {
      return [];
    }

    // Получаем уникальные ID папок в текущей директории с избранными файлами
    const folderIds = new Set();

    if (args.parentId === undefined) {
      // В корне - собираем все папки, содержащие избранные файлы
      for (const file of favoriteFiles
        .filter(Boolean)
        .filter((file) => !file?.shouldDelete)) {
        if (file?.folderId) {
          folderIds.add(file.folderId);
        }
      }
    }

    // Получаем папки
    const folders = await Promise.all(
      Array.from(folderIds).map((id) => ctx.db.get(id as Id<"folders">))
    );

    return folders.filter(Boolean);
  },
});

export const getFolder = query({
  args: {
    folderId: v.id("folders"),
  },
  async handler(ctx, args) {
    const folder = await ctx.db.get(args.folderId);
    return folder;
  },
});

export const getFolderPath = query({
  args: {
    folderId: v.optional(v.id("folders")),
  },
  async handler(ctx, args) {
    const path: Array<Doc<"folders">> = [];
    let currentFolderId = args.folderId;

    // Рекурсивно собираем путь от текущей папки до корня
    while (currentFolderId) {
      const folder = await ctx.db.get(currentFolderId);
      if (!folder) break;

      path.unshift(folder);
      currentFolderId = folder.parentId;
    }

    return path;
  },
});

export const deleteFolder = mutation({
  args: {
    folderId: v.id("folders"),
    recursive: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Вы должны войти в систему");
    }

    const folder = await ctx.db.get(args.folderId);
    if (!folder) {
      throw new ConvexError("Папка не найдена");
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_folderId", (q) => q.eq("folderId", args.folderId))
      .collect();

    const subfolders = await ctx.db
      .query("folders")
      .withIndex("by_parentId", (q) => q.eq("parentId", args.folderId))
      .collect();

    if ((files.length > 0 || subfolders.length > 0) && !args.recursive) {
      throw new ConvexError(
        "Папка не пуста. Установите recursive=true для удаления с содержимым."
      );
    }

    // Рекурсивное удаление содержимого, если задан флаг recursive
    if (args.recursive) {
      // Перемещаем файлы в корзину
      for (const file of files) {
        await ctx.db.patch(file._id, { shouldDelete: true });
      }

      // Рекурсивно удаляем подпапки
      for (const subfolder of subfolders) {
        await ctx.db.delete(subfolder._id);
      }
    }

    await ctx.db.delete(args.folderId);
    return { success: true };
  },
});

export const renameFolder = mutation({
  args: {
    folderId: v.id("folders"),
    name: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Вы должны войти в систему");
    }

    const folder = await ctx.db.get(args.folderId);
    if (!folder) {
      throw new ConvexError("Папка не найдена");
    }

    await ctx.db.patch(args.folderId, { name: args.name });
    return { success: true };
  },
});
