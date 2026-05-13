import React from "react";
import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  composeRenderProps,
  type ListBoxItemProps,
  type ListBoxProps,
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

// ---- Styled ListBox (RAC, used for both list and grid view) ----

export function StyledListBox<T extends object>({
  className,
  ...props
}: ListBoxProps<T>) {
  return (
    <AriaListBox
      {...props}
      className={composeTailwindRenderProps(className, [
        "size-full",
      ].join(" "))}
    />
  );
}

// ---- Styled ListBoxItem (tv-styled for both list and grid items) ----

export const listBoxItemStyles = tv({
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

export function StyledListBoxItem({
  children,
  className,
  isCard,
  ...props
}: ListBoxItemProps & { isCard?: boolean }) {
  return (
    <AriaListBoxItem
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        twMerge(
          listBoxItemStyles({
            isFocusVisible: renderProps.isFocusVisible,
            isCard,
            isSelected: renderProps.isSelected,
            isPressed: renderProps.isPressed,
          }),
          className as string,
        ),
      )}
    >
      {children}
    </AriaListBoxItem>
  );
}
