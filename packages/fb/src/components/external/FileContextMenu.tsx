import React, { ReactElement, useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";

import { reduxActions } from "@/redux/reducers";
import {
  selectContextMenuConfig,
  selectContextMenuItems,
} from "@/redux/selectors";

import { useContextMenuDismisser } from "./FileContextMenu-hooks";
import { SmartToolbarDropdownButton } from "./ToolbarDropdownButton";
import { FbDispatch } from "@/types/redux.types";
import { Popover, PopoverContent } from "./Popover";

export const FileContextMenu = React.memo(() => {
  const dispatch: FbDispatch = useDispatch();
  useEffect(() => {
    dispatch(reduxActions.setContextMenuMounted(true));
    return () => {
      dispatch(reduxActions.setContextMenuMounted(false));
    };
  }, [dispatch]);

  const intl = useIntl();

  const contextMenuConfig = useSelector(selectContextMenuConfig);
  const contextMenuItems = useSelector(selectContextMenuItems);

  const hideContextMenu = useContextMenuDismisser();
  const contextMenuItemComponents = useMemo(() => {
    const components: ReactElement[] = [];
    for (let i = 0; i < contextMenuItems.length; ++i) {
      const item = contextMenuItems[i];

      if (typeof item === "string") {
        components.push(
          <SmartToolbarDropdownButton
            key={`context-menu-item-${item}`}
            fileActionId={item}
            onClickFollowUp={hideContextMenu}
          />,
        );
      } else {
        item.fileActionIds.map((id) =>
          components.push(
            <SmartToolbarDropdownButton
              key={`context-menu-item-${item.name}-${id}`}
              fileActionId={id}
              onClickFollowUp={hideContextMenu}
            />,
          ),
        );
      }
    }
    return components;
  }, [contextMenuItems, hideContextMenu]);

  const anchorPosition = useMemo(
    () =>
      contextMenuConfig
        ? { top: contextMenuConfig.mouseY, left: contextMenuConfig.mouseX }
        : undefined,
    [contextMenuConfig],
  );

  return (
    <Popover
      onClose={hideContextMenu}
      isOpen={!!contextMenuConfig}
      triggerReference="virtualEl"
      triggerPosition={anchorPosition}
    >
      <PopoverContent>
        <div
          className="w-full relative flex flex-col gap-1 p-1 bg-surface-container-low text-on-surface
           rounded-lg shadow-1"
        >
          {contextMenuItemComponents}
        </div>
      </PopoverContent>
    </Popover>
  );
});
