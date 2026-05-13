import React, { memo, useMemo } from "react";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { useClickHandler } from "./clickable-wrapper.hooks";
import { useHover } from "@react-aria/interactions";
import { mergeProps } from "@react-aria/utils";
import { useFocusRing } from "@react-aria/focus";
import { focusVisibleClasses } from "@/util/classes";
import clsx from "clsx";

type As<C extends ElementType> = C;
type HTMLHeroUIProps<T extends ElementType> = ComponentPropsWithoutRef<T>;

export interface MouseClickEvent {
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
}
export type MouseClickEventHandler = (event: MouseClickEvent) => void;

export type ClickableWrapperProps = {
  as?: As<ElementType>;
  onSingleClick?: MouseClickEventHandler;
  onDoubleClick?: MouseClickEventHandler;
  selected?: boolean;
} & HTMLHeroUIProps<"div">;

const dataAttr = (condition: boolean | undefined | null) =>
  condition ? "true" : undefined;

export const ClickableWrapper = memo(
  ({
    children,
    as,
    onSingleClick,
    onDoubleClick,
    selected,
    className,
    ...otherProps
  }: ClickableWrapperProps) => {
    const handleClick = useClickHandler(onSingleClick, onDoubleClick);

    const { hoverProps, isHovered } = useHover({});

    const { isFocusVisible, isFocused, focusProps } = useFocusRing();

    const compProps = useMemo(
      () => ({
        "data-hover": dataAttr(isHovered),
        "data-focus": dataAttr(isFocused),
        "data-focus-visible": dataAttr(isFocusVisible),
        "data-selected": dataAttr(selected),
        onClick: handleClick,
        className: clsx(
          ...focusVisibleClasses,
          "transition-colors",
          "data-[selected=true]:!bg-accent-soft",
          className,
        ),
        tabIndex: 0,
      }),
      [isFocused, isFocusVisible, isHovered, selected, className, handleClick],
    );

    const Component = as || "div";

    return (
      <Component {...mergeProps(hoverProps, focusProps, otherProps, compProps)}>
        {children}
      </Component>
    );
  },
);
