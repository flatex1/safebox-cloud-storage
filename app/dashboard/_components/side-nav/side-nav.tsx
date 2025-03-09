"use client";

import * as React from "react";
import {
  FileIcon,
  StarIcon,
  TrashIcon,
  DockIcon,
  Settings,
  LifeBuoy,
  Send,
  House,
} from "lucide-react";
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

const storageItems = [
  { title: "Все файлы", href: "/dashboard/files", icon: FileIcon },
  { title: "Избранное", href: "/dashboard/favorites", icon: StarIcon },
  { title: "Корзина", href: "/dashboard/trash", icon: TrashIcon },
];

const serviceItems = [
  { title: "Главная страница", href: "/", icon: House },
  { title: "Тарифы", href: "/#pricing", icon: DockIcon },
  { title: "Настройки", href: "/dashboard/settings", icon: Settings },
];

const feedbackItems = [
  { title: "Поддержка", href: "/contact-us", icon: LifeBuoy },
  { title: "Обратная связь", href: "/", icon: Send },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        {/* Раздел "Хранилище" */}
        <SidebarGroup>
          <StorageIndicator />

          <SidebarGroupLabel>Хранилище</SidebarGroupLabel>
          <SidebarMenu>
            {storageItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    className={clsx("flex gap-2", {
                      "text-blue-500": pathname.includes(
                        item.href.split("/")[2]
                      ),
                    })}
                  >
                    <item.icon className="size-4" />
                    {item.title}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Раздел "Сервис" */}
        <SidebarGroup>
          <SidebarGroupLabel>Сервис</SidebarGroupLabel>
          <SidebarMenu>
            {serviceItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    className={clsx("flex gap-2", {
                      "text-blue-500": pathname.includes(
                        item.href.split("/")[2]
                      ),
                    })}
                  >
                    <item.icon className="size-4" />
                    {item.title}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {feedbackItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm">
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
