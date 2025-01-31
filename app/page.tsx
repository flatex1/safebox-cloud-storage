"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMutation, useQuery } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Обязательное поле")
    .refine((files) => files.length > 0, "Обязательное поле"),
})


export default function Home() {

  const { toast } = useToast()
  const organization = useOrganization();
  const user = useUser();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  })

  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) return;

    const postUrl = await generateUploadUrl();

    const fileType = values.file[0].type;

    if (typeof postUrl === 'string') {
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": fileType },
        body: values.file[0],
      });

      const { storageId } = await result.json();

      try {
        await createFile({ name: values.title, fileId: storageId, orgId });

        form.reset();

        setIsFileDialogOpen(false);
        toast({
          variant: "success",
          title: "Успешно",
          description: "Теперь ваш файл виден всеми участниками организации, если вы состоите в ней.",
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Упс! Что-то пошло не так",
          description: "Не удалось загрузить файл, попробуйте позже.",
        });
      }
    }
  }

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  const createFile = useMutation(api.files.createFile);
  const files = useQuery(
    api.files.getFiles,
    organization.isLoaded && user.isLoaded && orgId ? { orgId } : "skip"
  );

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="container mx-auto pt-12">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Ваше хранилище</h1>

          <Dialog open={isFileDialogOpen} onOpenChange={(isOpen) => {
            setIsFileDialogOpen(isOpen);
            form.reset();
          }}
          >
            <DialogTrigger asChild>
              <Button onClick={async () => { }}>
                Загрузить файл
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-8">Загрузите сюда свой файл</DialogTitle>
                <DialogDescription>Этот файл будет виден всем в вашей организации</DialogDescription>
              </DialogHeader>
              <div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Заголовок</FormLabel>
                          <FormControl>
                            <Input placeholder="веселый-бегемотик" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="file"
                      render={() => (
                        <FormItem>
                          <FormLabel>Файл</FormLabel>
                          <FormControl>
                            <Input type="file" {...fileRef} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="flex gap-1"
                    >
                      {form.formState.isSubmitting && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                      Подтвердить
                    </Button>
                  </form>
                </Form>
              </div>

            </DialogContent>
          </Dialog>

        </div>

        {files?.map((file) => {
          return <div key={file._id}>{file.name}</div>
        })}
      </main>
    </div>
  );
}