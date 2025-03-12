"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CreateFolderButton } from "./create-folder-button";
import { SearchBar } from "./search-bar";
import { UploadButton } from "./upload-button";
import { Id } from "@/convex/_generated/dataModel";
import React from "react";

interface FolderPathItem {
  id: Id<"folders"> | null | "root";
  name: string;
}

export function DashboardHeader({
  title,
  folderPath = [{ id: "root", name: "Мое хранилище" }],
  navigateTo,
  currentFolderId,
  query,
  setQuery,
}: {
  title: string;
  folderPath?: FolderPathItem[];
  navigateTo?: (index: number) => void;
  currentFolderId?: Id<"folders"> | null;
  query: string;
  setQuery: (query: string) => void;
}) {
  return (
    <header className="flex flex-col h-auto md:h-16 shrink-0 border-b px-2 sm:px-3 md:px-4 py-2 md:py-0 bg-background sticky top-0 z-10">
      <div className="flex items-center justify-between w-full md:hidden mb-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <SidebarTrigger className="-ml-1" style={{ transform: 'scale(1.2)' }}/>
          <h2 className="text-base sm:text-lg font-medium line-clamp-1">{title}</h2>
        </div>
      </div>

      <div className="hidden md:flex flex-row items-center justify-between w-full h-full">
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 h-6" />
          <div className="mr-4">
            <h2 className="text-lg font-medium line-clamp-1">{title}</h2>
            {folderPath.length > 0 && (
              <Breadcrumb className="text-sm mt-0.5">
                <BreadcrumbList className="flex flex-wrap">
                  {folderPath.map((folder, index) => (
                    <React.Fragment
                      key={`path-${folder.id || "root"}-${index}`}
                    >
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem className="min-w-0">
                        <BreadcrumbLink
                          onClick={() => navigateTo && navigateTo(index)}
                          className={`cursor-pointer truncate max-w-[200px] inline-block ${
                            index === folderPath.length - 1
                              ? "font-semibold"
                              : ""
                          }`}
                          title={folder.name}
                        >
                          {folder.name}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SearchBar
            query={query}
            setQuery={setQuery}
            showSearchButton={true}
          />
          <div className="flex gap-2">
            <CreateFolderButton currentFolderId={currentFolderId} />
            <UploadButton currentFolderId={currentFolderId} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:hidden">
        <SearchBar
          query={query}
          setQuery={setQuery}
          showSearchButton={false}
          placeholder="Поиск файлов..."
          onEnterPress={() => {
            /* TODO: функционал поиска по Enter */
          }}
          className="w-full"
        />
        <div className="flex gap-2 w-full">
          <CreateFolderButton currentFolderId={currentFolderId} />
          <UploadButton currentFolderId={currentFolderId} />
        </div>
      </div>
    </header>
  );
}
