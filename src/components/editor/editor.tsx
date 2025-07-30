import { cn } from "@/lib/utils";
import ColorExtension from "@tiptap/extension-color";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { EditorContent, JSONContent, useEditor, useEditor as useTiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useMemo } from "react";
import { ImageExtension } from "../extensions/image";
import { Toolbar } from "./toolbar";

export type EditorValue = JSONContent;

const defaultExtensions = [
  StarterKit.configure({
    gapcursor: false,
    link: {
      autolink: false,
      HTMLAttributes: {
        target: "_blank",
        class: "text-[#3b82f6] underline cursor-pointer",
      },
    },
  }),
  ColorExtension,
  TextStyleKit,
  ImageExtension,
  CharacterCount,
];

export const initialEditorValue: EditorValue = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

type EditorProps = {
  className?: string;
  value: EditorValue;
  onChange: (value: EditorValue) => void;
  placeholder?: string;
};

export const Editor = ({ className, value, onChange, placeholder = "" }: EditorProps) => {
  const extensions = useMemo(
    () => [
      ...defaultExtensions,
      Placeholder.configure({
        placeholder,
      }),
    ],
    [placeholder],
  );

  const editor = useEditor({
    extensions,
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        class: cn("outline-none h-full", className),
      },
    },
    immediatelyRender: false,
  });

  if (editor === null) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <Toolbar editor={editor} />
      <EditorContent className="h-full" editor={editor} />
    </div>
  );
};

type RendererProps = {
  className?: string;
  value: EditorValue;
};

export const EditorRenderer = ({ className, value }: RendererProps) => {
  const editor = useTiptapEditor({
    editable: false,
    content: value,
    extensions: defaultExtensions,
    immediatelyRender: false,
  });

  return <EditorContent className={cn("", className)} editor={editor} />;
};
