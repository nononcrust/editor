"use client";

import { cn } from "@/lib/utils";
import * as TooltipPrimitives from "@radix-ui/react-tooltip";
import { cva, VariantProps } from "class-variance-authority";

type TooltipProps = VariantProps<typeof tooltipVariants> & {
  className?: string;
  side?: TooltipPrimitives.TooltipContentProps["side"];
  content: React.ReactNode;
  children: React.ReactNode;
  delayDuration?: number;
};

const tooltipVariants = cva(
  cn(
    "relative z-50 rounded-[8px] text-xs px-[10px] py-[6px] font-semibold",
    "animate-in fade-in-0 zoom-in-95",
    "data-[side=top]:slide-in-from-bottom-2",
    "data-[side=bottom]:slide-in-from-top-2",
    "data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2",
  ),
  {
    variants: {
      variant: {
        default: "bg-black text-white",
        outlined: "border border-border bg-background shadow-sm text-main",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const Tooltip = ({
  className,
  variant,
  content,
  side = "top",
  delayDuration = 0,
  children,
}: TooltipProps) => {
  return (
    <TooltipPrimitives.Provider delayDuration={delayDuration}>
      <TooltipPrimitives.Root>
        <TooltipPrimitives.Trigger asChild>{children}</TooltipPrimitives.Trigger>
        <TooltipPrimitives.Portal>
          <TooltipPrimitives.Content
            side={side}
            sideOffset={4}
            className={cn(tooltipVariants({ variant, className }))}
          >
            {content}
          </TooltipPrimitives.Content>
        </TooltipPrimitives.Portal>
      </TooltipPrimitives.Root>
    </TooltipPrimitives.Provider>
  );
};
