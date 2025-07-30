"use client";

import { Editor } from "@/components/editor/editor";
import { useEditor } from "@/components/editor/use-editor";

export default function Home() {
  const editor = useEditor();

  return (
    <main className="flex min-h-dvh">
      <div className="w-full">
        <Editor
          placeholder="내용을 입력해 주세요."
          className="px-12 pt-12"
          value={editor.value}
          onChange={editor.onChange}
        />
      </div>
    </main>
  );
}
