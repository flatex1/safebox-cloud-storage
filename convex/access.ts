import { ConvexError } from "convex/values";
import { MutationCtx, QueryCtx } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Проверка доступа к организации
export async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .first();

  if (!user) {
    return false;
  }

  const hasAccess =
    user.orgIds.some((item) => item.orgId === orgId) ||
    user.tokenIdentifier.includes(orgId) ||
    user._id === orgId;

  if (!hasAccess) {
    return null;
  }

  return { user };
}

// Проверка доступа к файлу
export async function hasAccessToFile(
  ctx: QueryCtx | MutationCtx,
  fileId: Id<"files">
) {
  const file = await ctx.db.get(fileId);

  if (!file) {
    return null;
  }

  const hasAccess = await hasAccessToOrg(ctx, file.orgId);

  if (!hasAccess) {
    return null;
  }

  return { user: hasAccess.user, file };
}

// Проверка прав на удаление файла
export function assertCanDeleteFile(user: Doc<"users">, file: Doc<"files">) {
  const canDelete =
    file.userId === user._id ||
    user.orgIds.find((org) => org.orgId === file.orgId)?.role ===
      "Администратор";

  if (!canDelete) {
    throw new ConvexError("У вас нет прав на удаление этого файла");
  }
}

// Проверка доступа к папке
export async function hasAccessToFolder(
  ctx: QueryCtx | MutationCtx,
  folderId: Id<"folders">
) {
  const folder = await ctx.db.get(folderId);

  if (!folder) {
    return null;
  }

  const hasAccess = await hasAccessToOrg(ctx, folder.orgId);

  if (!hasAccess) {
    return null;
  }

  return { user: hasAccess.user, folder };
}
