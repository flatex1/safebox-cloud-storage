"use client";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useState, useEffect, useRef } from "react";
import { EditorTiptap } from "@/components/editor-tiptap";
import { Button } from "@/components/ui/button";
import { renderAsync } from "docx-preview";
import { useQuery } from "convex/react";
import { RoverAssistant } from "./rover-assistant";
import { useOthers } from "@liveblocks/react";
import Image from "next/image";

export default function FileLiveblocksContent({
  file,
  initialContent,
  onContentChange,
  onSave,
  isDirty,
  saving,
  loading: externalLoading,
  error,
}: {
  file: Doc<"files">;
  initialContent: string;
  onContentChange: (text: string) => void;
  onSave: () => void;
  isDirty: boolean;
  saving: boolean;
  loading: boolean;
  error: string | null;
}) {
  const [content, setContent] = useState(initialContent);
  const fileUrl = useQuery(api.files.getFileUrl, { fileId: file.fileId });
  const docxContainerRef = useRef<HTMLDivElement>(null);
  const others = useOthers();
  const onlineCount = others.length + 1;

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    if (
      (file.type === "docx" || file.type === "doc") &&
      fileUrl &&
      docxContainerRef.current
    ) {
      fetch(fileUrl)
        .then((res) => res.blob())
        .then((blob) =>
          renderAsync(
            blob,
            docxContainerRef.current as HTMLElement,
            undefined,
            { inWrapper: false }
          ).then(() => {
            if (docxContainerRef.current) {
              setContent(docxContainerRef.current.innerText || "");
            }
          })
        )
        .catch(() => {
          if (docxContainerRef.current)
            docxContainerRef.current.innerHTML =
              "Не удалось отобразить документ.";
        });
    }
  }, [file.type, fileUrl]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Левая колонка: просмотр файла */}
      <div className="flex-1 border-r p-6 overflow-auto">
        <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
          <span>{file ? file.name : "Загрузка..."}</span>
          <span className="flex items-center gap-2 ml-2">
            <span className="flex -space-x-2">
              {others.map((user, i) =>
                user.info?.avatar ? (
                  <Image
                    key={i}
                    src={user.info.avatar}
                    alt="user"
                    className="w-6 h-6 rounded-full border border-white shadow"
                    width={24}
                    height={24}
                  />
                ) : (
                  <span
                    key={i}
                    className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold border border-white shadow"
                  >
                    {user.info?.name?.[0]?.toUpperCase() || "?"}
                  </span>
                )
              )}
            </span>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              Онлайн: {onlineCount}{" "}
              {onlineCount === 1
                ? "пользователь"
                : onlineCount < 5
                  ? "пользователя"
                  : "пользователей"}
            </span>
          </span>
        </h2>
        <div className="bg-gray-100 rounded p-4 min-h-[300px] text-gray-800 max-h-[80vh] overflow-auto">
          {externalLoading && <span>Загрузка содержимого...</span>}
          {error && <span className="text-red-500">{error}</span>}
          {/* DOCX/DOC предпросмотр */}
          {!externalLoading &&
            !error &&
            file &&
            ["docx", "doc"].includes(file.type) && (
              <>
                <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
                  Просмотр DOCX/DOC-файлов доступен только для чтения.
                  Редактирование и сохранение недоступны.
                </div>
                <div
                  ref={docxContainerRef}
                  className="bg-white rounded shadow p-2 overflow-auto min-h-[300px]"
                />
              </>
            )}
          {/* Markdown/Text редактор */}
          {!externalLoading &&
            !error &&
            file &&
            ["md", "markdown", "text", "csv"].includes(file.type) && (
              <>
                <EditorTiptap
                  key={file._id}
                  content={content}
                  onContentChange={(text) => {
                    setContent(text);
                    onContentChange(text);
                  }}
                />
                <Button
                  className="self-end mt-2"
                  onClick={onSave}
                  disabled={!isDirty || saving}
                >
                  {saving ? "Сохранение..." : "Сохранить"}
                </Button>
              </>
            )}
          {/* Неподдерживаемый формат */}
          {!externalLoading &&
            !error &&
            file &&
            !["text", "csv", "md", "markdown", "docx", "doc", "rich"].includes(
              file.type
            ) && <span>Просмотр этого формата пока не поддерживается</span>}
        </div>
      </div>
      {/* Правая колонка: чат с Ровером */}
      <div className="w-full md:w-[400px] p-6 flex flex-col h-screen">
        <h3 className="text-lg font-semibold mb-2">
          Ровер — AI-ассистент по файлу
        </h3>
        <RoverAssistant fileContent={content} />
      </div>
    </div>
  );
}
