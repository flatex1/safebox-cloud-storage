import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, Sidebar } from '@/components/ui/sidebar';
import { Bell, Globe, Keyboard, Link, LucideIcon, Paintbrush, Settings, Lock, Users } from 'lucide-react';
import React from 'react'

export const NAVIGATION_ITEMS: Array<{
    name: string;
    icon: LucideIcon;
    id: string;
}> = [
    { name: "Уведомления", icon: Bell, id: "notifications" },
    { name: "Команды", icon: Users, id: "teams" },
    { name: "Внешний вид", icon: Paintbrush, id: "appearance" },
    { name: "Язык и регион", icon: Globe, id: "language" },
    { name: "Доступность", icon: Keyboard, id: "accessibility" },
    { name: "Подключенные аккаунты", icon: Link, id: "accounts" },
    { name: "Приватность", icon: Lock, id: "privacy" },
    { name: "Дополнительно", icon: Settings, id: "advanced" },
]

const SettingsSidebar: React.FC<{
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}> = ({ activeTab, setActiveTab }) => (
    <Sidebar collapsible="none" className="rounded-lg bg-background border">
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {NAVIGATION_ITEMS.map((item) => (
                            <SidebarMenuItem key={item.id}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={item.id === activeTab}
                                    onClick={() => setActiveTab(item.id)}
                                >
                                    <a href={`?tab=${item.id}`} onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab(item.id);
                                        window.history.pushState({}, '', `?tab=${item.id}`);
                                    }}>
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
)

export default SettingsSidebar