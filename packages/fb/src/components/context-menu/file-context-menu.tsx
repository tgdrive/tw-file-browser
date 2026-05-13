import React, { memo, useEffect, useMemo } from "react";

import { useFbStore, useFbStoreApi, useShallow } from "@/store/store";
import { useContextMenuDismisser } from "./file-context-menu.hooks";
import { Dropdown, Label, Kbd } from "@heroui/react";
import { useFileActionProps } from "@/util/file-actions";
import { useLocalizedFileActionStrings } from "@/util/i18n";
import { FbIcon } from "../shared/fb-icon";

const ContextMenuItemContent = memo(
  ({ fileActionId }: { fileActionId: string }) => {
    const action = useFbStore((s) => s.state.fileActionMap[fileActionId]);
    const { icon } = useFileActionProps(fileActionId);
    const { actionName } = useLocalizedFileActionStrings(action);
    const hotkey = action?.hotkeys?.[0];

    const ui = action?.ui;
    if (!ui?.contextMenu) return null;

    return (
      <Dropdown.Item id={fileActionId} textValue={actionName}>
        {icon && <FbIcon icon={icon} className="size-4 shrink-0 text-muted" />}
        <Label>{actionName}</Label>
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
  const storeApi = useFbStoreApi();
  const hideContextMenu = useContextMenuDismisser();
  const fileActionMap = useFbStore(useShallow((s) => s.state.fileActionMap));

  useEffect(() => {
    storeApi.getState().actions.setContextMenuMounted(true);
    return () => {
      storeApi.getState().actions.setContextMenuMounted(false);
    };
  }, [storeApi]);

  const contextMenuConfig = useFbStore((s) => s.state.contextMenuConfig);
  const contextMenuItems = useFbStore(useShallow((s) => s.state.contextMenuItems));

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
      storeApi.getState().actions.requestFileAction(fileAction, undefined);
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
