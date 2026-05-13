import React, { memo, Key, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileActionGroup } from "@/types/action-menus.types";
import { ToolbarButton, type ToolbarButtonProps } from "./toolbar-button";
import { Dropdown, Label, Kbd } from "@heroui/react";
import { FbIcon } from "../shared/fb-icon";
import { useFileActionProps } from "@/util/file-actions";
import { useLocalizedFileActionStrings } from "@/util/i18n";
import { useParamSelector } from "@/redux/store";
import {
  selectFileActionData,
  selectFileActionMap,
} from "@/redux/selectors";
import { thunkRequestFileAction } from "@/redux/thunks/dispatchers.thunks";
import type { FbDispatch } from "@/types/redux.types";
import { useLocalizedFileActionGroup } from "@/util/i18n";

export type ToolbarDropdownProps = FileActionGroup;

// Internal item renderer that shows icon + label + hotkey for a file action
const DropdownItemContent = memo(
  ({ fileActionId }: { fileActionId: string }) => {
    const action = useParamSelector(selectFileActionData, fileActionId);
    const { icon } = useFileActionProps(fileActionId);
    const { buttonName } = useLocalizedFileActionStrings(action);
    const hotkey = action?.hotkeys?.[0];

    if (!action?.button) return null;

    return (
      <Dropdown.Item id={fileActionId} textValue={buttonName}>
        {icon && <FbIcon icon={icon} className="size-4 shrink-0 text-muted" />}
        <Label>{buttonName}</Label>
        {hotkey && (
          <Kbd className="ms-auto" slot="keyboard" variant="light">
            <Kbd.Content>{hotkey}</Kbd.Content>
          </Kbd>
        )}
      </Dropdown.Item>
    );
  },
);
DropdownItemContent.displayName = "DropdownItemContent";

export const ToolbarDropdown = memo((props: ToolbarDropdownProps) => {
  const { name, icon, fileActionIds, tooltip } = props;
  const [open, setOpen] = useState(false);
  const dispatch: FbDispatch = useDispatch();
  const fileActionMap = useSelector(selectFileActionMap);
  const localizedName = useLocalizedFileActionGroup(name);

  // When user selects an item, dispatch its file action by looking up the action map
  const handleAction = useCallback(
    (key: Key) => {
      const fileAction = fileActionMap[key as string];
      if (fileAction) {
        dispatch(thunkRequestFileAction(fileAction, undefined));
      }
      setOpen(false);
    },
    [dispatch, fileActionMap],
  );

  const triggerProps: ToolbarButtonProps = {
    text: localizedName,
    dropdown: true,
    tooltip,
    icon: icon ?? undefined,
    iconOnly: !!icon,
  };

  return (
    <Dropdown isOpen={open} onOpenChange={setOpen}>
      <ToolbarButton {...triggerProps} />
      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu
          onAction={handleAction}
          aria-label={name}
          className="min-w-[180px]"
        >
          {fileActionIds.map((id) => (
            <DropdownItemContent key={id} fileActionId={id} />
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
});
ToolbarDropdown.displayName = "ToolbarDropdown";
