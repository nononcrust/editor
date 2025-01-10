import { cn } from "@/lib/utils";
import { mergeAttributes, Node, NodeViewProps } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { Trash2Icon } from "lucide-react";
import styles from "../editor/editor.module.css";
import { IconButton } from "../ui/icon-button";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    image: {
      setImage: (options: { src: string; alt?: string; title?: string }) => ReturnType;
      removeImage: () => ReturnType;
    };
  }
}

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
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setImage:
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
  const { src, alt } = node.attrs;

  const removeImage = () => {
    deleteNode();
  };

  return (
    <NodeViewWrapper>
      <img className="w-full" src={src} alt={alt} />
      <div className="mt-2 flex justify-center">
        <div className={cn("hidden", styles["image-toolbar"])}>
          <IconButton
            size="small"
            aria-label="이미지 삭제"
            variant="outlined"
            onClick={removeImage}
          >
            <Trash2Icon size={16} className="text-error" />
          </IconButton>
        </div>
      </div>
    </NodeViewWrapper>
  );
};
