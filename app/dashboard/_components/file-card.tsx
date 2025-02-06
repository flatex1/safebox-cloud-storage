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
import { FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react";
import { ReactNode } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Image from 'next/image'
import { FileCardActions } from "./file-actions"

export function FileCard({ file }: { file: Doc<"files"> & { isFavorited: boolean } }) {
    const typeIcons: Record<Doc<"files">["type"], ReactNode> = {
        "image": <ImageIcon />,
        "pdf": <FileTextIcon />,
        "csv": <GanttChartIcon />,
    };

    const userProfile = useQuery(api.users.getUserProfile, {
        userId: file.userId,
    });

    const fileUrl = useQuery(api.files.getFileUrl, { fileId: file.fileId });

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2 items-center text-base font-normal">
                    <div className="text-center">{typeIcons[file.type]}</div>
                    {file.name}
                </CardTitle>
                <div className="absolute top-3 right-2">
                    <FileCardActions isFavorited={file.isFavorited} file={file} />
                </div>
                <CardDescription>
                    {file.type}
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center">
                {
                    file.type === "image" && fileUrl && (
                        <Image
                            src={fileUrl}
                            width={100}
                            height={100}
                            alt={file.name}
                        />
                    )
                }

                {file.type === "csv" && <GanttChartIcon className="w-20 h-20" />}
                {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
            </CardContent>
            <CardFooter className="flex items-center gap-2 text-xs text-gray-700">         
                <Avatar className="w-6 h-6">
                    <AvatarImage src={userProfile?.image} />
                    <AvatarFallback>EX</AvatarFallback>
                </Avatar>
                {userProfile?.name + " "}
                {formatRelative(new Date(file._creationTime), new Date(), {locale: ru })}
            </CardFooter>
        </Card>
    )
}