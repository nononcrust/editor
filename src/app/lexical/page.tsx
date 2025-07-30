"use client";

import { Editor, initialEditorValue } from "@/features/lexical/components/editor";
import { useState } from "react";

export default function LexicalPage() {
  const [editorValue, setEditorValue] = useState(initialEditorValue);

  return (
    <main className="flex min-h-dvh flex-col">
      <div>
        <Editor value={editorValue} onChange={setEditorValue} />
      </div>
    </main>
  );
}
