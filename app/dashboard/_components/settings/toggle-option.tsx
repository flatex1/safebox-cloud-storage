import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import React from 'react'

const ToggleOption: React.FC<{
    id: string;
    label: string;
    defaultChecked?: boolean;
}> = ({ id, label, defaultChecked = false }) => (
    <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <Switch id={id} defaultChecked={defaultChecked} />
    </div>
)

export default ToggleOption