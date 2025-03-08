"use client";

import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Progress } from "@/components/ui/progress";

export function StorageIndicator() {
  const { organization } = useOrganization();
  
  const storageUsage = useQuery(api.payments.getStorageUsage, 
    organization ? { orgId: organization.id } : "skip"
  );
  
  const subscription = useQuery(api.payments.getSubscriptionStatus, 
    organization ? { orgId: organization.id } : "skip"
  );
  
  if (!storageUsage) {
    return null;
  }
  
  const usedMB = storageUsage.used;
  const limitMB = storageUsage.limit;
  const usedPercentage = storageUsage.percentage;
  
  // Преобразуем в более читаемый формат
  const formatStorage = (mb: number) => {
    if (mb >= 1000) {
      return `${(mb / 1000).toFixed(1)} ГБ`;
    }
    return `${Math.round(mb)} МБ`;
  };
  
  return (
    <div className="p-4 bg-background border rounded-lg">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Использование хранилища</span>
        <span className="text-sm text-muted-foreground">
          {formatStorage(usedMB)} из {formatStorage(limitMB)}
        </span>
      </div>
      <Progress value={usedPercentage} className="h-2" />
      {usedPercentage > 80 && (
        <p className="text-xs text-amber-500 mt-2">
          Ваше хранилище почти заполнено. Обновите тариф для получения большего пространства.
        </p>
      )}
      <div className="text-xs text-muted-foreground mt-2">
        Тариф: {subscription?.planType === "free" ? "Бесплатный" : 
                subscription?.planType === "pro" ? "Про" : "Бизнес"}
      </div>
    </div>
  );
}