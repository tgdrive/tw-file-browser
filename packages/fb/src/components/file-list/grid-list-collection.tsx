import React from "react";
import {
  GridList as AriaGridList,
  GridListItem as AriaGridListItem,
  composeRenderProps,
  type GridListItemProps,
  type GridListProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

export const focusRing = tv({
  base: "outline-none",
  variants: {
    isFocusVisible: {
      true: "status-focused",
    },
  },
});

export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tw: string,
): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => twMerge(tw, className));
}


export function StyledGridList<T extends object>({
  className,
  ...props
}: GridListProps<T>) {
  return (
    <AriaGridList
      {...props}
      className={composeTailwindRenderProps(className, [
        "size-full relative overflow-y-auto overflow-x-hidden outline-none",
      ].join(" "))}
    />
  );
}


export const gridListItemStyles = tv({
  extend: focusRing,
  base: [
    "relative w-full rounded-2xl outline-none no-highlight overflow-clip select-none",
    "[cursor:var(--cursor-interactive)]",
    "transition-[transform,box-shadow] duration-250 ease-out motion-reduce:transition-none",
    ].join(""),
  variants: {
    isSelected: {
      true: "bg-accent-soft",
    },
    isPressed: {
      true: "scale-[0.98]",
    },
    isDisabled: {
      true: "status-disabled",
    },
  },
  defaultVariants: {
    isSelected: false,
    isHovered: false,
    isPressed: false,
    isDisabled: false,
  },
  compoundVariants: [
    {
      isHovered: true,
      isSelected: false,
      class: "bg-default",
    },
  ],
});

export function StyledGridListItem({
  children,
  className,
  ...props
}: GridListItemProps) {
  return (
    <AriaGridListItem
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        twMerge(
          gridListItemStyles({
            isFocusVisible: renderProps.isFocusVisible,
            isSelected: renderProps.isSelected,
            isHovered: renderProps.isHovered,
            isPressed: renderProps.isPressed,
            isDisabled: renderProps.isDisabled,
          }),
          className as string,
        ),
      )}
    >
      {children}
    </AriaGridListItem>
  );
}
