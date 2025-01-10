import { cn } from "@/lib/utils";
import ColorExtension from "@tiptap/extension-color";
import LinkExtension from "@tiptap/extension-link";
import TextStyleExtension from "@tiptap/extension-text-style";
import UnderlineExtension from "@tiptap/extension-underline";
import {
  EditorContent,
  EditorProvider,
  JSONContent,
  useEditor as useTiptapEditor,
} from "@tiptap/react";
import StarterKitExtension from "@tiptap/starter-kit";
import FontSizeExtension from "tiptap-extension-font-size";
import { ImageExtension } from "../extensions/image";
import styles from "./editor.module.css";
import { Toolbar } from "./toolbar";

export type EditorValue = JSONContent;

type EditorProps = {
  mode?: "edit" | "view";
  className?: string;
  value: EditorValue;
  onChange: (value: EditorValue) => void;
};

const extensions = [
  StarterKitExtension.configure({
    gapcursor: false,
  }),
  UnderlineExtension,
  ColorExtension,
  TextStyleExtension,
  FontSizeExtension,
  LinkExtension.configure({
    autolink: false,
    HTMLAttributes: {
      target: "_blank",
      class: "text-[#3b82f6] underline",
    },
  }),
  ImageExtension,
];

export const initialEditorValue: EditorValue = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

export const Editor = ({ mode = "edit", className, value, onChange }: EditorProps) => {
  return (
    <EditorProvider
      extensions={extensions}
      content={value}
      onUpdate={({ editor }) => onChange(editor.getJSON())}
      editorProps={{
        attributes: {
          class: cn("outline-none", styles["tiptap"], className),
        },
      }}
      slotBefore={mode === "edit" && <Toolbar />}
      immediatelyRender={false}
    />
  );
};

const rendererExtensions = [...extensions];

type RendererProps = {
  className?: string;
  value: EditorValue;
};

export const EditorRenderer = ({ className, value }: RendererProps) => {
  const editor = useTiptapEditor({
    editable: false,
    content: value,
    extensions: rendererExtensions,
    immediatelyRender: false,
  });

  return <EditorContent className={cn("", className)} editor={editor}></EditorContent>;
};
