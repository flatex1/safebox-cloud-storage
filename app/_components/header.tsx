'use client'

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";

export function Header() {
    const pathname = usePathname();
    const isDashboardPage = pathname.startsWith("/dashboard");

    const navigationItems = [
        {
            title: "Главная",
            href: "/",
            description: "Главная страница сайта",
        },
        {
            title: "Хранилище",
            description: "Безопасно хранит все ваши файлы.",
            items: [
                {
                    title: "Все файлы",
                    href: "/dashboard/files",
                },
                {
                    title: "Избранное",
                    href: "/dashboard/favorites",
                },
                {
                    title: "Корзина",
                    href: "/dashboard/trash",
                },
            ],
        },
    ];

    const [isOpen, setOpen] = useState(false);
    const [isStorageOpen, setStorageOpen] = useState(false);

    if (isDashboardPage) {
        return null;
    }

    return (
        <header className="w-full px-5 z-10 relative bg-transparent backdrop-blur-md">
            <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
                {/* Desktop Navigation */}
                <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
                    <NavigationMenu className="flex justify-start items-start">
                        <NavigationMenuList className="flex justify-start gap-4 flex-row">
                            {navigationItems.map((item) => (
                                <NavigationMenuItem key={item.title}>
                                    {item.href ? (
                                        <NavigationMenuLink>
                                            <Button variant="ghost">{item.title}</Button>
                                        </NavigationMenuLink>
                                    ) : (
                                        <>
                                            <NavigationMenuTrigger className="font-medium text-sm">
                                                {item.title}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent className="!w-[450px] p-4">
                                                <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                                                    <div className="flex flex-col h-full justify-between">
                                                        <p className="text-base">{item.title}</p>
                                                        <p className="text-muted-foreground text-sm">
                                                            {item.description}
                                                        </p>
                                                        <Button size="sm" className="mt-10">
                                                            <Link href="/dashboard/files">
                                                                Перейти в хранилище
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                    <div className="flex flex-col text-sm h-full justify-end">
                                                        {item.items?.map((subItem) => (
                                                            <NavigationMenuLink
                                                                href={subItem.href}
                                                                key={subItem.title}
                                                                className="flex flex-row justify-between items-center hover:bg-muted py-2 px-4 rounded"
                                                            >
                                                                <span>{subItem.title}</span>
                                                                <MoveRight className="w-4 h-4 text-muted-foreground" />
                                                            </NavigationMenuLink>
                                                        ))}
                                                    </div>
                                                </div>
                                            </NavigationMenuContent>
                                        </>
                                    )}
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Logo */}
                <div className="flex lg:justify-center">
                    <Link href="/" className="text-xl font-semibold safebox-text">SafeBox</Link>
                </div>

                {/* Auth Controls */}
                <div className="flex justify-end w-full gap-4">
                    <OrganizationSwitcher />
                    <UserButton />
                    <SignedOut>
                        <SignInButton>
                            <Button>Войти</Button>
                        </SignInButton>
                    </SignedOut>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex w-12 shrink lg:hidden items-end justify-end">
                    <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute w-[90%] border-t flex flex-col bg-background shadow-lg p-4 container gap-4 max-h-[calc(100vh-5rem)] overflow-y-auto transition-all">
                    {navigationItems.map((item) => (
                        <div key={item.title} className="px-4">
                            {item.href ? (
                                <Link href={item.href} className="flex justify-between items-center py-2">
                                    <span className="text-lg">{item.title}</span>
                                    <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                                </Link>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setStorageOpen(!isStorageOpen)}
                                        className="flex justify-between items-center w-full text-lg py-2"
                                    >
                                        {item.title}
                                        <MoveRight className={clsx("w-4 h-4 transition-transform", isStorageOpen && "rotate-90")} />
                                    </button>
                                    {isStorageOpen && (
                                        <div className="pl-4">
                                            {item.items?.map((subItem) => (
                                                <Link
                                                    key={subItem.title}
                                                    href={subItem.href}
                                                    className="flex justify-between items-center py-2 text-muted-foreground text-sm"
                                                >
                                                    <span>{subItem.title}</span>
                                                    <MoveRight className="w-4 h-4 stroke-1" />
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </header>
    );
}
