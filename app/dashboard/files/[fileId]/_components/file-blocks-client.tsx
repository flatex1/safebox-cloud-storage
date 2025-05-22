"use client";
import { Room } from "@/components/room";
import { Doc } from "@/convex/_generated/dataModel";
import FileLiveblocksContent from "./file-liveblocks-content";

export default function FileLiveblocksClient(props: {
  file: Doc<"files">;
  initialContent: string;
  onContentChange: (text: string) => void;
  onSave: () => void;
  isDirty: boolean;
  saving: boolean;
  loading: boolean;
  error: string | null;
}) {
  return (
    <Room roomId={`file-${props.file._id}`}>
      <FileLiveblocksContent {...props} />
    </Room>
  );
}
