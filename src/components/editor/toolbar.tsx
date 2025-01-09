import { cn } from "@/lib/utils";
import {
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  LinkIcon,
  UnderlineIcon,
} from "lucide-react";
import { useRef } from "react";
import { IconButton } from "../ui/icon-button";
import { Popover } from "../ui/popover";
import { useToolbar } from "./use-toolbar";
import { uploadImage } from "./utils";

export const Toolbar = () => {
  return (
    <div className="flex w-full items-center justify-center gap-1 border-y py-2">
      <Bold />
      <Underline />
      <Link />
      <Color />
      <FontSize />
      <ImageUpload />
    </div>
  );
};

const Bold = () => {
  const { isBoldActive, toggleBold } = useToolbar();

  return (
    <IconButton
      className={cn(isBoldActive && "text-primary")}
      variant="ghost"
      size="small"
      aria-label="굵기"
      onClick={toggleBold}
    >
      <BoldIcon size={16} strokeWidth={isBoldActive ? 3 : 2} />
    </IconButton>
  );
};

const Underline = () => {
  const { isUnderlineActive, toggleUnderline } = useToolbar();

  return (
    <IconButton
      className={cn(isUnderlineActive && "text-primary")}
      variant="ghost"
      size="small"
      aria-label="굵기"
      onClick={toggleUnderline}
    >
      <UnderlineIcon size={16} strokeWidth={isUnderlineActive ? 3 : 2} />
    </IconButton>
  );
};

const Link = () => {
  const { insertLink } = useToolbar();

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
      <Popover.Trigger asChild>
        <IconButton aria-label="색상" size="small" variant="ghost">
          <div
            className="size-3.5 rounded-[3px]"
            style={{
              backgroundColor: currentColor,
            }}
          />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content className="flex gap-2 p-2">
        {["#000000", "#3b82f6", "#34d399", "#f87171", "#fbbf24", "#818cf8"].map((color) => (
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
  const { currentFontSize, toggleFontSize } = useToolbar();

  const isHeading1Active = currentFontSize === "32";
  const isHeading2Active = currentFontSize === "24";
  console.log(currentFontSize);
  const isHeading3Active = currentFontSize === "20";

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

    if (!files || !imageInputRef.current) return;

    const url = await uploadImage(files[0]);

    insertImage(url);

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
