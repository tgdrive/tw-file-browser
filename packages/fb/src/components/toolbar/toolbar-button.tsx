import React, { memo } from "react";
import type { Nullable } from "@/util/ts-types";

import { FbIconName, CustomVisibilityState } from "@/util/enums";
import { useFbStore, useShallow } from "@/store/store";
import { useFileActionProps, useFileActionTrigger } from "@/util/file-actions";
import { useLocalizedFileActionStrings } from "@/util/i18n";
import { Button, type ButtonProps } from "@heroui/react";
import { FbIcon } from "../shared/fb-icon";
import clsx from "clsx";

export type ToolbarButtonProps = {
  className?: string;
  text: string;
  tooltip?: string;
  active?: boolean;
  icon?: Nullable<FbIconName | string>;
  iconOnly?: boolean;
  dropdown?: boolean;
  isDisabled?: boolean;
} & Omit<ButtonProps, "ref">;

export const ToolbarButton = memo(
  ({
    className,
    text,
    tooltip,
    active,
    icon,
    iconOnly,
    isDisabled,
    dropdown,
    ...props
  }: ToolbarButtonProps) => {
    const iconComponent =
      icon || iconOnly ? (
        <FbIcon
          icon={icon ? icon : FbIconName.fallbackIcon}
          fixedWidth={true}
        />
      ) : null;
    return (
      <Button
        variant="ghost"
        className={clsx(
          className,
        )}
        isDisabled={isDisabled}
        isIconOnly={iconOnly}
        aria-label={tooltip ? tooltip : text}
        {...props}
      >
        {dropdown && text && !iconOnly ? (
          <FbIcon icon={FbIconName.dropdown} fixedWidth={true} />
        ) : null}
        {iconOnly ? iconComponent : text ? <span>{text}</span> : null}
      </Button>
    );
  },
);

export interface SmartToolbarButtonProps {
  fileActionId: string;
  size?: ButtonProps["size"];
  className?: string;
}

export const SmartToolbarButton = memo(
  ({ fileActionId, ...props }: SmartToolbarButtonProps) => {
    const action = useFbStore(useShallow((s) => s.state.fileActionMap[fileActionId]));
    const triggerAction = useFileActionTrigger(fileActionId);
    const { icon, active, disabled } = useFileActionProps(fileActionId);
    const { actionName, actionTooltip } = useLocalizedFileActionStrings(action);

    if (!action) return null;
    const actionUi = action.ui;
    if (!actionUi) return null;
    if (
      action.customVisibility !== undefined &&
      action.customVisibility() === CustomVisibilityState.Hidden
    )
      return null;

    return (
      <ToolbarButton
        text={actionName}
        tooltip={actionTooltip}
        icon={icon}
        iconOnly={actionUi.iconOnly}
        active={active}
        {...props}
        onPress={triggerAction}
        isDisabled={disabled}
      />
    );
  },
);
