import { createContextFactory } from "@/lib/context";
import { useUploadImage } from "@/services/storage";
import { Editor, useEditorState } from "@tiptap/react";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import { updateImageNodeAttr, uploadedImageMap } from "../extensions/image";

const DEFAULT_TEXT_COLOR = "#000000";

export const useToolbar = () => {
  const { editor } = useToolbarContext();

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isUnderline: ctx.editor.isActive("underline"),
      isStrikethrough: ctx.editor.isActive("strike"),
      isLink: ctx.editor.isActive("link"),
      isOrderedList: ctx.editor.isActive("orderedList"),
      isBulletList: ctx.editor.isActive("bulletList"),
      isTextAlignLeft: ctx.editor.isActive("textAlign", { textAlign: "left" }),
      isTextAlignCenter: ctx.editor.isActive("textAlign", { textAlign: "center" }),
      isTextAlignRight: ctx.editor.isActive("textAlign", { textAlign: "right" }),
      fontSize: ctx.editor.getAttributes("textStyle").fontSize || "16px",
      characterCount: ctx.editor.storage.characterCount.characters(),
      currentColor: editor.getAttributes("textStyle").color ?? DEFAULT_TEXT_COLOR,
    }),
  });

  const {
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    isLink,
    isOrderedList,
    isBulletList,
    isTextAlignLeft,
    isTextAlignCenter,
    isTextAlignRight,
    fontSize,
    currentColor,
    characterCount,
  } = editorState;

  const isSelectionEmpty = editor.state.selection.empty;

  const changeFontSize = (size: number) => {
    editor.chain().focus().setFontSize(`${size}pt`).run();
  };

  const toggleFontSize = (size: string) => {
    if (editorState.fontSize === `${size}pt`) {
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

  const toggleStrikethrough = () => {
    editor.chain().focus().toggleStrike().run();
  };

  const insertLink = (url: string) => {
    editor.commands.setLink({ href: url });
  };

  const toggleOrderedList = () => {
    editor.chain().focus().toggleOrderedList().run();
  };

  const toggleBulletList = () => {
    editor.chain().focus().toggleBulletList().run();
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

  return {
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    isLink,
    isTextAlignLeft,
    isTextAlignCenter,
    isTextAlignRight,
    isOrderedList,
    isBulletList,
    isSelectionEmpty,
    fontSize,
    currentColor,
    characterCount,
    changeFontSize,
    changeColor,
    toggleFontSize,
    toggleBold,
    toggleUnderline,
    toggleStrikethrough,
    insertLink,
    insertImage,
    toggleOrderedList,
    toggleBulletList,
  };
};

type ToolbarContextValue = {
  editor: Editor;
};

const [ToolbarContext, useToolbarContext] = createContextFactory<ToolbarContextValue>("Toolbar");

type ToolbarContextProviderProps = {
  editor: Editor;
  children: React.ReactNode;
};

export const ToolbarContextProvider = ({ children, editor }: ToolbarContextProviderProps) => {
  return <ToolbarContext value={{ editor }}>{children}</ToolbarContext>;
};
