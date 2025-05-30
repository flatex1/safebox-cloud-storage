"use client";
import Image from "next/image";
import { useAction } from "convex/react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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

export function RoverAssistant({ fileContent }: { fileContent: string }) {
  const askFileRover = useAction(api.files.askFileRover);
  const { toast } = useToast();
  const [messages, setMessages] = useState<RoverMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingRoverImageType, setPendingRoverImageType] = useState<
    "happy" | "chill" | "find" | "standart"
  >("standart");

  // максимальное количество символов для Ровера
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
    // тип картинки для Ровера
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
    <div className="flex flex-col h-full flex-1 min-h-0">
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
          className="flex-1 border rounded px-3"
          placeholder="Ваш вопрос..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          {loading ? "Отправка..." : "Отправить"}
        </Button>
      </form>
    </div>
  );
}
