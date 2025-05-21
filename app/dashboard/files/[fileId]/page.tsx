"use client";

import { api } from "@/convex/_generated/api";
import { useQuery, useAction, useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

// Типизация сообщений Rover
interface RoverMessage {
  role: "user" | "rover";
  content: string;
  roverImageType?: "happy" | "chill" | "find" | "standart";
}

function getRoverImage(
  type: "hello" | "happy" | "chill" | "find" | "standart"
) {
  switch (type) {
    case "hello":
      return "/rover/rover-hello.png";
    case "happy":
      return "/rover/rover-happy.png";
    case "chill":
      return "/rover/rover-chill.png";
    case "find":
      return "/rover/rover-find.png";
    case "standart":
    default:
      return "/rover/rover-standart.png";
  }
}

function getRandomRoverImageType(): "happy" | "chill" | "find" | "standart" {
  const types = ["happy", "chill", "find", "standart"] as const;
  const idx = Math.floor(Math.random() * types.length);
  return types[idx];
}

function RoverAssistant({ fileContent }: { fileContent: string }) {
  const askFileRover = useAction(api.files.askFileRover);
  const { toast } = useToast();
  const [messages, setMessages] = useState<RoverMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingRoverImageType, setPendingRoverImageType] = useState<
    "happy" | "chill" | "find" | "standart"
  >("standart");

  // Ограничиваем размер файла
  const limitedContent = fileContent.slice(0, 8000);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessages: RoverMessage[] = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(newMessages);
    setLoading(true);
    // Генерируем тип рендера для следующего ответа Ровера заранее
    const nextRoverImageType = getRandomRoverImageType();
    setPendingRoverImageType(nextRoverImageType);
    try {
      const apiRoverMessages = newMessages.map((m) => ({
        role: m.role === "rover" ? "assistant" : m.role,
        content: m.content,
      }));
      const res = await askFileRover({
        fileContent: limitedContent,
        roverMessages: apiRoverMessages,
      });
      setMessages([
        ...newMessages,
        {
          role: "rover",
          content: res.answer,
          roverImageType: nextRoverImageType,
        },
      ]);
      setInput("");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Ошибка Ровера",
        description:
          err instanceof Error
            ? err.message
            : "Не удалось получить ответ от Ровера",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-gray-50 rounded p-4 mb-2 overflow-auto">
        {messages.length === 0 && (
          <div className="flex flex-col items-center gap-2">
            <Image
              src={getRoverImage("hello")}
              alt="Ровер приветствует вас"
              width={120}
              height={120}
              priority
            />
            <span className="text-gray-400 text-center">
              История общения с Ровером появится здесь.
              <br />
              Спросите Ровера о содержимом файла!
            </span>
          </div>
        )}
        {messages.map((msg, i) =>
          msg.role === "rover" ? (
            <div key={i} className="flex items-start gap-2 mb-2">
              <Image
                src={getRoverImage(msg.roverImageType || "standart")}
                alt="Ровер"
                width={48}
                height={48}
                className="rounded-full"
              />
              <span className="bg-yellow-100 text-yellow-900 rounded px-2 py-1 inline-block">
                <b>Ровер:</b> {msg.content}
              </span>
            </div>
          ) : (
            <div key={i} className="text-right mb-2">
              <span className="bg-blue-100 text-blue-900 rounded px-2 py-1 inline-block">
                {msg.content}
              </span>
            </div>
          )
        )}
        {loading && (
          <div className="flex items-center gap-2 mt-2">
            <Image
              src={getRoverImage(pendingRoverImageType)}
              alt="Ровер думает"
              width={32}
              height={32}
              className="animate-bounce"
            />
            <span className="text-gray-400">Ровер думает...</span>
          </div>
        )}
      </div>
      <form className="flex gap-2" onSubmit={handleSend}>
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Ваш вопрос..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          {loading ? "Отправка..." : "Спросить Ровера"}
        </Button>
      </form>
    </div>
  );
}

export default function FileViewPage({
  params,
}: {
  params: Promise<{ fileId: Id<"files"> }>;
}) {
  const resolvedParams = use(params);
  const file = useQuery(api.files.getFile, { fileId: resolvedParams.fileId });
  const getFileTextContent = useAction(api.files.getFileTextContent);
  const saveTextToStorage = useAction(api.files.saveFileTextContentToStorage);
  const saveFileTextContent = useMutation(api.files.saveFileTextContent);
  const { toast } = useToast();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!file) return;
    // Только для текстовых форматов
    if (["text", "csv"].includes(file.type)) {
      setLoading(true);
      getFileTextContent({ storageId: file.fileId })
        .then(setContent)
        .catch(() => setError("Не удалось загрузить содержимое файла"))
        .finally(() => setLoading(false));
    }
    setIsDirty(false);
  }, [file, getFileTextContent]);

  async function handleSave() {
    if (!file) return;
    setSaving(true);
    try {
      const storageId = await saveTextToStorage({ content });
      await saveFileTextContent({ fileId: file._id, storageId });
      toast({
        variant: "success",
        title: "Сохранено",
        description: "Изменения успешно сохранены",
      });
      setIsDirty(false);
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сохранить файл",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Левая колонка: просмотр файла */}
      <div className="flex-1 border-r p-6 overflow-auto">
        <h2 className="text-xl font-bold mb-4">
          {file ? file.name : "Загрузка..."}
        </h2>
        <div className="bg-gray-100 rounded p-4 min-h-[300px] text-gray-800">
          {loading && <span>Загрузка содержимого...</span>}
          {error && <span className="text-red-500">{error}</span>}
          {!loading &&
            !error &&
            file &&
            ["text", "csv"].includes(file.type) && (
              <div className="flex flex-col gap-2">
                <MonacoEditor
                  height="300px"
                  defaultLanguage={file.type === "csv" ? "csv" : "plaintext"}
                  value={content}
                  onChange={(v) => {
                    setContent(v ?? "");
                    setIsDirty(true);
                  }}
                  options={{ fontSize: 14, minimap: { enabled: false } }}
                  theme="vs-light"
                />
                <Button
                  className="self-end"
                  onClick={handleSave}
                  disabled={!isDirty || saving}
                >
                  {saving ? "Сохранение..." : "Сохранить"}
                </Button>
              </div>
            )}
          {!loading &&
            !error &&
            file &&
            !["text", "csv"].includes(file.type) && (
              <span>Просмотр этого формата пока не поддерживается</span>
            )}
        </div>
      </div>
      {/* Правая колонка: чат с Ровером */}
      <div className="w-full md:w-[400px] p-6 flex flex-col">
        <h3 className="text-lg font-semibold mb-2">
          Ровер — AI-ассистент по файлу
        </h3>
        <RoverAssistant fileContent={content} />
      </div>
    </div>
  );
}
