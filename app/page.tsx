"use client";

import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const files = useQuery(
    api.files.getFiles,
    organization.isLoaded && user.isLoaded && orgId ? { orgId } : "skip"
  );

  return (
      <main className="container mx-auto pt-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold ">Ваше хранилище</h1>
          <UploadButton />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> {/* Добавляем сетку для карточек файлов */}
          {files?.map((file) => (
            <FileCard key={file._id} file={file} />
          ))}
        </div>
      </main>
  );
}