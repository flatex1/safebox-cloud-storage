"use client";
import {
  useLiveblocksExtension,
  FloatingToolbar,
  FloatingThreads,
} from "@liveblocks/react-tiptap";
import { useThreads } from "@liveblocks/react/suspense";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import { useEffect } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function EditorTiptap({
  content,
  onContentChange,
}: {
  content: string;
  onContentChange?: (text: string) => void;
}) {
  const liveblocks = useLiveblocksExtension({
    initialContent: content,
    field: "main",
  });
  const editor = useEditor({
    extensions: [Document, Paragraph, Text, liveblocks],
    content,
    editorProps: {
      attributes: {
        style:
          "white-space: pre-wrap; font-family: monospace; min-height: 300px;",
      },
    },
    immediatelyRender: false,
  });

  const { threads } = useThreads();

  useEffect(() => {
    if (!editor) return;
    const sharedContent = editor.storage?.main?.get?.();
    if (typeof sharedContent === "string" && sharedContent.length === 0) {
      if (editor.storage?.main?.set) {
        editor.storage.main.set(content);
      } else {
        editor.commands.setContent(content, false);
      }
    }
  }, [editor]);

  useEffect(() => {
    if (!editor || !onContentChange) return;
    const update = () => onContentChange(editor.getText());
    editor.on("update", update);
    return () => {
      editor.off("update", update);
    };
  }, [editor, onContentChange]);

  useAction(api.files.saveFileTextContentToStorage);
  useMutation(api.files.saveFileTextContent);

  return (
    <div className="relative flex flex-col gap-2">
      <EditorContent
        editor={editor}
        className="editor border rounded bg-white min-h-[300px] p-2"
      />
      <FloatingToolbar editor={editor} />
      <FloatingThreads editor={editor} threads={threads} />
    </div>
  );
}
