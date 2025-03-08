"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { organization } = useOrganization();
  const [loading, setLoading] = useState(true);
  
  // Получаем информацию о подписке
  const subscription = useQuery(
    api.payments.getSubscriptionStatus, 
    organization ? { orgId: organization.id } : "skip"
  );
  
  useEffect(() => {
    // Перенаправляем на дашборд через 5 секунд
    const timeout = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [router]);
  
  useEffect(() => {
    if (subscription) {
      setLoading(false);
    }
  }, [subscription]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <h1 className="text-2xl font-bold mt-6">Проверка платежа...</h1>
          <p className="text-muted-foreground mt-2">Это может занять некоторое время</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto mt-16 p-4">
      <Card>
        <CardHeader className="text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">Оплата успешна!</CardTitle>
          <CardDescription>
            Ваш тариф {subscription?.planType === "pro" ? "Про" : "Бизнес"} успешно активирован
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-center text-muted-foreground">
              Новый лимит хранилища: {subscription ? Math.round(subscription.storageLimit/1024) : 0} ГБ
            </p>
            <p className="text-center text-muted-foreground">
              Активен до: {subscription ? new Date(subscription.expiresAt ?? 0).toLocaleDateString() : ""}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => router.push("/dashboard")}
          >
            Перейти в панель управления
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}