import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormControl, FormMessage, Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, SearchIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Dispatch, SetStateAction } from "react"

const formSchema = z.object({
    query: z.string().min(0).max(200),
})

export function SearchBar({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    query,
    setQuery,
}: {
    query: string,
    setQuery: Dispatch<SetStateAction<string>>;
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
         setQuery(values.query);
    }


    return <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-center">
                <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="top2-arcwarden-rampage.mp4" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    size="sm"
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="flex gap-1"
                >
                    {form.formState.isSubmitting && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    <SearchIcon className="h-4 w-4" />
                    Поиск
                </Button>
            </form>
        </Form>
    </div>
}