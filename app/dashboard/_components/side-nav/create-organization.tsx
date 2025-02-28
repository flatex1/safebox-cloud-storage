'use client'

import { useOrganizationList } from '@clerk/nextjs'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2, Plus } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'

const formSchema = z.object({
    organizationName: z.string().min(1).max(100),
})

export function CreateOrganization() {
    const { isLoaded, createOrganization } = useOrganizationList()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            organizationName: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!isLoaded) return null

        try {
            await createOrganization({ name: values.organizationName, })

            form.reset();

            setIsOrganizationDialogOpen(false);
            toast({
                variant: "success",
                title: "Успешно",
                description: "Команда успешно создана",
            });
        } catch {
            toast({
                variant: "destructive",
                title: "Упс! Что-то пошло не так",
                description: "Не удалось создать команду, попробуйте позже.",
            });
        }
    }

    const [isOrganizationDialogOpen, setIsOrganizationDialogOpen] = useState(false)

    return (
        <Dialog open={isOrganizationDialogOpen} onOpenChange={(isOpen) => {
            setIsOrganizationDialogOpen(isOpen);
            form.reset();
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="justify-start gap-2"> 
                        <Plus className="size-4" />
                    <div className="font-medium text-muted-foreground">Добавить команду</div>
                </Button>      
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Добавление команды</DialogTitle>
                    <DialogDescription>
                        Добавление команды позволит вам совместно работать с другими людьми.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="organizationName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Название команды</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Энтузиасты" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className="flex gap-1"
                            >
                                {form.formState.isSubmitting && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                                Создать команду</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}