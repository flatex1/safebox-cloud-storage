import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";
import { clerkClient, getAuth } from "@clerk/nextjs/server";

const liveblocks = new Liveblocks({
  secret:
    "sk_dev_uZvEtf8VpZT09sn1EGIAtmKjdLIToLxPjWcW2ilR_cq2Gq0gbSjofydJ0HGEEhvV",
});

function getColorFromId(id: string) {
  const colors = [
    "#FF5733",
    "#33C1FF",
    "#FF33A8",
    "#33FF57",
    "#FFC133",
    "#8E33FF",
    "#33FFD7",
    "#FF3333",
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return new Response("Доступ запрещен", { status: 403 });
  }
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  if (!user) {
    return new Response("Доступ запрещен", { status: 403 });
  }

  const userInfo = {
    name: user.fullName ?? user.username ?? "Участник",
    color: getColorFromId(user.id),
    avatar: user.imageUrl ?? undefined,
    orgId: "",
  };

  const { room } = await request.json();
  const session = liveblocks.prepareSession(user.id, { userInfo });

  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
