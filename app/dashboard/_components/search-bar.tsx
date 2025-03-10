"use client";

import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormControl, FormMessage, Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, SearchIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    query: z.string().min(0).max(200),
})

export function SearchBar({
    query,
    setQuery,
}: {
    query: string,
    setQuery: (value: string) => void;
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: query || "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
         setQuery(values.query);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-center">
                <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                        <FormItem className="m-0">
                            <FormControl>
                                <Input 
                                    placeholder="Поиск файлов..." 
                                    {...field} 
                                    className="w-[180px] md:w-[220px]" 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    size="icon"
                    type="submit"
                    variant="outline"
                    disabled={form.formState.isSubmitting}
                    className="flex gap-1"
                >
                    {form.formState.isSubmitting && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    <SearchIcon className="h-4 w-4" />
                </Button>
            </form>
        </Form>
    );
}