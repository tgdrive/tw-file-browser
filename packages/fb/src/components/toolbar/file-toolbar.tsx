import React, { type ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";

import { selectToolbarItems } from "@/redux/selectors";
import { SmartToolbarButton } from "./toolbar-button";
import { ToolbarDropdown } from "./toolbar-dropdown";
import { ToolbarInfo } from "./toolbar-info";
import { Toolbar as HeroToolbar } from "@heroui/react";
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
    <HeroToolbar
      className={clsx("px-2 min-h-max flex items-center", className)}
    >
      <ToolbarInfo />
      {toolbarItemComponents}
    </HeroToolbar>
  );
};
