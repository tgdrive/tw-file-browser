import React, { forwardRef, memo } from "react";
import type { Nullable } from "tsdef";

import { selectFileActionData } from "@/redux/selectors";
import { useParamSelector } from "@/redux/store";
import { FbIconName, CustomVisibilityState } from "@/util/enums";
import { useFileActionProps, useFileActionTrigger } from "@/util/file-actions";
import { useLocalizedFileActionStrings } from "@/util/i18n";
import { Button, type ButtonProps } from "@tw-material/react";
import { FbIcon } from "./FbIcon";
import clsx from "clsx";

export type ToolbarButtonProps = {
  className?: string;
  text: string;
  tooltip?: string;
  active?: boolean;
  icon?: Nullable<FbIconName | string>;
  iconOnly?: boolean;
  dropdown?: boolean;
} & Omit<ButtonProps, "ref">;

export const ToolbarButton = memo(
  forwardRef<HTMLButtonElement, ToolbarButtonProps>(
    (
      {
        className,
        text,
        tooltip,
        active,
        icon,
        iconOnly,
        disabled,
        dropdown,
        ...props
      },
      ref,
    ) => {
      const iconComponent =
        icon || iconOnly ? (
          <FbIcon
            icon={icon ? icon : FbIconName.fallbackIcon}
            fixedWidth={true}
          />
        ) : null;
      return (
        <Button
          ref={ref}
          variant="text"
          className={clsx(
            "[&>svg]:size-5",
            !disabled && "text-inherit ",
            className,
          )}
          title={tooltip ? tooltip : text}
          isDisabled={disabled}
          isIconOnly={iconOnly}
          startContent={
            dropdown && text && !iconOnly ? (
              <FbIcon icon={FbIconName.dropdown} fixedWidth={true} />
            ) : undefined
          }
          {...props}
        >
          {iconOnly && iconComponent}
          {text && !iconOnly && <span>{text}</span>}
        </Button>
      );
    },
  ),
);

export interface SmartToolbarButtonProps {
  fileActionId: string;
  size?: ButtonProps["size"];
  className?: string;
}

export const SmartToolbarButton = memo(
  ({ fileActionId, ...props }: SmartToolbarButtonProps) => {
    const action = useParamSelector(selectFileActionData, fileActionId);
    const triggerAction = useFileActionTrigger(fileActionId);
    const { icon, active, disabled } = useFileActionProps(fileActionId);
    const { buttonName, buttonTooltip } = useLocalizedFileActionStrings(action);

    if (!action) return null;
    const { button } = action;
    if (!button) return null;
    if (
      action.customVisibility !== undefined &&
      action.customVisibility() === CustomVisibilityState.Hidden
    )
      return null;

    return (
      <ToolbarButton
        text={buttonName}
        tooltip={buttonTooltip}
        icon={icon}
        iconOnly={button.iconOnly}
        active={active}
        {...props}
        onPress={triggerAction}
        disabled={disabled}
      />
    );
  },
);
