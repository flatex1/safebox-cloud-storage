import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup } from '@/components/ui/radio-group'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import React from 'react'
import ThemeOption from './theme-option'
import ToggleOption from './toggle-option'

const AppearanceSettings: React.FC = () => {
    const { theme, setTheme } = useTheme()
    
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Внешний вид</CardTitle>
                <CardDescription>
                    Настройте внешний вид приложения и выберите предпочитаемую тему
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Тема</h3>
                    <RadioGroup
                        defaultValue={theme}
                        onValueChange={setTheme}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <ThemeOption value="light" icon={Sun} label="Светлая" />
                        <ThemeOption value="dark" icon={Moon} label="Темная" />
                        <ThemeOption value="system" icon={Monitor} label="Системная" />
                    </RadioGroup>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Интерфейс</h3>
                    <div className="space-y-2">
                        <ToggleOption id="reduced-motion" label="Уменьшение анимаций" />
                        <ToggleOption id="reduce-transparency" label="Уменьшение прозрачности" />
                        <ToggleOption id="use-compact" label="Компактный режим" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default AppearanceSettings