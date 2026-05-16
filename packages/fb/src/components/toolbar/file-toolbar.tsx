import React, { useMemo } from "react";
import { useFbStore } from "../../store/store";
import { SmartToolbarButton } from "./toolbar-button";
import { ToolbarDropdown } from "./toolbar-dropdown";
import { ToolbarInfo } from "./toolbar-info";
import clsx from "clsx";

interface FileToolbarProps {
  className?: string;
}

export const FileToolbar = ({ className }: FileToolbarProps) => {
  const toolbarItems = useFbStore((s) => s.state.toolbarItems);

  const toolbarItemComponents = useMemo(
    () =>
      toolbarItems.map((item) => {
        const key = `toolbar-item-${typeof item === "string" ? item : item.name}`;
        return typeof item === "string" ? (
          <SmartToolbarButton key={key} fileActionId={item} />
        ) : (
          <ToolbarDropdown key={key} {...item} />
        );
      }),
    [toolbarItems],
  );

  return (
    <div
      className={clsx("flex flex-wrap items-center gap-1 px-2 min-h-max", className)}
    >
      <ToolbarInfo />
      {toolbarItemComponents}
    </div>
  );
};
