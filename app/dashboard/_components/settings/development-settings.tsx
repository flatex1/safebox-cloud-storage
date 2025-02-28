import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'
import { NAVIGATION_ITEMS } from './settings-sidebar';

// Компонент для разделов в разработке
const DevelopmentSettings: React.FC<{
    tabId: string;
}> = ({ tabId }) => {
    const tabInfo = NAVIGATION_ITEMS.find(item => item.id === tabId)
    
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{tabInfo?.name || "Раздел"}</CardTitle>
                <CardDescription>
                    Этот раздел находится в разработке
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Содержимое для раздела &quot;{tabInfo?.name}&quot; будет добавлено позже.</p>
            </CardContent>
        </Card>
    )
}

export default DevelopmentSettings