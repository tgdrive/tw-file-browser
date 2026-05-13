import React, { memo, Key, useCallback, useState } from "react";
import { FileActionGroup } from "@/types/action-menus.types";
import { ToolbarButton, type ToolbarButtonProps } from "./toolbar-button";
import { Dropdown, Label } from "@heroui/react";
import { FbIcon } from "../shared/fb-icon";
import { useFileActionProps } from "@/util/file-actions";
import { useLocalizedFileActionStrings } from "@/util/i18n";
import { useLocalizedFileActionGroup } from "@/util/i18n";
import { useFbStore, useFbStoreApi, useShallow } from "@/store/store";

export type ToolbarDropdownProps = FileActionGroup;

const DropdownItemContent = memo(
  ({ fileActionId }: { fileActionId: string }) => {
    const action = useFbStore(useShallow((s) => s.state.fileActionMap[fileActionId]));
    const { icon } = useFileActionProps(fileActionId);
    const { buttonName } = useLocalizedFileActionStrings(action);

    if (!action?.button) return null;

    return (
      <Dropdown.Item id={fileActionId} textValue={buttonName}>
        {icon && <FbIcon icon={icon} className="size-4 shrink-0 text-muted" />}
        <Label>{buttonName}</Label>
      </Dropdown.Item>
    );
  },
);
DropdownItemContent.displayName = "DropdownItemContent";

export const ToolbarDropdown = memo((props: ToolbarDropdownProps) => {
  const { name, icon, fileActionIds, tooltip } = props;
  const [open, setOpen] = useState(false);
  const fileActionMap = useFbStore(useShallow((s) => s.state.fileActionMap));
  const storeApi = useFbStoreApi();
  const localizedName = useLocalizedFileActionGroup(name);

  const handleAction = useCallback(
    (key: Key) => {
      const fileAction = fileActionMap[key as string];
      if (fileAction) {
        storeApi.getState().actions.requestFileAction(fileAction, undefined);
      }
      setOpen(false);
    },
    [fileActionMap, storeApi],
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
