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

import { DownloadIcon, FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, StarHalf, StarIcon, TrashIcon, UndoIcon } from "lucide-react";
import { ReactNode, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useToast } from "@/hooks/use-toast"
import Image from 'next/image'
import { Protect } from "@clerk/nextjs"


function FileCardActions({ file, isFavorited }: { file: Doc<"files">, isFavorited: boolean }) {
    const toggleFavorite = useMutation(api.files.toggleFavorite);
    const deleteFile = useMutation(api.files.deleteFile);
    const restoreFile = useMutation(api.files.restoreFile);
    const fileUrl = useQuery(api.files.getFileUrl, { fileId: file.fileId });
    const { toast } = useToast();

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    return (
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Это действие пометит этот файл для удаления. Файлы удаляются навсегда раз в 30 дней.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                await deleteFile({ fileId: file._id });
                                toast({
                                    variant: "default",
                                    title: "Файл перемещен в корзину.",
                                    description: "Файл будет удален через 30 дней.",
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
                        onClick={() => { toggleFavorite({ fileId: file._id }) }}
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
                    <DropdownMenuItem onClick={() => {
                        window.open(fileUrl, "_blank");
                    }}>
                        <DownloadIcon
                            className="w-4 h-4" /> Скачать
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
                            onClick={() => {
                                if (file.shouldDelete) {
                                    restoreFile({ fileId: file._id });
                                } else {
                                    setIsConfirmOpen(true);
                                }
                            }}
                            className="cursor-pointer"
                        >
                            {file.shouldDelete ? (
                                <div className="flex items-center gap-1 text-green-600">
                                    <UndoIcon className="w-4 h-4" /> Восстановить
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-red-600">
                                    <TrashIcon className="w-4 h-4" /> Удалить
                                </div>
                            )}
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

    const userProfile = useQuery(api.users.getUserProfile, {
        userId: file.userId,
    });

    const fileUrl = useQuery(api.files.getFileUrl, { fileId: file.fileId });

    const isFavorited = favorites.some((favorite) => favorite.fileId === file._id);

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2 items-center text-base font-normal">
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