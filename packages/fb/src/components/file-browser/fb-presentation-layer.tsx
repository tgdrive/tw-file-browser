import { type ReactNode, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInteractOutside } from "@react-aria/interactions";

import { reduxActions } from "@/redux/reducers";
import {
  selectClearSelectionOnOutsideClick,
  selectFileActionIds,
} from "@/redux/selectors";
import type { FbDispatch } from "@/types/redux.types";
import { elementIsInsideButton } from "@/util/helpers";
import { useContextMenuTrigger } from "@/components/context-menu/file-context-menu.hooks";
import { HotkeyListener } from "../shared/hotkey-listener";
import React from "react";

export interface FbPresentationLayerProps {
  children?: ReactNode;
}

export const FbPresentationLayer = ({
  children,
}: FbPresentationLayerProps) => {
  const dispatch: FbDispatch = useDispatch();
  const fileActionIds = useSelector(selectFileActionIds);
  const clearSelectionOnOutsideClick = useSelector(
    selectClearSelectionOnOutsideClick,
  );

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Replace react-click-away-listener with RAC useInteractOutside
  useInteractOutside({
    ref: containerRef,
    onInteractOutside: useCallback(
      (e: any) => {
        if (
          !clearSelectionOnOutsideClick ||
          elementIsInsideButton(e.target)
        ) {
          return;
        }
        dispatch(reduxActions.clearSelection());
      },
      [dispatch, clearSelectionOnOutsideClick],
    ),
  });

  const hotkeyListenerComponents = useMemo(
    () =>
      fileActionIds.map((actionId) => (
        <HotkeyListener
          key={`file-action-listener-${actionId}`}
          fileActionId={actionId}
        />
      )),
    [fileActionIds],
  );

  const showContextMenu = useContextMenuTrigger();

  const onContextMenu = useCallback(
    (e: any) => {
      e.stopPropagation();
      showContextMenu(e);
      e.preventDefault();
    },
    [showContextMenu],
  );

  return (
    <div
      id="file-browser"
      ref={containerRef}
      className="flex flex-col text-left rounded-2xl size-full touch-manipulation select-none bg-surface"
      onContextMenu={onContextMenu}
    >
      {hotkeyListenerComponents}
      {children ? children : null}
    </div>
  );
};
