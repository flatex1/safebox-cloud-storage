'use client';

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GithubIcon, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Shield,
    MousePointerClick,
    Zap,
    Users,
} from "lucide-react";
import { Pricing } from "./_components/pricing";
import { SignUpButton } from "@clerk/nextjs";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";

const features = [
    {
        name: "Простота использования",
        description: "Интуитивно понятный интерфейс для всех пользователей",
        icon: MousePointerClick,
    },
    {
        name: "Безопасность данных",
        description:
            "Шифрование файлов и защита от несанкционированного доступа",
        icon: Shield,
    },
    {
        name: "Скорость и надёжность",
        description:
            "Мгновенный доступ к файлам в любой момент времени",
        icon: Zap,
    },
    {
        name: "Гибкий контроль",
        description:
            "Настройка прав доступа для каждого участника команды",
        icon: Users,
    },
];

export default function LandingPage() {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["надёжное", "удобное", "безопасное", "простое", "умное"],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (titleNumber === titles.length - 1) {
                setTitleNumber(0);
            } else {
                setTitleNumber(titleNumber + 1);
            }
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    return (
        <div className="w-full relative overflow-hidden">
            <div className="container mx-auto relative">
                <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col relative">
                    <DotPattern
                        className={cn(
                            "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
                            "absolute inset-0 -z-10"
                        )}
                    />
                    <div>
                        <Button variant="secondary" size="sm" className="gap-4">
                            Читать о запуске <MoveRight className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex gap-4 flex-col">
                        <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
                            <span className="text-spektr-cyan-50">SafeBox — это</span>
                            <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                                &nbsp;
                                {titles.map((title, index) => (
                                    <motion.span
                                        key={index}
                                        className="absolute font-semibold"
                                        initial={{ opacity: 0, y: "-100" }}
                                        transition={{ type: "spring", stiffness: 50 }}
                                        animate={
                                            titleNumber === index
                                                ? {
                                                    y: 0,
                                                    opacity: 1,
                                                }
                                                : {
                                                    y: titleNumber > index ? -150 : 150,
                                                    opacity: 0,
                                                }
                                        }
                                    >
                                        {title}
                                    </motion.span>
                                ))}
                            </span>
                            <span className="text-spektr-cyan-50">облачное хранилище</span>
                        </h1>

                        <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
                            SafeBox — это защищённое облачное хранилище для ваших файлов. Загружайте файлы, организуйте их в командах и делитесь ими с коллегами.
                            Войдите в систему с помощью Git или Google — быстро и безопасно.
                        </p>
                    </div>
                    <div className="flex flex-row gap-3">
                        <Button size="lg" className="gap-4" variant="outline">
                            Проект на GitHub <GithubIcon className="w-4 h-4" />
                        </Button>
                        <SignUpButton>
                            <Button size="lg" className="gap-4">
                                Зарегистрироваться <MoveRight className="w-4 h-4" />
                            </Button>
                        </SignUpButton>
                    </div>
                </div>


                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="py-28"
                >
                    <div className="max-w-screen-2xl mx-auto px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="max-w-xl mx-auto lg:text-center"
                        >
                            <p className="text-2xl font-bold md:text-3xl">
                                Управление файлами не должно быть сложным — мы всё сделали за вас.
                            </p>
                            <p className="text-foreground/60 mt-6 md:text-lg">
                                Получите все необходимые инструменты для эффективного управления файлами и работой в команде.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="max-w-2xl mx-auto mt-16 md:mt-20 lg:mt-24 lg:max-w-4xl"
                        >
                            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2 lg:gap-y-16">
                                {features.map((feature, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: 0.2 * (index + 3) }}
                                        key={feature.name}
                                        className="relative pl-16"
                                    >
                                        <div className="font-semibold">
                                            <div className="absolute left-0 top-0 flex w-9 h-9 items-center justify-center rounded-lg border-[1.5px] border-foreground">
                                                <feature.icon
                                                    aria-hidden="true"
                                                    className="h-5 w-5 stroke-[1.5px]"
                                                />
                                            </div>
                                            {feature.name}
                                        </div>
                                        <div className="text-foreground/60 mt-2">
                                            {feature.description}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <Pricing />

            </div>
        </div>
    )
};