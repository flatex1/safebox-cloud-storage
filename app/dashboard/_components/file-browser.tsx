"use client";

import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";
import Image from 'next/image'
import { Loader2 } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useState } from "react";

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

export default function FileBrowser({ title, favoritesOnly }: { title: string, favoritesOnly?: boolean }) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const favorites = useQuery(api.files.getAllFavorites, orgId ? { orgId } : "skip");
  const files = useQuery(api.files.getFiles, orgId ? { orgId, query, favorites: favoritesOnly } : "skip");
  const isLoading = files === undefined;

  return (
    <div className="w-full">
      {isLoading && (
        <div className="flex flex-col justify-center items-center min-h-[50vh] gap-6">
          <Loader2 className="h-28 w-28 animate-spin text-gray-700" />
          <p className="text-xl">Загружаем ваше хранилище...</p>
        </div>
      )}

      {!isLoading && (
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold ">{title}</h1>
          <SearchBar query={query} setQuery={setQuery} />
          <UploadButton />
        </div>
      )}

      {!isLoading && query && files.length === 0 && <PlaceholderEmptyQuery />}

      {!isLoading && !query && files.length === 0 && <Placeholder />}

      {!isLoading && files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files?.map((file) => (
            <FileCard favorites={favorites ?? []} key={file._id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
}