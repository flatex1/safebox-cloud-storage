"use client";

import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { FileCard } from "./file-card";
import { DataTable } from "./file-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Label } from "@radix-ui/react-label";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, GridIcon, Rows3Icon } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FolderCard } from "./folder-card";
import React from "react";
import { DashboardHeader } from "./dashboard-header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useMutation } from "convex/react";
import { Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function FileBrowserSkeleton() {
  return (
    <div className="w-full transition-[width,height] ease-linear">
      {/* Скелетон основного контента */}
      <div className="p-2 sm:p-4">
        {/* Вкладки и фильтр */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 md:mb-6">
          <Skeleton className="h-10 w-48" />

          <div className="flex gap-2 items-center w-full md:w-auto">
            <Skeleton className="h-5 w-24 md:w-32" />{" "}
            {/* Текст "Фильтр по типам" */}
            <Skeleton className="h-10 w-full md:w-[150px]" /> {/* Селект */}
          </div>
        </div>

        {/* Карточки файлов */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-40 sm:h-52 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlaceholderEmptyQuery() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div className="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[60vh] col-span-full gap-4 px-4">
        <Image
          alt="изображение девушки, загружающей файлы в облако"
          width={250}
          height={250}
          src="/not-found.svg"
          className="w-[200px] sm:w-[250px] md:w-[350px]"
        />
        <p className="text-center text-gray-500 text-sm sm:text-base">
          Мы не нашли подходящих файлов
        </p>
      </div>
    </div>
  );
}

function Placeholder() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div className="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[50vh] col-span-full gap-4 px-4">
        <Image
          alt="изображение девушки, загружающей файлы в облако"
          width={250}
          height={250}
          src="/empty.svg"
          className="w-[200px] sm:w-[250px] md:w-[350px]"
        />
        <p className="text-center text-gray-500 text-sm sm:text-base">
          У вас нет загруженных файлов
        </p>
        {/* TODO: Исправить баг с добавлением id папки */}
        {/* <UploadButton /> */}
      </div>
    </div>
  );
}

export default function FileBrowser({
  title,
  favoritesOnly,
  deletedOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");
  const [currentFolderId, setCurrentFolderId] = useState<Id<"folders"> | null>(
    null
  );
  const [folderPath, setFolderPath] = useState<
    Array<{ id: Id<"folders"> | null; name: string }>
  >([{ id: null, name: "Главная" }]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [folderIdToDelete, setFolderIdToDelete] =
    useState<Id<"folders"> | null>(null);
  const { toast } = useToast();

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favorites = useQuery(
    api.favorites.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  const files = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          type: type === "all" ? undefined : type,
          query,
          favorites: favoritesOnly,
          deletedOnly: deletedOnly,
          folderId: currentFolderId || undefined,
        }
      : "skip"
  );

  const folders = useQuery(
    api.folders.getFolders,
    orgId && !deletedOnly
      ? { orgId, parentId: currentFolderId || undefined, query, favoritesOnly }
      : "skip"
  );

  const folderPathQuery = useQuery(
    api.folders.getFolderPath,
    currentFolderId ? { folderId: currentFolderId } : "skip"
  );

  const currentFolder = useQuery(
    api.folders.getFolder,
    currentFolderId ? { folderId: currentFolderId } : "skip"
  );

  const renameFolder = useMutation(api.folders.renameFolder);
  const deleteFolder = useMutation(api.folders.deleteFolder);

  const editFormSchema = z.object({
    name: z
      .string()
      .min(1, "Название обязательно")
      .max(100, "Не более 100 символов"),
    description: z.string().max(250, "Не более 250 символов").optional(),
  });
  const editForm = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: currentFolder?.name || "",
      description: currentFolder?.description || "",
    },
    values: currentFolder
      ? {
          name: currentFolder.name || "",
          description: currentFolder.description || "",
        }
      : undefined,
  });

  const handleEditSubmit = async (values: z.infer<typeof editFormSchema>) => {
    if (!currentFolderId) return;
    try {
      await renameFolder({
        folderId: currentFolderId,
        name: values.name,
        description: values.description,
      });
      toast({
        title: "Папка обновлена",
        description: "Название и описание успешно изменены",
      });
      setEditDialogOpen(false);
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить папку",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!folderIdToDelete) return;
    try {
      await deleteFolder({ folderId: folderIdToDelete, recursive: true });
      toast({
        title: "Папка удалена",
        description: "Папка и всё содержимое удалены",
      });
      setDeleteDialogOpen(false);
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить папку",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!currentFolderId) {
      setFolderPath([{ id: null, name: "Главная" }]);
      return;
    }

    if (folderPathQuery) {
      const formattedPath = folderPathQuery.map((folder) => ({
        id: folder._id,
        name: folder.name,
      }));
      formattedPath.unshift({ id: "" as Id<"folders">, name: "Главная" });
      setFolderPath(formattedPath);
    }
  }, [currentFolderId, folderPathQuery]);

  const isLoading =
    files === undefined || (folders === undefined && !deletedOnly);

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];

  const navigateUp = () => {
    if (folderPath.length > 1) {
      const parentIndex = folderPath.length - 2;
      setCurrentFolderId(folderPath[parentIndex].id);
    }
  };

  const navigateTo = (index: number) => {
    if (index < folderPath.length) {
      const newPath = folderPath.slice(0, index + 1);
      setFolderPath(newPath);
      setCurrentFolderId(newPath[newPath.length - 1].id);
    }
  };

  return (
    <div className="w-full">
      <DashboardHeader
        title={title}
        folderPath={folderPath}
        navigateTo={navigateTo}
        currentFolderId={currentFolderId}
        query={query}
        setQuery={setQuery}
      />

      {isLoading ? (
        <FileBrowserSkeleton />
      ) : (
        <div className="p-2 sm:p-4">
          {/* Кнопка "Назад", "Редактировать" и "Удалить папку" */}
          {currentFolderId && (
            <div className="flex items-center gap-2 mb-2 md:mb-4">
              <Button
                variant="outline"
                className="py-1.5 px-2.5 sm:py-2 sm:px-3 text-sm h-auto"
                onClick={navigateUp}
              >
                <ChevronLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Назад
              </Button>
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    title="Редактировать папку"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Редактировать папку</DialogTitle>
                  </DialogHeader>
                  <Form {...editForm}>
                    <form
                      onSubmit={editForm.handleSubmit(handleEditSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={editForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Название папки</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Новое название папки"
                                {...field}
                                autoFocus
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={editForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Описание (необязательно)</FormLabel>
                            <FormControl>
                              <textarea
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[80px]"
                                placeholder="Описание содержимого папки"
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
                        <span>
                          Папка будет видна всем участникам вашей команды
                        </span>
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={editForm.formState.isSubmitting}
                      >
                        {editForm.formState.isSubmitting
                          ? "Сохранение..."
                          : "Сохранить"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              <Button
                variant="destructive"
                size="icon"
                title="Удалить папку"
                onClick={() => {
                  setFolderIdToDelete(currentFolderId);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                  setDeleteDialogOpen(open);
                  if (!open) {
                    setCurrentFolderId(null);
                    setFolderIdToDelete(null);
                  }
                }}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Удалить папку?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Вы действительно хотите удалить эту папку?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex items-center p-3 my-2 text-sm rounded-md bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300">
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
                    <span className="font-semibold">
                      Все подпапки и файлы внутри будут удалены безвозвратно.
                    </span>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Удалить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          <Tabs defaultValue="Блоки">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <TabsList className="mb-3 md:mb-4 w-full md:w-auto h-auto py-1 px-1">
                <TabsTrigger
                  value="Блоки"
                  className="flex gap-1 items-center py-1.5 px-2.5 sm:py-2 sm:px-3 text-sm"
                >
                  <GridIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="ml-1">Блоки</span>
                </TabsTrigger>
                <TabsTrigger
                  value="Сетка"
                  className="flex gap-1 items-center py-1.5 px-2.5 sm:py-2 sm:px-3 text-sm"
                >
                  <Rows3Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="ml-1">Сетка</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2 items-center text-xs sm:text-sm w-full md:w-auto mb-3 md:mb-0">
                <Label htmlFor="type-select" className="whitespace-nowrap">
                  Фильтр по типам
                </Label>
                <Select
                  value={type}
                  onValueChange={(newType) =>
                    setType(newType as Doc<"files">["type"])
                  }
                >
                  <SelectTrigger
                    id="type-select"
                    className="w-full md:w-[150px] h-auto py-1.5 px-2.5 sm:py-2 sm:px-3 text-sm"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    <SelectItem value="image">Изображение</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="docx">Word (.docx)</SelectItem>
                    <SelectItem value="doc">Word (.doc)</SelectItem>
                    <SelectItem value="pptx">PowerPoint (.pptx)</SelectItem>
                    <SelectItem value="unknown">Прочее</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="Блоки">
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {!deletedOnly &&
                  folders?.map(
                    (folder, index) =>
                      folder && (
                        <FolderCard
                          key={`folder-${folder._id}-${index}`}
                          folder={folder}
                          onClick={() => setCurrentFolderId(folder._id)}
                        />
                      )
                  )}

                {modifiedFiles.map((file, index) => (
                  <FileCard key={`file-${file._id}-${index}`} file={file} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="Сетка">
              <div className="overflow-x-auto -mx-2 px-2">
                <DataTable columns={columns} data={modifiedFiles} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {!isLoading && query && files.length === 0 && folders?.length === 0 && (
        <PlaceholderEmptyQuery />
      )}

      {!isLoading && !query && files.length === 0 && folders?.length === 0 && (
        <Placeholder />
      )}
    </div>
  );
}
