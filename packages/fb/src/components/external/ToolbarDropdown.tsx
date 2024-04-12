import React, { useCallback, useMemo, useState } from "react";
import { FileActionGroup } from "@/types/action-menus.types";
import { useLocalizedFileActionGroup } from "@/util/i18n";
import { ToolbarButton, ToolbarButtonProps } from "./ToolbarButton";
import { SmartToolbarDropdownButton } from "./ToolbarDropdownButton";
import { Popover, PopoverTrigger, PopoverContent } from "@tw-material/react";
import { FocusScope } from "@react-aria/focus";

export type ToolbarDropdownProps = FileActionGroup;

export const ToolbarDropdown = React.memo((props: ToolbarDropdownProps) => {
  const { name, icon, fileActionIds, tooltip } = props;

  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  const menuItemComponents = useMemo(
    () =>
      fileActionIds.map((id) => (
        <SmartToolbarDropdownButton
          onClickFollowUp={close}
          fileActionId={id}
          key={`menu-item-${id}`}
          dropdown
        />
      )),
    [fileActionIds],
  );

  const localizedName = useLocalizedFileActionGroup(name);
  const toolbarButtonProps: ToolbarButtonProps = {
    text: localizedName,
    dropdown: true,
    tooltip,
  };
  if (icon) {
    toolbarButtonProps.icon = icon;
    toolbarButtonProps.iconOnly = true;
    toolbarButtonProps.text = "";
  }

  return (
    <Popover
      onOpenChange={(open) => setOpen(open)}
      isOpen={open}
      placement="bottom-end"
    >
      <PopoverTrigger>
        <ToolbarButton {...toolbarButtonProps} />
      </PopoverTrigger>
      <PopoverContent className="w-full relative flex flex-col gap-1 p-1 bg-surface-container text-on-surface rounded-lg">
        <FocusScope contain restoreFocus>
          {menuItemComponents}
        </FocusScope>
      </PopoverContent>
    </Popover>
  );
});
