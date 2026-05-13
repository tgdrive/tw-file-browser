import React from "react";
import {
  GridList as AriaGridList,
  GridListItem as AriaGridListItem,
  type GridListItemProps,
  type GridListProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

// ---- Shared focus ring utility (matches RAC Tailwind starter pattern) ----

export const focusRing = tv({
  base: "outline-none",
  variants: {
    isFocusVisible: {
      false: "",
      true: "outline-2 outline-accent -outline-offset-2",
    },
  },
});

// ---- Helper: composeTailwindRenderProps (matches RAC starter) ----

function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tailwind: string,
): string | ((v: T) => string) {
  if (typeof className === "function") {
    return (v: T) => twMerge(className(v), tailwind);
  }
  return twMerge(tailwind, className);
}

// ---- Styled GridList ----

export function StyledGridList<T extends object>({
  className,
  ...props
}: GridListProps<T>) {
  return (
    <AriaGridList
      {...props}
      className={composeTailwindRenderProps(className, [
        "size-full relative overflow-auto",
      ].join(" "))}
    />
  );
}

// ---- Styled GridListItem ----

export const gridListItemStyles = tv({
  extend: focusRing,
  base: [
    "rounded-xl cursor-default select-none overflow-clip",
    "transition-all duration-150",
  ].join(" "),
  variants: {
    isCard: {
      true: "bg-surface shadow-sm",
      false: "",
    },
    isSelected: {
      true: "bg-accent-soft ring-2 ring-accent ring-offset-1",
      false: "hover:bg-accent-soft/40",
    },
    isPressed: {
      true: "scale-[0.98]",
      false: "",
    },
  },
  defaultVariants: {
    isCard: false,
    isSelected: false,
    isPressed: false,
  },
});

export function StyledGridListItem({
  children,
  className,
  isCard,
  ...props
}: GridListItemProps & { isCard?: boolean }) {
  return (
    <AriaGridListItem
      {...props}
      className={(renderProps) =>
        twMerge(
          gridListItemStyles({
            isFocusVisible: renderProps.isFocusVisible,
            isCard,
            isSelected: renderProps.isSelected,
            isPressed: renderProps.isPressed,
          }),
          typeof className === "function"
            ? className(renderProps as any)
            : (className ?? ""),
        )
      }
    >
      {children}
    </AriaGridListItem>
  );
}
