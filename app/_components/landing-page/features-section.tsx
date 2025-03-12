'use client';

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
    Shield,
    MousePointerClick,
    Zap,
    Users,
} from "lucide-react";

export function FeaturesSection() {
    const features = useMemo(
        () => [
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
        ], []
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="py-28"
        >
            <div id="features" className="max-w-screen-2xl mx-auto px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-2xl mx-auto lg:text-center"
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
    );
}