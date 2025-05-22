import { Id } from "@/convex/_generated/dataModel";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";
import FilePageClient from "./_components/file-page-client";

export default function FileViewPage({
  params,
}: {
  params: { fileId: Id<"files"> };
}) {
  return <FilePageClient fileId={params.fileId} />;
}
