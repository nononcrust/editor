import { cn } from "@/lib/utils";
import { Editor, mergeAttributes, Node, NodeViewProps } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, useCurrentEditor } from "@tiptap/react";
import { Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import styles from "../editor/editor.module.css";
import { IconButton } from "../ui/icon-button";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    image: {
      insertImage: (options: { url: string | null; id: string }) => ReturnType;
      removeImage: () => ReturnType;
    };
  }
}

export const uploadedImageMap = new Map<string, string>();

export const ImageExtension = Node.create({
  name: "image",
  group: "block",
  inline: false,
  selectable: true,
  draggable: false,

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    };
  },

  addNodeView: () => {
    return ReactNodeViewRenderer(ImageComponent);
  },

  parseHTML() {
    return [
      {
        tag: this.options.allowBase64 ? "img[src]" : 'img[src]:not([src^="data:"])',
      },
    ];
  },

  addAttributes() {
    return {
      url: {
        default: null,
      },
      id: {
        default: null,
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      insertImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
      removeImage:
        () =>
        ({ commands }) => {
          return commands.clearNodes();
        },
    };
  },
});

const ImageComponent = ({ node, deleteNode }: NodeViewProps) => {
  const { url, id } = node.attrs;

  return (
    <NodeViewWrapper>
      <AsyncImage url={url} id={id} onDelete={deleteNode} />
    </NodeViewWrapper>
  );
};

type AsyncImageProps = {
  url: string | null;
  id: string;
  onDelete: () => void;
};

const AsyncImage = ({ url, id, onDelete }: AsyncImageProps) => {
  const { editor } = useCurrentEditor();

  const cachedImageUrl = uploadedImageMap.get(id);

  const imageSrc = cachedImageUrl || url;

  // Redo로 인해 마운트되었을 때 이미지 캐시를 확인
  useEffect(() => {
    if (url !== null || editor === null) return;

    if (cachedImageUrl) {
      setTimeout(() => {
        updateImageNodeAttr({
          editor,
          id,
          url: cachedImageUrl,
        });
      }, 0);
    }
  }, [id, url, editor, cachedImageUrl]);

  if (imageSrc === null) {
    return <div className="h-[320px] w-full bg-gray-200" />;
  }

  return (
    <>
      <img className="w-full select-none" src={imageSrc} alt="" />
      <div className="mt-2 flex justify-center">
        <div className={cn("hidden", styles["image-toolbar"])}>
          <IconButton size="small" aria-label="이미지 삭제" variant="outlined" onClick={onDelete}>
            <Trash2Icon size={16} className="text-error" />
          </IconButton>
        </div>
      </div>
    </>
  );
};

export const updateImageNodeAttr = ({
  editor,
  url,
  id,
}: {
  editor: Editor;
  url: string;
  id: string;
}) => {
  editor.state.doc.descendants((node, position) => {
    const { tr } = editor.state;

    if (node.type.name === "image" && node.attrs.id === id) {
      tr.setMeta("addToHistory", false);
      tr.setNodeMarkup(position, undefined, {
        ...node.attrs,
        url,
      });

      editor.view.dispatch(tr);
    }
  });
};
