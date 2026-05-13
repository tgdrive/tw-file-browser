import React, { memo, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { reduxActions } from "@/redux/reducers";
import {
  selectContextMenuConfig,
  selectContextMenuItems,
  selectFileActionMap,
} from "@/redux/selectors";

import { useContextMenuDismisser } from "./file-context-menu.hooks";
import type { FbDispatch } from "@/types/redux.types";
import { Dropdown, Label, Kbd } from "@heroui/react";
import { useFileActionProps } from "@/util/file-actions";
import { useLocalizedFileActionStrings } from "@/util/i18n";
import { useParamSelector } from "@/redux/store";
import { selectFileActionData } from "@/redux/selectors";
import { thunkRequestFileAction } from "@/redux/thunks/dispatchers.thunks";
import { FbIcon } from "../shared/fb-icon";

const ContextMenuItemContent = memo(
  ({ fileActionId }: { fileActionId: string }) => {
    const action = useParamSelector(selectFileActionData, fileActionId);
    const { icon } = useFileActionProps(fileActionId);
    const { buttonName } = useLocalizedFileActionStrings(action);
    const hotkey = action?.hotkeys?.[0];

    if (!action?.button?.contextMenu) return null;

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
ContextMenuItemContent.displayName = "ContextMenuItemContent";

export const FileContextMenu = memo(() => {
  const dispatch: FbDispatch = useDispatch();
  const hideContextMenu = useContextMenuDismisser();
  const fileActionMap = useSelector(selectFileActionMap);

  useEffect(() => {
    dispatch(reduxActions.setContextMenuMounted(true));
    return () => {
      dispatch(reduxActions.setContextMenuMounted(false));
    };
  }, [dispatch]);

  const contextMenuConfig = useSelector(selectContextMenuConfig);
  const contextMenuItems = useSelector(selectContextMenuItems);

  const anchorPosition = useMemo(
    () =>
      contextMenuConfig
        ? { top: contextMenuConfig.mouseY, left: contextMenuConfig.mouseX }
        : undefined,
    [contextMenuConfig],
  );

  // Flatten menu items into a single list of action IDs
  const menuActionIds = useMemo(() => {
    const ids: string[] = [];
    for (const item of contextMenuItems) {
      if (typeof item === "string") {
        ids.push(item);
      } else {
        ids.push(...item.fileActionIds);
      }
    }
    return ids;
  }, [contextMenuItems]);

  // Handle item activation: dispatch action + close menu
  const handleAction = (key: React.Key) => {
    const fileAction = fileActionMap[key as string];
    if (fileAction) {
      dispatch(thunkRequestFileAction(fileAction, undefined));
    }
    hideContextMenu();
  };

  if (!contextMenuConfig) return null;

  return (
    <Dropdown
      isOpen={!!anchorPosition}
      onOpenChange={(open) => {
        if (!open) hideContextMenu();
      }}
    >
      <Dropdown.Trigger
       className="opacity-0 size-0 fixed"
       style={{top: anchorPosition?.top || 0, left: anchorPosition?.left || 0}}/>
      <Dropdown.Popover
        placement="bottom start"
        className="min-w-45 min-h-fit"
      >
        <Dropdown.Menu
          onAction={handleAction}
          aria-label="Context menu"
          className="p-1"
        >
          {menuActionIds.map((id) => (
            <ContextMenuItemContent key={id} fileActionId={id} />
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
      </Dropdown>
  );
});
FileContextMenu.displayName = "FileContextMenu";
