"use client";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import FileLiveblocksClient from "./file-blocks-client";

export default function FilePageClient({ fileId }: { fileId: Id<"files"> }) {
  const file = useQuery(api.files.getFile, { fileId });
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

      const updatedContent = await getFileTextContent({
        storageId: file.fileId,
      });
      setContent(updatedContent);
      setIsDirty(false);
      toast({
        variant: "success",
        title: "Сохранено",
        description: "Изменения успешно сохранены",
      });
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

  if (!file) {
    return <div>Загрузка файла...</div>;
  }

  return (
    <FileLiveblocksClient
      file={file as Doc<"files">}
      initialContent={content}
      onContentChange={(text) => {
        setContent(text);
        setIsDirty(true);
      }}
      onSave={handleSave}
      isDirty={isDirty}
      saving={saving}
      loading={loading}
      error={error}
    />
  );
}
