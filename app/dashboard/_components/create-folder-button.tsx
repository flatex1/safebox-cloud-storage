"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { FolderPlus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Id } from "@/convex/_generated/dataModel";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Название папки обязательно")
    .max(100, "Название не должно превышать 100 символов"),
  description: z
    .string()
    .max(250, "Описание не должно превышать 250 символов")
    .optional(),
});

export function CreateFolderButton({
  currentFolderId,
}: {
  currentFolderId?: Id<"folders"> | null;
}) {
  const { toast } = useToast();
  const organization = useOrganization();
  const user = useUser();
  const createFolder = useMutation(api.folders.createFolder);
  const [isOpen, setIsOpen] = useState(false);

  const descriptionExamples = [
    "Документы для бухгалтерии",
    "Маркетинговые материалы Q2 2023",
    "Технические спецификации проекта",
    "Архив презентаций для клиентов",
  ];

  const randomExample =
    descriptionExamples[Math.floor(Math.random() * descriptionExamples.length)];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let orgId: string | undefined = undefined;
      if (organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id;
      }
      if (!orgId) {
        throw new Error("Не удалось определить организацию или пользователя");
      }

      await createFolder({
        name: values.name,
        description: values.description,
        orgId,
        parentId: currentFolderId || undefined,
      });

      toast({
        title: "Папка создана",
        description: `Папка "${values.name}" успешно создана`,
      });

      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать папку",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FolderPlus className="h-4 w-4" />
          <span className="hidden md:inline">Создать папку</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Создать новую папку</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название папки</FormLabel>
                  <FormControl>
                    <Input placeholder="Новая папка" {...field} autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание (необязательно)</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[80px]"
                      placeholder={randomExample}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Добавьте краткое описание содержимого папки
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center p-3 text-sm rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 flex-shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <span>Папка будет видна всем участникам вашей команды</span>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Создание..." : "Создать папку"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
