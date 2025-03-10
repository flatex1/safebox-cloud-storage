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
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background sticky top-0 z-10">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-6" />
      
      <div className="flex items-center justify-between w-full">
        <div className="flex-grow mr-4">
          <h2 className="text-lg font-medium">{title}</h2>
          {folderPath.length > 0 && (
            <Breadcrumb className="text-sm">
              <BreadcrumbList>
                {folderPath.map((folder, index) => (
                  <React.Fragment key={`path-${folder.id || "root"}-${index}`}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        onClick={() => navigateTo && navigateTo(index)}
                        className={`cursor-pointer ${
                          index === folderPath.length - 1 ? "font-semibold" : ""
                        }`}
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
        
        <div className="flex items-center gap-2">
          <SearchBar query={query} setQuery={setQuery} />
          <div className="flex gap-2">
            <CreateFolderButton currentFolderId={currentFolderId} />
            <UploadButton currentFolderId={currentFolderId} />
          </div>
        </div>
      </div>
    </header>
  );
}