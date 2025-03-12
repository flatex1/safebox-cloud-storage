"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface WindowWithMSStream extends Window {
  MSStream?: unknown;
}

export function InstallPWAButton() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as WindowWithMSStream).MSStream
    );

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`Пользователь ${outcome === 'accepted' ? 'принял' : 'отклонил'} установку`);
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isInstallable && (
        <Button onClick={handleInstallClick} className="bg-blue-500 hover:bg-blue-600">
          Установить приложение
        </Button>
      )}
      
      {isIOS && !isInstallable && (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg max-w-xs">
          <p className="text-sm">
            Чтобы установить это приложение на ваше устройство iOS, нажмите на кнопку &quot;Поделиться&quot;
            <span role="img" aria-label="share icon"> ⎋ </span>
            и выберите &quot;На экран &quot;Домой&quot;&quot;
            <span role="img" aria-label="plus icon"> ➕ </span>.
          </p>
        </div>
      )}
    </div>
  );
}