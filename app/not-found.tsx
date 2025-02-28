'use client'

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Particles } from "@/components/magicui/particles";
import { PulsatingButton } from "@/components/magicui/pulsating-button";

export default function NotFound() {
    const { resolvedTheme } = useTheme();
    const [color, setColor] = useState("#ffffff");

    useEffect(() => {
        setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
    }, [resolvedTheme]);

    return (
        <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
            <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4 z-10">
                <h1 className="text-4xl font-bold">Упс!</h1>
                <h2 className="text-2xl font-semibold">Страница не найдена</h2>
                <p className="text-muted-foreground">
                    Страница которую вы ищете возможно была удалена или ее не существует.
                </p>
                <PulsatingButton>
                    <Link href="/">На главную страницу</Link>
                </PulsatingButton>
            </div>
            <Particles
                className="absolute inset-0"
                quantity={100}
                ease={80}
                color={color}
                refresh
            />
        </div>
    );
}