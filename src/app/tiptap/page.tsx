"use client";

import { Editor } from "@/features/tiptap/components/editor";
import { useEditor } from "@/features/tiptap/hooks/use-editor";

export default function TiptapPage() {
  const editor = useEditor();

  return (
    <main className="flex min-h-dvh flex-col">
      <Editor
        placeholder="내용을 입력해 주세요."
        className="px-12 pt-12"
        value={editor.value}
        onChange={editor.onChange}
      />
    </main>
  );
}
