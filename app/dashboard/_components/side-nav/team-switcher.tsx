"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Settings2, SquareUser, Undo2 } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { useAuth, useOrganizationList } from "@clerk/nextjs"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export function TeamSwitcher() {
  const { isMobile } = useSidebar();

  const { userMemberships, isLoaded, setActive } = useOrganizationList({
    userMemberships: {
      infinite: true
    }
  });

  const { orgId } = useAuth();

  const activeTeam = userMemberships?.data?.find((org) => org.organization.id === orgId);

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2 p-2">
        <Skeleton className="w-[35px] h-[35px] rounded-md" />
        <div className="flex flex-col gap-2">
          <Skeleton className="w-[130px] h-[12px] rounded-full" />
          <Skeleton className="w-[100px] h-[10px] rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">

                {activeTeam ? (
                  <Image className="rounded-md" src={activeTeam?.organization.imageUrl ?? "/"} alt={activeTeam?.organization.name ?? "Логотип команды"} width={35} height={35} />
                )
                  :
                  <SquareUser width={30} height={30} />
                }
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam?.organization.name ?? "Личный профиль"}
                </span>
                <span className="truncate text-xs">
                  {activeTeam?.role === "org:admin" ? "Администратор" : "Участник"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Команды
            </DropdownMenuLabel>
            {userMemberships.data?.map((team, index) => (

              <DropdownMenuItem
                key={team.organization.name}
                onClick={() => setActive({ organization: team.organization.id })}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Image src={team.organization.imageUrl} alt={team.organization.name} width={35} height={35} className="size-4 shrink-0" />
                </div>
                {team.organization.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            {activeTeam ? (
              <>
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onClick={() => setActive({ organization: null })}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Undo2 className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">Личный профиль</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 p-2"
                >
                  <Link href="/dashboard/settings?tab=teams" className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <Settings2 className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">Управлять командами</div>
                  </Link>
                </DropdownMenuItem>
              </>
            )
              :
              <DropdownMenuItem className="gap-2 p-2">
                <Link href="/dashboard/settings?tab=teams" className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">Добавить команду</div>
                </Link>
              </DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}