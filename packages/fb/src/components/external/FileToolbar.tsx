import React, { ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";

import { selectToolbarItems } from "@/redux/selectors";
import { SmartToolbarButton } from "./ToolbarButton";
import { ToolbarDropdown } from "./ToolbarDropdown";
import { ToolbarInfo } from "./ToolbarInfo";
import clsx from "clsx";

interface FileToolbarProps {
  className?: string;
}

export const FileToolbar = ({ className }: FileToolbarProps) => {
  const toolbarItems = useSelector(selectToolbarItems);

  const toolbarItemComponents = useMemo(() => {
    const components: ReactElement[] = [];
    for (let i = 0; i < toolbarItems.length; ++i) {
      const item = toolbarItems[i];

      const key = `toolbar-item-${typeof item === "string" ? item : item.name}`;
      const component =
        typeof item === "string" ? (
          <SmartToolbarButton key={key} fileActionId={item} />
        ) : (
          <ToolbarDropdown key={key} {...item} />
        );
      components.push(component);
    }
    return components;
  }, [toolbarItems]);
  return (
    <div className={clsx("flex items-center px-2 min-h-max", className)}>
      <div className="flex flex-wrap">
        <ToolbarInfo />
        {toolbarItemComponents}
      </div>
    </div>
  );
};
