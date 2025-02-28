import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { CreateOrganization } from '../side-nav/create-organization'
import { OrganizationProfile } from '@clerk/nextjs'

const TeamSettings: React.FC = () => (
    <Card className="w-full">
        <CardHeader>
            <CardTitle>Команды</CardTitle>
            <CardDescription>
                Создавайте и управляйте командами
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <CreateOrganization />
            <OrganizationProfile routing="hash" />
        </CardContent>
    </Card>
)

export default TeamSettings