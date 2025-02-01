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
  
import {MoreVertical, TrashIcon } from "lucide-react";
import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useToast } from "@/hooks/use-toast"

  

function FileCardActions({ file }: { file: Doc<"files"> }) {
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
                            onClick={async() => {
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
                        onClick={() => setIsConfirmOpen(true)}
                        className="flex gap-1 text-red-600 items-center text-center cursor-pointer"
                    >
                        <TrashIcon className="w-4 h-4" /> Удалить
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

export function FileCard({ file }: { file: Doc<"files"> }) {
    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle >{file.name} </CardTitle>
                <div className="absolute top-3 right-2">
                    <FileCardActions file={file} />
                </div>
                <CardDescription>

                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* <p>{file.description}</p> */}
            </CardContent>
            <CardFooter>
                <Button>Скачать</Button>
            </CardFooter>
        </Card>
    )
}