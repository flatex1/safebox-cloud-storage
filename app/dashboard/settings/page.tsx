'use client'

import * as React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useSearchParams } from "next/navigation"
import SettingsSidebar from "../_components/settings/settings-sidebar"
import AppearanceSettings from "../_components/settings/appearance-settings"
import NotificationSettings from "../_components/settings/notification-settings"
import DevelopmentSettings from "../_components/settings/development-settings"
import TeamSettings from "../_components/settings/team-settings"
import { Suspense } from "react"

const SettingsPageContent = () => {
    const searchParams = useSearchParams()
    const initialTab = searchParams.get("tab") || "appearance"
    const [activeTab, setActiveTab] = React.useState<string>(initialTab)

    const contentMap = React.useMemo<{
        [key: string]: React.ReactNode;
    }>(() => ({
        appearance: <AppearanceSettings />,
        notifications: <NotificationSettings />,
        teams: <TeamSettings />
    }), [])

    return (
        <div className="flex w-full flex-row md:flex-col transition-[width,height] ease-linear px-4 gap-6">
            <div className="mb-4 w-full md:w-64">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Настройки</h1>
            </div>

            <main className="flex h-auto overflow-hidden">
                <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
                    {contentMap[activeTab] || <DevelopmentSettings tabId={activeTab} />}
                </div>
            </main>
        </div>
    )
}

const SettingsPage = () => {
    return (
        <SidebarProvider className="items-start">
            <Suspense fallback={<div>Загрузка...</div>}>
                <SettingsPageContent />
            </Suspense>
        </SidebarProvider>
    )
}

export default SettingsPage