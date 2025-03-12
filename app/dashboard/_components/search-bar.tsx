"use client";

import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormControl, FormMessage, Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, SearchIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { KeyboardEvent } from "react"

const formSchema = z.object({
    query: z.string().min(0).max(200),
})

export function SearchBar({
    query,
    setQuery,
    showSearchButton = true,
    placeholder = "Поиск файлов...",
    onEnterPress,
    className,
}: {
    query: string,
    setQuery: (value: string) => void;
    showSearchButton?: boolean;
    placeholder?: string;
    onEnterPress?: () => void;
    className?: string;
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: query || "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setQuery(values.query);
        onEnterPress?.();
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !showSearchButton) {
            e.preventDefault();
            onEnterPress?.();
            setQuery(form.getValues().query);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={`flex gap-2 items-center ${className || ''}`}>
                <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                        <FormItem className="m-0 w-full">
                            <FormControl>
                                <Input 
                                    placeholder={placeholder}
                                    {...field} 
                                    className={`${showSearchButton ? 'w-[180px] md:w-[220px]' : 'w-full'}`}
                                    onKeyDown={handleKeyDown}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {showSearchButton && (
                    <Button
                        size="icon"
                        type="submit"
                        variant="outline"
                        disabled={form.formState.isSubmitting}
                        className="flex gap-1 shrink-0"
                    >
                        {form.formState.isSubmitting && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        <SearchIcon className="h-4 w-4" />
                    </Button>
                )}
            </form>
        </Form>
    );
}