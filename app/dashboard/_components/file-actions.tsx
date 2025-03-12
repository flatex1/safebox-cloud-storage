import { Doc } from "@/convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  DownloadIcon,
  MoreVertical,
  Share2Icon,
  StarHalf,
  StarIcon,
  TrashIcon,
  UndoIcon,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import { Protect } from "@clerk/nextjs";

export function FileCardActions({
  file,
  isFavorited,
}: {
  file: Doc<"files">;
  isFavorited: boolean;
}) {
  const toggleFavorite = useMutation(api.favorites.toggleFavorite);
  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restoreFile);
  const fileUrl = useQuery(api.files.getFileUrl, { fileId: file.fileId });
  const me = useQuery(api.users.getMe);
  const { toast } = useToast();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие пометит этот файл для удаления. Файлы удаляются
              навсегда раз в 30 дней.
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
              }}
            >
              Да, удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              toggleFavorite({ fileId: file._id });
            }}
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
          <DropdownMenuItem
            onClick={() => {
              window.open(fileUrl, "_blank");
            }}
          >
            <DownloadIcon className="w-4 h-4" /> Скачать
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              const shareUrl = `${window.location.origin}/share/${file._id}`;
              navigator.clipboard.writeText(shareUrl);
              toast({
                title: "Ссылка скопирована",
                description: "Теперь вы можете поделиться файлом с кем угодно!",
              });
            }}
          >
            <Share2Icon className="w-4 h-4" />
            Создать страницу
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Protect
            condition={(check) => {
              return (
                check({
                  role: "org:admin",
                }) || file.userId === me?._id
              );
            }}
            fallback={
              <DropdownMenuItem
                disabled
                title="Только администраторы организации могут удалять файлы"
              >
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
