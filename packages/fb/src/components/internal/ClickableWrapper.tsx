import React, { memo, useMemo } from "react";
import { useClickHandler } from "./ClickableWrapper-hooks";
import { useHover } from "@react-aria/interactions";
import { mergeProps } from "@react-aria/utils";
import { dataAttr } from "@tw-material/shared-utils";
import type { As, HTMLTwM3Props } from "@tw-material/system";
import { useFocusRing } from "@react-aria/focus";
import { focusVisibleClasses } from "@/util/classes";
import clsx from "clsx";

export interface MouseClickEvent {
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
}
export type MouseClickEventHandler = (event: MouseClickEvent) => void;

export type ClickableWrapperProps = {
  as?: As;
  onSingleClick?: MouseClickEventHandler;
  onDoubleClick?: MouseClickEventHandler;
  selected?: boolean;
} & Omit<HTMLTwM3Props<"div">, "onDoubleClick">;

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
          "data-[selected=true]:!bg-secondary-container/60",
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
