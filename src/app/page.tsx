"use client";

import { Editor, EditorRenderer, EditorValue } from "@/components/editor/editor";
import { useEditor } from "@/components/editor/use-editor";

export default function Home() {
  const editor = useEditor();

  const onEditorChange = (value: EditorValue) => {
    console.log("에디터:", value);
    editor.onChange(value);
  };

  return (
    <main className="flex min-h-dvh">
      <div className="w-1/2">
        <Editor className="px-12 pt-12" value={editor.value} onChange={onEditorChange} />
      </div>
      <div className="w-1/2 border-l pt-12">
        <EditorRenderer className="px-12" key={JSON.stringify(editor.value)} value={editor.value} />
      </div>
    </main>
  );
}
