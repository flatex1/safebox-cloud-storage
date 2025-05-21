"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  // CardHeader,
  // CardTitle,
  // CardDescription,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import {
  Download,
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  PackageIcon,
  User,
  Calendar,
  Download as DownloadIcon,
} from "lucide-react";
import Image from "next/image";
import { use } from "react";
import Link from "next/link";

export default function SharePage({
  params,
}: {
  params: Promise<{ fileId: Id<"files"> }>;
}) {
  const resolvedParams = use(params);
  const file = useQuery(api.files.getFile, {
    fileId: resolvedParams.fileId,
  });

  const fileUrl = useQuery(api.files.generatePublicDownloadUrl, {
    fileId: resolvedParams.fileId,
  });

  const incrementDownload = useMutation(api.files.incrementDownloadCount);
  const author = useQuery(
    api.users.getUserProfile,
    file ? { userId: file.userId } : "skip"
  );
  const me = useQuery(api.users.getMe, {});

  if (!file || !fileUrl) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <Card className="w-[350px]">
          <CardContent className="pt-6">
            Файл не найден или ссылка недействительна
          </CardContent>
        </Card>
      </div>
    );
  }

  const typeIcons = {
    image: <ImageIcon className="h-32 w-32 text-gray-400" />,
    pdf: <FileTextIcon className="h-32 w-32 text-gray-400" />,
    csv: <GanttChartIcon className="h-32 w-32 text-gray-400" />,
    archive: <PackageIcon className="h-32 w-32 text-gray-400" />,
  };

  // Словарь для перевода типов файлов
  const typeLabels: Record<string, string> = {
    image: "Изображение",
    pdf: "PDF",
    csv: "Таблица",
    archive: "Архив",
    text: "Текстовый документ",
  };

  const downloadFile = async (url: string, filename: string) => {
    if (file) {
      await incrementDownload({ fileId: file._id });
    }
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex flex-col items-center justify-start py-4">
      <Image
        src="/recraft/share_file.png"
        alt="Иконка файла"
        width={96}
        height={96}
        className="mb-4 mx-auto"
      />
      {me && me.name ? (
        <div className="mb-6 w-full max-w-2xl text-center mx-auto">
          <div className="text-2xl font-bold mb-2">
            {me.name}, с вами поделились файлом!
          </div>
        </div>
      ) : (
        <div className="mb-6 w-full max-w-2xl text-center mx-auto">
          <div className="text-2xl font-bold mb-2">
            С вами поделились файлом
          </div>
          <div className="text-gray-600 mb-4">
            Вы можете скачать этот файл, а если{" "}
            <span className="font-semibold">войдёте</span> или{" "}
            <span className="font-semibold">зарегистрируетесь</span> — сможете
            делиться своими файлами с другими!
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/sign-in" className="inline-block">
              <button className="px-5 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
                Войти
              </button>
            </Link>
            <Link href="/sign-up" className="inline-block">
              <button className="px-5 py-2 rounded bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition">
                Зарегистрироваться
              </button>
            </Link>
          </div>
        </div>
      )}
      <Card className="w-full max-w-2xl p-6 mx-auto mb-0">
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Левая колонка: превью, название, тип */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4 border-r md:pr-8 border-gray-200">
            <div className="w-full text-center">
              <div className="text-lg font-semibold mb-1 break-words">
                {file.name}
              </div>
              <div className="text-sm text-gray-500 mb-4">
                {typeLabels[file.type] || file.type}
              </div>
            </div>
            <div className="flex items-center justify-center min-h-[120px]">
              {file.type === "image" ? (
                <Image
                  src={fileUrl}
                  alt={file.name}
                  width={200}
                  height={200}
                  className="object-contain rounded-lg border"
                />
              ) : (
                typeIcons[file.type as keyof typeof typeIcons]
              )}
            </div>
          </div>

          {/* Правая колонка: инфо и кнопка */}
          <div className="flex-1 flex flex-col justify-between gap-6 md:pl-8">
            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Автор:</span>{" "}
                {author ? author.name || "Пользователь" : "..."}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Загружено:</span>{" "}
                {new Date(file._creationTime).toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <DownloadIcon className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Скачиваний:</span>{" "}
                {file.downloads || 0}
              </div>
            </div>
            <Button
              onClick={() => fileUrl && downloadFile(fileUrl, file.name)}
              className="w-full md:w-auto self-end"
            >
              <Download className="mr-2 h-4 w-4" />
              Скачать файл
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
