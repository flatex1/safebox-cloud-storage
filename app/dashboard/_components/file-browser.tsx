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

function FileBrowserSkeleton() {
  return (
    <div className="w-full transition-[width,height] ease-linear">
      {/* Скелетон основного контента */}
      <div className="p-2 sm:p-4">
        {/* Вкладки и фильтр */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 md:mb-6">
          <Skeleton className="h-10 w-48" />

          <div className="flex gap-2 items-center w-full md:w-auto">
            <Skeleton className="h-5 w-24 md:w-32" /> {/* Текст "Фильтр по типам" */}
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
        {/* Кнопка "Назад", если мы в папке */}
        {currentFolderId && (
          <Button 
            variant="outline" 
            className="mb-2 md:mb-4 py-1.5 px-2.5 sm:py-2 sm:px-3 text-sm h-auto"
            onClick={navigateUp}
          >
            <ChevronLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Назад
          </Button>
        )}

        <Tabs defaultValue="Блоки">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <TabsList className="mb-3 md:mb-4 w-full md:w-auto h-auto py-1 px-1">
              <TabsTrigger value="Блоки" className="flex gap-1 items-center py-1.5 px-2.5 sm:py-2 sm:px-3 text-sm">
                <GridIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="ml-1">Блоки</span>
              </TabsTrigger>
              <TabsTrigger value="Сетка" className="flex gap-1 items-center py-1.5 px-2.5 sm:py-2 sm:px-3 text-sm">
                <Rows3Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="ml-1">Сетка</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2 items-center text-xs sm:text-sm w-full md:w-auto mb-3 md:mb-0">
              <Label htmlFor="type-select" className="whitespace-nowrap">Фильтр по типам</Label>
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
                <FileCard 
                  key={`file-${file._id}-${index}`} 
                  file={file}               
                />
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
