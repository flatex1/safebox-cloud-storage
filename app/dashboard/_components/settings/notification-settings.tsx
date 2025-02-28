import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import ToggleOption from './toggle-option'

const NotificationSettings: React.FC = () => (
    <Card className="w-full">
        <CardHeader>
            <CardTitle>Уведомления</CardTitle>
            <CardDescription>
                Настройте параметры уведомлений
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <ToggleOption id="email-notifications" label="Email уведомления" defaultChecked={true} />
                <ToggleOption id="push-notifications" label="Push-уведомления" defaultChecked={true} />
                <ToggleOption id="marketing-emails" label="Маркетинговые письма" />
            </div>
        </CardContent>
    </Card>
)

export default NotificationSettings