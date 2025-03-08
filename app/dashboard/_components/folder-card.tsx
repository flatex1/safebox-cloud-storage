"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { FolderIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";

export function FolderCard({ 
  folder, 
  onClick 
}: { 
  folder: Doc<"folders">; 
  onClick: () => void 
}) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow" 
      onClick={onClick}
    >
      <CardContent className="p-4 flex flex-col items-center justify-center h-full">
        <FolderIcon className="h-20 w-20 text-yellow-500 mb-2" />
        <div className="mt-2 text-center">
          <h3 className="font-semibold truncate max-w-[150px]">{folder.name}</h3>
          <p className="text-xs text-gray-500">
            {format(new Date(folder._creationTime), 'dd MMM yyyy', { locale: ru })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
