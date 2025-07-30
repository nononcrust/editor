import { IconButton } from "@/components/ui/icon-button";
import { Popover } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import {
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";
import { useRef } from "react";
import { ToolbarContextProvider, useToolbar } from "../hooks/use-toolbar";

const MAX_TEXT_LENGTH = 1000;
const COLOR_PRESETS = ["#000000", "#3b82f6", "#34d399", "#f87171", "#fbbf24", "#818cf8"] as const;

type ToolbarProps = {
  editor: Editor;
};

export const Toolbar = ({ editor }: ToolbarProps) => {
  return (
    <ToolbarContextProvider editor={editor}>
      <div className="border-border relative flex h-12 w-full items-center justify-center gap-1 border-y">
        <Bold />
        <Underline />
        <Strikethrough />
        <Link />
        <Color />
        <FontSize />
        <ImageUpload />
        <OrderedList />
        <BulletList />
        <div className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center">
          <CharacterCount />
        </div>
      </div>
    </ToolbarContextProvider>
  );
};

const CharacterCount = () => {
  const { characterCount } = useToolbar();

  return (
    <span className="text-sub text-xs font-medium">
      <span className={cn(characterCount > MAX_TEXT_LENGTH && "text-error")}>{characterCount}</span>
      /{MAX_TEXT_LENGTH}
    </span>
  );
};

const Bold = () => {
  const { isBold, toggleBold } = useToolbar();

  return (
    <IconButton
      className={cn(isBold && "text-primary")}
      variant="ghost"
      size="small"
      aria-label="굵기"
      onClick={toggleBold}
    >
      <BoldIcon size={16} strokeWidth={isBold ? 3 : 2} />
    </IconButton>
  );
};

const Underline = () => {
  const { isUnderline, toggleUnderline } = useToolbar();

  return (
    <IconButton
      className={cn(isUnderline && "text-primary")}
      variant="ghost"
      size="small"
      aria-label="굵기"
      onClick={toggleUnderline}
    >
      <UnderlineIcon size={16} strokeWidth={isUnderline ? 3 : 2} />
    </IconButton>
  );
};

const Strikethrough = () => {
  const { isStrikethrough, toggleStrikethrough } = useToolbar();

  return (
    <IconButton
      className={cn(isStrikethrough && "text-primary")}
      variant="ghost"
      size="small"
      aria-label="취소선"
      onClick={toggleStrikethrough}
    >
      <StrikethroughIcon size={16} strokeWidth={isStrikethrough ? 3 : 2} />
    </IconButton>
  );
};

const Link = () => {
  const { isLink, insertLink } = useToolbar();

  const onLinkInsertButtonClick = () => {
    const url = window.prompt("URL을 입력하세요");

    if (!url) return;

    if (isValidUrl(url)) {
      insertLink(url);
    } else {
      window.alert("올바른 URL을 입력해주세요");
    }
  };

  return (
    <IconButton
      className={cn(isLink && "text-primary")}
      size="small"
      variant="ghost"
      aria-label="링크 삽입"
      onClick={onLinkInsertButtonClick}
    >
      <LinkIcon size={16} />
    </IconButton>
  );
};

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const Color = () => {
  const { currentColor, changeColor } = useToolbar();

  return (
    <Popover>
      <Popover.Trigger
        render={
          <IconButton aria-label="색상" size="small" variant="ghost">
            <div
              className="size-3.5 rounded-[3px]"
              style={{
                backgroundColor: currentColor,
              }}
            />
          </IconButton>
        }
      />
      <Popover.Content className="flex gap-2 p-2">
        {COLOR_PRESETS.map((color) => (
          <Popover.Close
            key={color}
            className="size-3.5 cursor-pointer rounded-[3px]"
            style={{
              backgroundColor: color,
            }}
            onClick={() => changeColor(color)}
          />
        ))}
      </Popover.Content>
    </Popover>
  );
};

const FontSize = () => {
  const { fontSize, toggleFontSize } = useToolbar();

  const isHeading1Active = fontSize === "32pt";
  const isHeading2Active = fontSize === "24pt";
  const isHeading3Active = fontSize === "20pt";

  return (
    <>
      <IconButton
        className={cn(isHeading1Active && "text-primary")}
        variant="ghost"
        size="small"
        aria-label="제목 1"
        onClick={() => toggleFontSize("32")}
      >
        <Heading1Icon size={18} strokeWidth={isHeading1Active ? 3 : 2} />
      </IconButton>
      <IconButton
        className={cn(isHeading2Active && "text-primary")}
        variant="ghost"
        size="small"
        aria-label="제목 2"
        onClick={() => toggleFontSize("24")}
      >
        <Heading2Icon size={18} strokeWidth={isHeading2Active ? 3 : 2} />
      </IconButton>
      <IconButton
        className={cn(isHeading3Active && "text-primary")}
        variant="ghost"
        size="small"
        aria-label="제목 3"
        onClick={() => toggleFontSize("20")}
      >
        <Heading3Icon size={18} strokeWidth={isHeading3Active ? 3 : 2} />
      </IconButton>
    </>
  );
};

const ALLOWED_IMAGE_TYPES = ".jpg,.jpeg,.png";

const ImageUpload = () => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { insertImage } = useToolbar();

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const { files } = event.target;

    if (!files || !files[0] || !imageInputRef.current) return;

    insertImage(files[0]);

    imageInputRef.current.value = "";
  };

  return (
    <>
      <IconButton
        variant="ghost"
        size="small"
        aria-label="이미지 삽입"
        onClick={() => imageInputRef.current?.click()}
      >
        <ImageIcon size={16} />
      </IconButton>
      <input
        className="hidden"
        type="file"
        ref={imageInputRef}
        onChange={onFileChange}
        accept={ALLOWED_IMAGE_TYPES}
      />
    </>
  );
};

const OrderedList = () => {
  const { toggleOrderedList, isOrderedList } = useToolbar();

  return (
    <IconButton
      className={cn(isOrderedList && "text-primary")}
      variant="ghost"
      size="small"
      aria-label="순서 목록"
      onClick={toggleOrderedList}
    >
      <ListOrderedIcon size={16} strokeWidth={isOrderedList ? 3 : 2} />
    </IconButton>
  );
};

const BulletList = () => {
  const { toggleBulletList, isBulletList } = useToolbar();

  return (
    <IconButton
      className={cn(isBulletList && "text-primary")}
      variant="ghost"
      size="small"
      aria-label="글머리 기호 목록"
      onClick={toggleBulletList}
    >
      <ListIcon size={16} strokeWidth={isBulletList ? 3 : 2} />
    </IconButton>
  );
};
