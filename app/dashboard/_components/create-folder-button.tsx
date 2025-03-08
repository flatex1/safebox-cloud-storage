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
import { useOrganization } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { FolderPlus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
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
});

export function CreateFolderButton({
  currentFolderId,
}: {
  currentFolderId?: Id<"folders"> | null;
}) {
  const { toast } = useToast();
  const organization = useOrganization();
  const createFolder = useMutation(api.folders.createFolder);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!organization.organization?.id) {
        throw new Error("Организация не выбрана");
      }

      await createFolder({
        name: values.name,
        orgId: organization.organization.id,
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
