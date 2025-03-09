import { v } from "convex/values";
import { action, internalMutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

// Планы подписок (в мегабайтах)
export const PLANS = {
  free: {
    name: "Бесплатный",
    storage: 1000, // 1 ГБ в МБ
    price: 0,
  },
  pro: {
    name: "Про",
    storage: 50000, // 50 ГБ в МБ
    price: 990,
  },
  business: {
    name: "Бизнес",
    storage: 200000, // 200 ГБ в МБ
    price: 1990,
  },
};

// Схема ответа ЮКассы
interface YookassaPaymentResponse {
  id: string;
  status: string;
  confirmation: {
    confirmation_url: string;
  };
}

function generateRandomId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Создание платежа
export const createPayment = action({
  args: {
    orgId: v.string(),
    planType: v.string(),
    returnUrl: v.string(),
  },
  handler: async (
    ctx,
    args
  ): Promise<{ paymentId: Id<"payments">; confirmationUrl: string }> => {
    "use node";

    const fetch = globalThis.fetch;

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Вы должны войти в систему");
    }

    const plan = PLANS[args.planType as keyof typeof PLANS];
    if (!plan || plan.price === 0) {
      throw new ConvexError("Такого тарифного плана не существует");
    }

    // Идентификатор идемпотентности
    const idempotenceKey = generateRandomId();

    try {
      const paymentData = {
        amount: {
          value: String(plan.price),
          currency: "RUB",
        },
        confirmation: {
          type: "redirect",
          return_url: args.returnUrl,
        },
        metadata: {
          userId: identity.subject,
          orgId: args.orgId,
          planType: args.planType,
        },
        capture: "true",
        description: `Подписка на тариф ${plan.name} для SafeBox`,
      };

      const shopId = process.env.YOOKASSA_SHOP_ID!;
      const secretKey = process.env.YOOKASSA_SECRET_KEY!;

      const authString = btoa(`${shopId}:${secretKey}`);

      const response = await fetch("https://api.yookassa.ru/v3/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotence-Key": idempotenceKey,
          Authorization: `Basic ${authString}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка ЮКассы: ${response.status} ${errorText}`);
      }

      const payment = (await response.json()) as YookassaPaymentResponse;

      // Сохраняем платеж
      const paymentId = await ctx.runMutation(internal.payments.storePayment, {
        userId: identity.subject,
        orgId: args.orgId,
        paymentId: payment.id,
        status: payment.status,
        amount: plan.price,
        planType: args.planType,
      });

      return {
        paymentId,
        confirmationUrl: payment.confirmation.confirmation_url,
      };
    } catch (error) {
      console.error("Ошибка создания платежа:", error);

      throw new ConvexError(
        `Не удалось создать платеж: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`
      );
    }
  },
});

// Сохранение информации о платеже
export const storePayment = internalMutation({
  args: {
    userId: v.string(),
    orgId: v.string(),
    paymentId: v.string(),
    status: v.string(),
    amount: v.number(),
    planType: v.string(),
  },
  async handler(ctx, args) {
    return await ctx.db.insert("payments", {
      userId: args.userId,
      orgId: args.orgId,
      externalPaymentId: args.paymentId,
      status: args.status,
      amount: args.amount,
      planType: args.planType,
      createdAt: Date.now(),
    });
  },
});

// Обновление статуса подписки
export const updateSubscription = internalMutation({
  args: {
    userId: v.string(),
    orgId: v.string(),
    planType: v.string(),
  },
  async handler(ctx, args) {
    const plan = PLANS[args.planType as keyof typeof PLANS];
    if (!plan) {
      throw new ConvexError("Неверный тарифный план");
    }

    // Поиск существующей подписки
    const existingSubscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .first();

    const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
    const expiresAt = Date.now() + oneMonthInMs;

    if (existingSubscription) {
      // Обновление существующей подписки
      await ctx.db.patch(existingSubscription._id, {
        planType: args.planType,
        storageLimit: plan.storage,
        expiresAt: expiresAt,
        isActive: true,
      });
      return existingSubscription._id;
    } else {
      // Создание новой подписки
      return await ctx.db.insert("subscriptions", {
        userId: args.userId,
        orgId: args.orgId,
        planType: args.planType,
        storageLimit: plan.storage,
        expiresAt: expiresAt,
        isActive: true,
      });
    }
  },
});

export const updatePaymentStatus = internalMutation({
  args: {
    externalPaymentId: v.string(),
    status: v.string(),
  },
  async handler(ctx, args) {
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_externalPaymentId", (q) =>
        q.eq("externalPaymentId", args.externalPaymentId)
      )
      .first();

    if (payment) {
      await ctx.db.patch(payment._id, { status: args.status });
    }
  },
});

// Получение статуса подписки
export const getSubscriptionStatus = query({
  args: { orgId: v.string() },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Вы должны войти в систему");
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .first();

    if (!subscription) {
      return {
        isActive: true,
        planType: "free",
        storageLimit: PLANS.free.storage,
        expiresAt: null,
      };
    }

    return {
      isActive: subscription.isActive && subscription.expiresAt > Date.now(),
      planType: subscription.planType,
      storageLimit: subscription.storageLimit,
      expiresAt: subscription.expiresAt,
    };
  },
});

// Получение использования хранилища
export const getStorageUsage = query({
  args: { orgId: v.string() },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Вы должны войти в систему");
    }

    // Получение всех файлов организации
    const files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();

    // Подсчет общего размера в мегабайтах
    const totalSizeBytes = files.reduce(
      (total, file) => total + (file.size || 0),
      0
    );
    const totalSizeMB = totalSizeBytes / (1024 * 1024);

    // Получение текущей подписки
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .first();

    const storageLimit = subscription?.storageLimit || PLANS.free.storage;

    return {
      used: Math.round(totalSizeMB * 100) / 100,
      limit: storageLimit,
      percentage: Math.min(100, Math.round((totalSizeMB / storageLimit) * 100)),
    };
  },
});
