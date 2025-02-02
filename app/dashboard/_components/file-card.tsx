import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc } from "@/convex/_generated/dataModel"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, StarHalf, StarIcon, TrashIcon } from "lucide-react";
import { ReactNode, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useToast } from "@/hooks/use-toast"
import Image from 'next/image'
import { Protect } from "@clerk/nextjs"


function FileCardActions({ file, isFavorited }: { file: Doc<"files">, isFavorited: boolean }) {
    const toggleFavorite = useMutation(api.files.toggleFavorite);
    const deleteFile = useMutation(api.files.deleteFile);
    const { toast } = useToast();

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    return (
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Это действие нельзя отменить. Это навсегда удалит ваш файл с наших серверов.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                await deleteFile({ fileId: file._id });
                                toast({
                                    variant: "default",
                                    title: "Успешно",
                                    description: "Файл успешно удалён.",
                                });
                            }}>
                            Да, удалить
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            <DropdownMenu>
                <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
                <DropdownMenuContent>
                <DropdownMenuItem
                        onClick={() => {toggleFavorite({ fileId: file._id })}}
                        className="flex gap-1 text-yellow-600 items-center text-center cursor-pointer"
                    >
                        {isFavorited ? (
                            <>
                                <StarIcon className="w-4 h-4" />
                                Убрать из избранного
                            </>
                        ) : (
                            <>
                                <StarHalf className="w-4 h-4" />
                                Добавить в избранное
                            </>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <Protect
                        role="org:admin"
                        fallback={
                           <DropdownMenuItem disabled title="Только администраторы организации могут удалять файлы">
                                <TrashIcon className="w-4 h-4" /> Удалить
                            </DropdownMenuItem>
                        }
                    >
                    <DropdownMenuItem
                        onClick={() => setIsConfirmOpen(true)}
                        className="flex gap-1 text-red-600 items-center text-center cursor-pointer"
                    >
                        <TrashIcon className="w-4 h-4" /> Удалить
                    </DropdownMenuItem>
                    </Protect>                   
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

export function FileCard({ file, favorites }: { file: Doc<"files">, favorites: Doc<"favorites">[] }) {
    const typeIcons: Record<Doc<"files">["type"], ReactNode> = {
        "image": <ImageIcon />,
        "pdf": <FileTextIcon />,
        "csv": <GanttChartIcon />,
    };

    const fileUrl = useQuery(api.files.getFileUrl, { fileId: file.fileId });

    const isFavorited = favorites.some((favorite) => favorite.fileId === file._id);
    
    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2 items-center">
                    <div className="text-center">{typeIcons[file.type]}</div>
                    {file.name}
                </CardTitle>
                <div className="absolute top-3 right-2">
                    <FileCardActions isFavorited={isFavorited} file={file} />
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
            <CardFooter>
                <Button onClick={() => {
                    window.open(fileUrl, "_blank");
                }}>Скачать</Button>
            </CardFooter>
        </Card>
    )
}