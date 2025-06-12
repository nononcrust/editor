import { useUploadImage } from "@/services/storage";
import { useCurrentEditor } from "@tiptap/react";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import { updateImageNodeAttr, uploadedImageMap } from "../extensions/image";

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

  const { mutate: uploadImage } = useUploadImage();

  const insertImage = (file: File) => {
    const id = nanoid();

    editor.chain().focus().insertImage({ url: null, id }).run();

    editor.commands.enter();

    uploadImage(file, {
      onSuccess: (data) => {
        updateImageNodeAttr({
          editor,
          id,
          url: data.url,
        });

        uploadedImageMap.set(id, data.url);
      },
      onError: () => {
        const { state, dispatch } = editor.view;
        const { tr } = state;

        state.doc.descendants((node, pos) => {
          if (node.type.name === "image" && node.attrs.id === id) {
            tr.delete(pos, pos + node.nodeSize);
          }
        });

        dispatch(tr);

        toast.error("이미지를 업로드하지 못했어요.");
      },
    });
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
