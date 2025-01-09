"use client";

import { Editor, EditorRenderer } from "@/components/editor/editor";
import { useEditor } from "@/components/editor/use-editor";

export default function Home() {
  const editor = useEditor();

  return (
    <main className="flex min-h-dvh">
      <div className="w-1/2">
        <Editor className="px-12 pt-12" value={editor.value} onChange={editor.onChange} />
      </div>
      <div className="w-1/2 border-l pt-12">
        <EditorRenderer className="px-12" key={JSON.stringify(editor.value)} value={editor.value} />
      </div>
    </main>
  );
}
