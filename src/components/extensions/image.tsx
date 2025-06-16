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
      insertImage: (options: {
        url: string | null;
        id: string;
        width?: number;
        height?: number;
      }) => ReturnType;
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
      width: {
        default: 0,
      },
      height: {
        default: 0,
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
  const { url, id, width, height } = node.attrs;

  return (
    <NodeViewWrapper>
      <AsyncImage url={url} id={id} width={width} height={height} onDelete={deleteNode} />
    </NodeViewWrapper>
  );
};

type AsyncImageProps = {
  url: string | null;
  id: string;
  onDelete: () => void;
  width?: number;
  height?: number;
};

const AsyncImage = ({ url, id, onDelete, width = 500, height = 500 }: AsyncImageProps) => {
  const { editor } = useCurrentEditor();
  const cachedImageUrl = uploadedImageMap.get(id);
  const imageSrc = cachedImageUrl || url;

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

  // 크기 계산 - 너비만 에디터 크기로 제한
  const getImageSize = () => {
    const editorWidth = editor?.view?.dom?.clientWidth || 800; // 에디터 너비 (기본값 800)

    let finalWidth = width;
    let finalHeight = height;

    // 너비가 에디터 너비를 초과하면 축소 (높이는 비율에 맞춰 자동 조정)
    if (finalWidth > editorWidth) {
      finalHeight = (finalHeight * editorWidth) / finalWidth;
      finalWidth = editorWidth;
    }

    return { width: finalWidth, height: finalHeight };
  };

  const { width: finalWidth, height: finalHeight } = getImageSize();

  // 스타일 계산
  const style = {
    width: `${finalWidth}px`,
    height: `${finalHeight}px`,
    objectFit: "contain" as const,
  };

  if (!imageSrc) {
    return (
      <div
        className="flex max-w-full items-center justify-center bg-gray-200"
        style={{
          width: `${finalWidth}px`,
          height: `${finalHeight}px`,
        }}
      >
        <span className="text-sm text-gray-500">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="flex w-fit flex-col">
      <img src={imageSrc} alt="" style={style} />
      <div className="mt-2 flex justify-center">
        <div className={cn("hidden", styles["image-toolbar"])}>
          <IconButton size="small" aria-label="이미지 삭제" variant="outlined" onClick={onDelete}>
            <Trash2Icon size={16} className="text-error" />
          </IconButton>
        </div>
      </div>
    </div>
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
