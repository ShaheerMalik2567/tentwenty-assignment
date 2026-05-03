"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

import { cn } from "@/lib/utils";

function TooltipProvider({
  delay = 280,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delay={delay} {...props} />;
}

function TooltipRoot(props: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root {...props} />;
}

function TooltipTrigger({
  className,
  delay = 180,
  ...props
}: TooltipPrimitive.Trigger.Props) {
  return (
    <TooltipPrimitive.Trigger
      delay={delay}
      className={cn(
        "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-timesheet-action/35 focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    />
  );
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 8,
  align = "center",
  children,
  ...popupProps
}: Omit<
  React.ComponentProps<typeof TooltipPrimitive.Popup>,
  "children"
> & {
  side?: React.ComponentProps<typeof TooltipPrimitive.Positioner>["side"];
  sideOffset?: number;
  align?: React.ComponentProps<typeof TooltipPrimitive.Positioner>["align"];
  children?: React.ReactNode;
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
      >
        <TooltipPrimitive.Popup
          className={cn(
            "z-[100] max-w-[min(22rem,calc(100vw-1.5rem))] rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm leading-relaxed font-normal text-neutral-700 shadow-md ring-1 ring-black/[0.06]",
            className,
          )}
          {...popupProps}
        >
          <TooltipPrimitive.Viewport>{children}</TooltipPrimitive.Viewport>
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export {
  TooltipProvider,
  TooltipRoot as Tooltip,
  TooltipTrigger,
  TooltipContent,
};
