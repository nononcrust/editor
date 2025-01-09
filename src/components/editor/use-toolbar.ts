import { useCurrentEditor } from "@tiptap/react";

const DEFAULT_TEXT_COLOR = "#000000";

export const useToolbar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    throw new Error("useToolbar는 EditorProvider 안에서만 사용할 수 있습니다.");
  }

  const currentColor: string = editor.getAttributes("textStyle").color ?? DEFAULT_TEXT_COLOR;

  const isBoldActive = editor.isActive("bold");

  const isUnderlineActive = editor.isActive("underline");

  const currentFontSize: string = editor.getAttributes("textStyle").fontSize?.replace("pt", "");

  const changeFontSize = (size: string) => {
    editor.commands.setFontSize(`${size}pt`);
  };

  const toggleFontSize = (size: string) => {
    if (currentFontSize === size) {
      editor.commands.setFontSize("16pt");
    } else {
      editor.commands.setFontSize(`${size}pt`);
    }
  };

  const changeColor = (color: string) => {
    editor.commands.setColor(color);
  };

  const toggleBold = () => {
    editor.chain().focus().toggleBold().run();
  };

  const toggleUnderline = () => {
    editor.chain().focus().toggleUnderline().run();
  };

  const insertLink = (url: string) => {
    editor.commands.setLink({ href: url });
  };

  const insertImage = (url: string) => {
    editor.chain().focus().setImage({ src: url, alt: "게시글 삽입 이미지" }).run();
    editor.commands.enter();
    editor.commands.focus("end");
  };

  const selectionEmpty = editor.state.selection.empty;

  return {
    selectionEmpty,
    currentColor,
    isBoldActive,
    isUnderlineActive,
    currentFontSize,
    changeFontSize,
    changeColor,
    toggleFontSize,
    toggleBold,
    toggleUnderline,
    insertLink,
    insertImage,
  };
};
