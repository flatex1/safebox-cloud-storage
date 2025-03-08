"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const pricingItems = [
    {
        plan: "Бесплатный",
        price: {
            monthly: 0,
            yearly: 0,
        },
        includes: "Что включено:",
        features: [
            "1 ГБ облачного хранилища",
            "До 3 команд",
            "До 700 загрузок в месяц",
            "Обновление файлов в реальном времени",
        ],
        cta: "Начать бесплатно",
    },
    {
        plan: "Про",
        price: {
            monthly: 990,
            yearly: 790,
        },
        includes: "Всё из Бесплатного, плюс:",
        features: [
            "50 ГБ облачного хранилища",
            "Неограниченное количество команд",
            "До 10000 загрузок в месяц",
            "Расширенная статистика",
            "Приоритетная поддержка",
        ],
        cta: "Подключить",
    },
    {
        plan: "Бизнес",
        price: {
            monthly: 1990,
            yearly: 1590,
        },
        includes: "Всё из Про, плюс:",
        features: [
            "200 ГБ облачного хранилища",
            "Персональный менеджер",
            "Неограниченные загрузки",
            "API доступ",
            "Расширенные настройки безопасности",
        ],
        cta: "Подключить",
    },
];

export function Pricing() {
    const [annualBilling, setAnnualBilling] = useState(true);
    const period = useMemo(
        () => (annualBilling ? "yearly" : "monthly"),
        [annualBilling]
    );

    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <div id="pricing" className="py-28">
            

            <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
                <div className="max-w-xl mx-auto text-center">
                    <p className="text-2xl font-bold md:text-3xl">
                        Гибкие тарифы для любого этапа развития вашего бизнеса
                    </p>
                    <p className="text-foreground/60 mt-6 md:text-lg">
                        Получите необходимые функции сегодня с возможностью обновления по мере роста вашего бизнеса.
                    </p>
                </div>

                <div className="relative mx-auto mt-12 flex max-w-fit items-center space-x-2">
                    <p className="text-foreground/60 font-medium">Помесячно</p>
                    <Switch checked={annualBilling} onCheckedChange={setAnnualBilling} />
                    <p className="text-foreground/60 font-medium">Годовой</p>
                    <Badge className="rounded-full border-foreground" variant="outline">
                        20% скидка
                    </Badge>
                </div>

                {/* desktop view */}
                <div className="hidden grid-cols-3 gap-6 mt-10 lg:grid">
                    {pricingItems.map((item) => (
                        <PricingCard key={item.plan} item={item} period={period} />
                    ))}
                </div>

                {/* mobile view */}
                <div className="mt-10 lg:hidden">
                    <Carousel
                        setApi={setApi}
                        opts={{
                            startIndex: 1,
                        }}
                    >
                        <CarouselContent>
                            {pricingItems.map((item) => (
                                <CarouselItem
                                    key={item.plan}
                                    className="basis-[min(90vw,400px)]"
                                >
                                    <PricingCard item={item} period={period} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    <div className="mt-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                            {pricingItems.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${index === current ? "bg-primary" : "bg-primary/30"
                                        }`}
                                    onClick={() => api?.scrollTo(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-1 text-center mt-6 w-fit mx-auto lg:mt-12">
                    <p className="text-sm text-foreground/50">
                        Все платежи обрабатываются и защищены{" "}
                        <span className="font-semibold text-foreground">
                            <Link target="_blank" href="https://stripe.com/">
                                Stripe
                            </Link>
                        </span>
                    </p>
                    <p className="text-sm text-foreground/50">
                        Цены указаны в рублях. НДС включен.
                    </p>
                </div>
            </div>
        </div>
    );
}

function PricingCard({ item, period }: { item: { plan: string; includes: string; price: { [key: string]: number }; features: string[]; cta: string }; period: string }) {
    const { plan, includes, price, features, cta } = item;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: plan === "Про" ? 0.2 : plan === "Бизнес" ? 0.4 : 0 }}
            key={plan}
            className={cn(
                "relative h-full flex flex-col border border-slate-300 rounded-xl p-8",
                plan === "Про" && "border-foreground border-2"
            )}
        >
            <p className="text-xl font-medium mb-3.5">{plan}</p>

            <div className="flex items-center gap-x-1">
                <h5 className="text-4xl font-semibold">{price[period]} ₽</h5>
            </div>
            {plan === "Бесплатный" ? (
                <p className="text-sm text-foreground/60 font-medium">бесплатно навсегда</p>
            ) : (
                <p className="text-sm text-foreground/60 font-medium">
                    в {period === "yearly" ? "месяц при оплате за год" : "месяц"}
                </p>
            )}
            <p className="text-sm font-medium mt-6">{includes}</p>
            <ul className="text-sm text-foreground/60 mt-3 mb-10 space-y-3">
                {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                        <Check className="w-5 h-6 flex-none text-foreground" />
                        {feature}
                    </li>
                ))}
            </ul>

            <div className="flex grow items-end py-4">
                {plan === "Про" ? (
                    <Button className="w-full h-10">{cta}</Button>
                ) : (
                    <Button className="w-full h-10" variant="outline">
                        {cta}
                    </Button>
                )}
            </div>
        </motion.div>
    );
}

