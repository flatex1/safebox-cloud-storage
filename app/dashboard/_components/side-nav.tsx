'use client'

import * as React from "react";
import { FileIcon, Frame, MoreHorizontal, StarIcon, TrashIcon, DockIcon, Settings } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarRail, SidebarGroupLabel, SidebarGroup } from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";

const storageItems = [
  { title: "Все файлы", href: "/dashboard/files", icon: FileIcon },
  { title: "Избранное", href: "/dashboard/favorites", icon: StarIcon },
  { title: "Корзина", href: "/dashboard/trash", icon: TrashIcon },
];

const serviceItems = [
  { title: "Главная страница", href: "/", icon: Frame },
  { title: "Тарифы", href: "/pricing", icon: DockIcon },
  { title: "Настройки", href: "/settings", icon: Settings },
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
          <SidebarGroupLabel>Хранилище</SidebarGroupLabel>
          <SidebarMenu>
            {storageItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    className={clsx("flex gap-2", {
                      "text-blue-500": pathname.includes(item.href),
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
                  <SidebarMenuButton className="flex gap-2">
                    <item.icon className="size-4" />
                    {item.title}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground/70">
                <MoreHorizontal className="text-sidebar-foreground/70" />
                <span>More</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
