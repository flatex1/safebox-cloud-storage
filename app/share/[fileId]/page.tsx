"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Download, FileTextIcon, GanttChartIcon, ImageIcon, PackageIcon } from "lucide-react";
import Image from "next/image";
import { use } from "react";

export default function SharePage({
    params
}: {
    params: Promise<{ fileId: Id<"files"> }>
}) {
    const resolvedParams = use(params);
    const file = useQuery(api.files.getFile, {
        fileId: resolvedParams.fileId
    });

    const fileUrl = useQuery(api.files.generatePublicDownloadUrl, {
        fileId: resolvedParams.fileId
    });


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
        "image": <ImageIcon className="h-32 w-32 text-gray-400" />,
        "pdf": <FileTextIcon className="h-32 w-32 text-gray-400" />,
        "csv": <GanttChartIcon className="h-32 w-32 text-gray-400" />,
        "archive": <PackageIcon className="h-32 w-32 text-gray-400" />,
    };

    const downloadFile = async (url: string, filename: string) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    };


    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>{file.name}</CardTitle>
                    <CardDescription>{file.type}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    {file.type === "image" ? (
                        <Image
                            src={fileUrl}
                            alt={file.name}
                            width={200}
                            height={200}
                            className="object-contain"
                        />
                    ) : (
                        typeIcons[file.type as keyof typeof typeIcons]
                    )}

                    <Button
                        onClick={() => fileUrl && downloadFile(fileUrl, file.name)}
                        className="w-full"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Скачать файл
                    </Button>                </CardContent>
            </Card>
        </div>
    );
}