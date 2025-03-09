"use client";

import { useMemo } from "react";
import Image from "next/image";
import { format, formatRelative } from "date-fns";
import { ru } from "date-fns/locale";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import {
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  PackageIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileCardActions } from "./file-actions";

const TYPE_ICONS = {
  image: <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
  pdf: <FileTextIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
  csv: <GanttChartIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
  text: <FileTextIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
  archive: <PackageIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
} as const;

const FilePreview = ({ type, name, fileUrl }: { type: Doc<"files">["type"], name: string, fileUrl?: string }) => {
  if (type === "image" && fileUrl) {
    return (
      <Image
        src={fileUrl}
        layout="fill"
        className="object-cover rounded-2xl p-2"
        alt={name}
      />
    );
  }
  
  return (
    <div className="opacity-60 w-12 h-12 sm:w-16 sm:h-16">
      {type === "csv" && <GanttChartIcon className="w-full h-full" />}
      {type === "pdf" && <FileTextIcon className="w-full h-full" />}
      {type === "text" && <FileTextIcon className="w-full h-full" />}
      {type === "archive" && <PackageIcon className="w-full h-full" />}
    </div>
  );
};

interface FileCardProps {
  file: Doc<"files"> & { isFavorited: boolean };
}

export function FileCard({ file }: FileCardProps) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

  const fileUrl = useQuery(api.files.getFileUrl, { 
    fileId: file.fileId 
  });

  const userInfo = useMemo(() => ({
    name: userProfile?.name || "Пользователь",
    initials: userProfile?.name?.substring(0, 2) || "SB",
    image: userProfile?.image,
  }), [userProfile]);

  const formattedDate = useMemo(() => 
    format(new Date(file._creationTime), "dd MMM yyyy", { locale: ru })
  , [file._creationTime]);

  const relativeDate = useMemo(() => 
    formatRelative(new Date(file._creationTime), new Date(), { locale: ru })
  , [file._creationTime]);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group w-full sm:max-w-xs">
      <CardHeader className="relative flex flex-row items-center justify-between p-3 sm:p-4">
        <div className="flex items-center gap-2 truncate">
          <div className="transition-transform group-hover:scale-110">
            {TYPE_ICONS[file.type]}
          </div>
          <span className="truncate max-w-[70%] text-sm sm:text-base">
            {file.name}
          </span>
        </div>
        <FileCardActions isFavorited={file.isFavorited} file={file} />
      </CardHeader>

      <CardContent className="relative flex items-center justify-center p-4 sm:p-6 min-h-[150px] overflow-hidden">
        <FilePreview type={file.type} name={file.name} fileUrl={fileUrl} />
      </CardContent>

      <CardFooter className="flex items-center justify-between text-xs sm:text-sm text-gray-700 bg-gray-50 py-2 px-3 sm:py-3 sm:px-4">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6 sm:w-8 sm:h-8 ring-2 ring-white">
            <AvatarImage src={userInfo.image} />
            <AvatarFallback className="bg-primary/10">
              {userInfo.initials}
            </AvatarFallback>
          </Avatar>
          <span className="truncate max-w-[80px] sm:max-w-[120px]">
            {userInfo.name}
          </span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className="text-gray-400 text-[10px] sm:text-xs ml-auto">
                {formattedDate}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {relativeDate}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}