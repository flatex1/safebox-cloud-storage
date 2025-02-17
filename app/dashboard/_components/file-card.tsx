import { formatRelative } from "date-fns"
import { ru } from 'date-fns/locale'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc } from "@/convex/_generated/dataModel"
import { FileTextIcon, GanttChartIcon, ImageIcon, PackageIcon } from "lucide-react";
import { ReactNode } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Image from 'next/image'
import { FileCardActions } from "./file-actions"

export function FileCard({ file }: { file: Doc<"files"> & { isFavorited: boolean } }) {
    const typeIcons: Record<Doc<"files">["type"], ReactNode> = {
        "image": <ImageIcon className="w-5 h-5" />,
        "pdf": <FileTextIcon className="w-5 h-5" />,
        "csv": <GanttChartIcon className="w-5 h-5" />,
        "archive": <PackageIcon className="w-5 h-5" />,
    };

    const userProfile = useQuery(api.users.getUserProfile, {
        userId: file.userId,
    });

    const fileUrl = useQuery(api.files.getFileUrl, { fileId: file.fileId });

    return (
        <Card className="hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="relative">
                <CardTitle className="flex gap-2 items-center text-base font-medium truncate">
                    <div className="text-center transition-transform group-hover:scale-110">
                        {typeIcons[file.type]}
                    </div>
                    <span className="truncate">{file.name}</span>
                </CardTitle>
                <div className="absolute top-3 right-2">
                    <FileCardActions isFavorited={file.isFavorited} file={file} />
                </div>
                <CardDescription className="text-sm text-gray-500 capitalize">
                    {file.type}
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] sm:h-[250px] md:h-[200px] flex items-center justify-center p-4 relative">
                {
                    file.type === "image" && fileUrl && (
                        <div className="absolute inset-0 w-full h-full">
                            <Image
                                src={fileUrl}
                                fill
                                className="object-cover"
                                alt={file.name}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
                        </div>
                    )
                }

                {file.type === "csv" && <GanttChartIcon className="w-20 h-20 opacity-60" />}
                {file.type === "pdf" && <FileTextIcon className="w-20 h-20 opacity-60" />}
                {file.type === "archive" && <PackageIcon className="w-20 h-20 opacity-60" />}
            </CardContent>
            <CardFooter className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 bg-opacity-50 py-3 px-6 relative z-10">         
                <Avatar className="w-6 h-6 ring-2 ring-white">
                    <AvatarImage src={userProfile?.image} />
                    <AvatarFallback className="bg-primary/10">{userProfile?.name?.substring(0, 2) || 'EX'}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{userProfile?.name}</span>
                <span className="text-gray-500 ml-auto">
                    {formatRelative(new Date(file._creationTime), new Date(), {locale: ru })}
                </span>
            </CardFooter>
        </Card>
    )
}