"use client";

import confetti from "canvas-confetti";
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
  
  // Эффект для перенаправления на страницу файлов через 25 секунд
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/dashboard/files");
    }, 25000);
    
    return () => clearTimeout(timeout);
  }, [router]);
  
  // Эффект для запуска конфетти при успешной загрузке страницы
  useEffect(() => {
    if (subscription && !loading) {
      // Запускаем конфетти один раз
      const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
      const end = Date.now() + 2 * 1000;
      
      const shootConfetti = () => {
        if (Date.now() > end) return;
        
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors: colors,
        });
        
        requestAnimationFrame(shootConfetti);
      };
      
      shootConfetti();
    }
  }, [subscription, loading]);
  
  // Эффект для обновления состояния загрузки
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