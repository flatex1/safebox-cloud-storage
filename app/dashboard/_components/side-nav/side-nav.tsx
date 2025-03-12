"use client";

import * as React from "react";
import { LifeBuoy, Send } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarGroupLabel,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { StorageIndicator } from "../storage-indicator";
import { FileStackIcon, FileStackIconHandle } from "@/components/ui/file-stack";
import { HomeIcon, HomeIconHandle } from "@/components/ui/home";
import { DeleteIcon, DeleteIconHandle } from "@/components/ui/delete";
import {
  SettingsGearIcon,
  SettingsGearIconHandle,
} from "@/components/ui/settings-gear";
import {
  CircleDollarSignIcon,
  CircleDollarSignIconHandle,
} from "@/components/ui/circle-dollar-sign";
import { SparklesIcon, SparklesIconHandle } from "@/components/ui/sparkles";


export function SideNav() {
  const pathname = usePathname();

  const fileIconRef = React.useRef<FileStackIconHandle>(null);
  const favoriteIconRef = React.useRef<SparklesIconHandle>(null);
  const trashIconRef = React.useRef<DeleteIconHandle>(null);
  const homeIconRef = React.useRef<HomeIconHandle>(null);
  const pricingIconRef = React.useRef<CircleDollarSignIconHandle>(null);
  const settingsIconRef = React.useRef<SettingsGearIconHandle>(null);

  return (
    <Sidebar collapsible="icon">

      <SidebarHeader className="bg-white dark:bg-sidebar">
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent className="bg-white dark:bg-sidebar">
        {/* Раздел "Хранилище" */}
        <SidebarGroup>
          <StorageIndicator />

          <SidebarGroupLabel>Хранилище</SidebarGroupLabel>
          <SidebarMenu>
            {/* Все файлы */}
            <SidebarMenuItem>
              <Link href="/dashboard/files" className={clsx({
                  "text-blue-500 [&_*]:text-blue-500 [&_svg]:text-blue-500 [&_path]:text-blue-500": 
                    pathname.includes("files"),
                })}>
                <SidebarMenuButton
                  className="flex gap-2"
                  onMouseEnter={() => fileIconRef.current?.startAnimation()}
                  onMouseLeave={() => fileIconRef.current?.stopAnimation()}
                >
                  <FileStackIcon ref={fileIconRef} className="size-8" />
                  Все файлы
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            {/* Избранное */}
            <SidebarMenuItem>
              <Link href="/dashboard/favorites" className={clsx({
                  "text-blue-500 [&_*]:text-blue-500 [&_svg]:text-blue-500 [&_path]:text-blue-500": 
                    pathname.includes("favorites"),
                })}>
                <SidebarMenuButton
                  className={clsx("flex gap-2", {
                    "text-blue-500": pathname.includes("favorites"),
                  })}
                  onMouseEnter={() => favoriteIconRef.current?.startAnimation()}
                  onMouseLeave={() => favoriteIconRef.current?.stopAnimation()}
                >
                  <SparklesIcon ref={favoriteIconRef} className="size-8" />
                  Избранное
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            {/* Корзина */}
            <SidebarMenuItem>
              <Link href="/dashboard/trash" className={clsx({
                  "text-blue-500 [&_*]:text-blue-500 [&_svg]:text-blue-500 [&_path]:text-blue-500": 
                    pathname.includes("trash"),
                })}>
                <SidebarMenuButton
                  className="flex gap-2"
                  onMouseEnter={() => trashIconRef.current?.startAnimation()}
                  onMouseLeave={() => trashIconRef.current?.stopAnimation()}
                >
                  <DeleteIcon ref={trashIconRef} className="size-8" />
                  Корзина
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Раздел "Сервис" */}
        <SidebarGroup>
          <SidebarGroupLabel>Сервис</SidebarGroupLabel>
          <SidebarMenu>
            {/* Главная страница */}
            <SidebarMenuItem>
              <Link href="/" className={clsx({
                  "text-blue-500 [&_*]:text-blue-500 [&_svg]:text-blue-500 [&_path]:text-blue-500": 
                    pathname === "/",
                })}>
                <SidebarMenuButton
                  className="flex gap-2"
                  onMouseEnter={() => homeIconRef.current?.startAnimation()}
                  onMouseLeave={() => homeIconRef.current?.stopAnimation()}
                >
                  <HomeIcon ref={homeIconRef} className="size-8" />
                  Главная страница
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            {/* Тарифы */}
            <SidebarMenuItem>
              <Link href="/#pricing" className={clsx({
                  "text-blue-500 [&_*]:text-blue-500 [&_svg]:text-blue-500 [&_path]:text-blue-500": 
                    pathname.includes("#pricing"),
                })}>
                <SidebarMenuButton
                  className="flex gap-2"
                  onMouseEnter={() => pricingIconRef.current?.startAnimation()}
                  onMouseLeave={() => pricingIconRef.current?.stopAnimation()}
                >
                  <CircleDollarSignIcon
                    ref={pricingIconRef}
                    className="size-8"
                  />
                  Тарифы
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            {/* Настройки */}
            <SidebarMenuItem>
              <Link href="/dashboard/settings" className={clsx({
                  "text-blue-500 [&_*]:text-blue-500 [&_svg]:text-blue-500 [&_path]:text-blue-500": 
                    pathname.includes("settings"),
                })}>
                <SidebarMenuButton
                  className="flex gap-2"
                  onMouseEnter={() => settingsIconRef.current?.startAnimation()}
                  onMouseLeave={() => settingsIconRef.current?.stopAnimation()}
                >
                  <SettingsGearIcon ref={settingsIconRef} className="size-8" />
                  Настройки
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Поддержка */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="sm">
                  <Link href="/contact-us">
                    <LifeBuoy />
                    <span>Поддержка</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Обратная связь */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="sm">
                  <Link href="/">
                    <Send />
                    <span>Обратная связь</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-white dark:bg-sidebar">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
