"use client";

import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";
import Image from 'next/image'
import { GridIcon, Loader2, Rows3Icon } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useState } from "react";
import { DataTable } from "./file-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Doc } from "@/convex/_generated/dataModel";
import { Label } from "@radix-ui/react-label";


function Placeholder() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div className="flex flex-col items-center justify-center min-h-[50vh] col-span-full gap-4">
        <Image
          alt="изображение девушки, загружающей файлы в облако"
          width={350}
          height={350}
          src="/empty.svg"
        />
        <p className="text-center text-gray-500">
          У вас нет загруженных файлов
        </p>
        <UploadButton />
      </div>
    </div>
  );
}

function PlaceholderEmptyQuery() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div className="flex flex-col items-center justify-center min-h-[60vh] col-span-full gap-4">
        <Image
          alt="изображение девушки, загружающей файлы в облако"
          width={350}
          height={350}
          src="/not-found.svg"
        />
        <p className="text-center text-gray-500">
          Мы не нашли подходящих файлов
        </p>
      </div>
    </div>
  );
}

export default function FileBrowser({
  title,
  favoritesOnly,
  deletedOnly,
}: {
  title: string,
  favoritesOnly?: boolean,
  deletedOnly?: boolean,
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const favorites = useQuery(api.files.getAllFavorites, orgId ? { orgId } : "skip");
  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, type: type === "all" ? undefined : type, query, favorites: favoritesOnly, deletedOnly: deletedOnly } : "skip");
  const isLoading = files === undefined;

  const modifiedFiles = files?.map((file) => ({
    ...file,
    isFavorited: (favorites ?? []).some((favorite) => favorite.fileId === file._id),
  })) ?? [];

  return (
    <div className="w-full">
      {isLoading && (
        <div className="flex flex-col justify-center items-center min-h-[50vh] gap-6">
          <Loader2 className="h-28 w-28 animate-spin text-gray-700" />
          <p className="text-xl">Загружаем ваше хранилище...</p>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold ">{title}</h1>
            <SearchBar query={query} setQuery={setQuery} />
            <UploadButton />
          </div>


          <Tabs defaultValue="Блоки">
            <div className="flex justify-between items-center">
              <TabsList className="mb-4">
                <TabsTrigger value="Блоки" className="flex gap-1 items-center">
                  <GridIcon className="h-4 w-4" />
                  Блоки
                </TabsTrigger>
                <TabsTrigger value="Сетка" className="flex gap-1 items-center">
                  <Rows3Icon className="h-4 w-4" />
                  Сетка
                </TabsTrigger>
              </TabsList>
              <div className="flex gap-2 items-center text-sm">
                <Label htmlFor="type-select">Фильтр по типам</Label>
                <Select value={type} onValueChange={(newType) => {
                setType(newType as Doc<"files">["type"]);
              }}>
                <SelectTrigger id="type-select" className="w-[150px]">
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
            {!isLoading && files.length > 0 && (
              <>
                <TabsContent value="Блоки">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {modifiedFiles?.map((file) => {
                      return <FileCard key={file._id} file={file} />
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="Сетка">
                  <DataTable columns={columns} data={modifiedFiles} />
                </TabsContent>
              </>
            )}
          </Tabs>

        </>
      )}

      {!isLoading && query && files.length === 0 && <PlaceholderEmptyQuery />}

      {!isLoading && !query && files.length === 0 && <Placeholder />}
    </div>
  );
}