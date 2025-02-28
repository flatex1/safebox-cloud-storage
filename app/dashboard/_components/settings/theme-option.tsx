import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { LucideIcon } from 'lucide-react';
import React from 'react'

const ThemeOption: React.FC<{
    value: string;
    icon: LucideIcon;
    label: string;
}> = ({ value, icon: Icon, label }) => (
    <div>
        <div className="flex items-center space-x-2">
            <RadioGroupItem value={value} id={value} />
            <Label htmlFor={value} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
            </Label>
        </div>
    </div>
)

export default ThemeOption