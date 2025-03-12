"use client";

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WifiOff } from 'lucide-react';

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsOnline(navigator.onLine);

    function handleOnline() {
      setIsOnline(true);
      toast({
        title: "Соединение восстановлено",
        description: "Теперь вы снова онлайн",
      });
    }

    function handleOffline() {
      setIsOnline(false);
      toast({
        title: "Нет соединения",
        description: "Приложение работает в оффлайн-режиме",
        variant: "destructive",
      });
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-red-100 dark:bg-red-900 p-3 rounded-lg shadow-lg flex items-center gap-2">
      <WifiOff className="h-5 w-5 text-red-600 dark:text-red-400" />
      <span className="text-sm text-red-700 dark:text-red-300">Оффлайн режим</span>
    </div>
  );
}