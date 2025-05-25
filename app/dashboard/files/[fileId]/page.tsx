import { Id } from "@/convex/_generated/dataModel";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";
import FilePageClient from "./_components/file-page-client";
import { use } from "react";

export default function FileViewPage({
  params,
}: {
  params: Promise<{ fileId: Id<"files"> }>;
}) {
  const awaitedParams = use(params);

  return <FilePageClient fileId={awaitedParams.fileId} />;
}
