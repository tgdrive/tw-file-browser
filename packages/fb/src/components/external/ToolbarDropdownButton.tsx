import React, { useCallback } from "react";
import { Nullable } from "tsdef";

import { selectFileActionData } from "@/redux/selectors";
import { useParamSelector } from "@/redux/store";
import { FbIconName, CustomVisibilityState } from "@/util/enums";
import { useFileActionProps, useFileActionTrigger } from "@/util/file-actions";
import { useLocalizedFileActionStrings } from "@/util/i18n";
import { FbIcon } from "./FbIcon";
import clsx from "clsx";

type ToolbarDropdownButtonProps = {
  text: string;
  active?: boolean;
  icon?: Nullable<FbIconName | string>;
  onClick?: () => void;
  disabled?: boolean;
  iconOnly?: boolean;
  hotkey?: string;
};

export const ToolbarDropdownButton = (props: ToolbarDropdownButtonProps) => {
  const { text, active, icon, onClick, hotkey, disabled } = props;

  return (
    <div
      className={clsx(
        "text-inherit cursor-pointer w-full flex items-center",
        "p-2 max-h-8 rounded-lg hover:bg-default outline-none",
        active && "text-accent",
        disabled && "opacity-disabled pointer-events-none",
      )}
      role="menuitem"
      tabIndex={-1}
      onClick={onClick}
    >
      {icon && <FbIcon icon={icon} className="mr-2 size-4" />}
      <span className="flex-1 text-medium"> {text}</span>
      {hotkey && <span className="capitalize text-xs ml-12">{hotkey}</span>}
    </div>
  );
};

type SmartToolbarDropdownButtonProps = {
  fileActionId: string;
  onClickFollowUp?: () => void;
  dropdown?: boolean;
};

export const SmartToolbarDropdownButton = (
  props: SmartToolbarDropdownButtonProps,
) => {
  const { fileActionId, onClickFollowUp, dropdown } = props;

  const action = useParamSelector(selectFileActionData, fileActionId);
  const triggerAction = useFileActionTrigger(fileActionId);
  const { icon, active, disabled } = useFileActionProps(fileActionId);
  const { buttonName } = useLocalizedFileActionStrings(action);

  const handleClick = useCallback(() => {
    triggerAction();
    onClickFollowUp?.();
  }, [triggerAction]);

  if (!action) return null;
  const { button } = action;
  if (!button) return null;
  if (
    (action.customVisibility !== undefined &&
      action.customVisibility() === CustomVisibilityState.Hidden) ||
    (disabled && !dropdown)
  )
    return null;

  return (
    <ToolbarDropdownButton
      text={buttonName}
      icon={icon}
      iconOnly={button.iconOnly}
      onClick={handleClick}
      active={active}
      hotkey={!dropdown ? action.hotkeys?.[0] : ""}
      disabled={disabled}
    />
  );
};
