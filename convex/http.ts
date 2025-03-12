import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      switch (result.type) {
        case "user.created":
          await ctx.runMutation(internal.users.createUser, {
            tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${result.data.id}`,
            name: `${result.data.first_name ?? "Без"} ${result.data.last_name ?? "Имени"}`,
            image: result.data.image_url,
          });
          break;
        case "user.updated":
          await ctx.runMutation(internal.users.updateUser, {
            tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${result.data.id}`,
            name: `${result.data.first_name ?? "Без"} ${result.data.last_name ?? "Имени"}`,
            image: result.data.image_url,
          });
          break;
        case "organizationMembership.created":
          await ctx.runMutation(internal.users.addOrgIdToUser, {
            tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
            orgId: result.data.organization.id,
            role:
              result.data.role === "org:admin" ? "Администратор" : "Участник",
          });
          break;
        case "organizationMembership.updated":
          await ctx.runMutation(internal.users.updateRoleInOrgForUser, {
            tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
            orgId: result.data.organization.id,
            role:
              result.data.role === "org:admin" ? "Администратор" : "Участник",
          });
          break;
      }

      return new Response(null, {
        status: 200,
      });
    } catch {
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

http.route({
  path: "/yookassa-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const payload = await request.text();
      const payloadObj = JSON.parse(payload);

      // Проверка типа события
      if (payloadObj.event === "payment.succeeded") {
        const metadata = payloadObj.object.metadata;

        if (
          metadata &&
          metadata.userId &&
          metadata.orgId &&
          metadata.planType
        ) {
          // Обновляем подписку при успешной оплате
          await ctx.runMutation(internal.payments.updateSubscription, {
            userId: metadata.userId,
            orgId: metadata.orgId,
            planType: metadata.planType,
          });

          // Обновляем статус платежа
          await ctx.runMutation(internal.payments.updatePaymentStatus, {
            externalPaymentId: payloadObj.object.id,
            status: payloadObj.object.status,
          });
        }
      }

      return new Response(null, { status: 200 });
    } catch (error) {
      console.error("Ошибка обработки вебхука ЮКасса", error);
      return new Response("Webhook Error", { status: 400 });
    }
  }),
});

export default http;
