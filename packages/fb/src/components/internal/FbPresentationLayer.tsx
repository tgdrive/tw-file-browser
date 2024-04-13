import ClickAwayListener from "react-click-away-listener";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { reduxActions } from "@/redux/reducers";
import {
  selectClearSelectionOnOutsideClick,
  selectFileActionIds,
} from "@/redux/selectors";
import { FbDispatch } from "@/types/redux.types";
import { elementIsInsideButton } from "@/util/helpers";
import {
  useContextMenuTrigger,
  useContextMenuHandler,
} from "@/components/external/FileContextMenu-hooks";
import { HotkeyListener } from "./HotkeyListener";

export interface FbPresentationLayerProps {
  children?: React.ReactNode;
}

export const FbPresentationLayer = ({ children }: FbPresentationLayerProps) => {
  const dispatch: FbDispatch = useDispatch();
  const fileActionIds = useSelector(selectFileActionIds);
  const clearSelectionOnOutsideClick = useSelector(
    selectClearSelectionOnOutsideClick,
  );

  // Deal with clicks outside of Fb
  const handleClickAway = useCallback(
    (event: any) => {
      if (
        !clearSelectionOnOutsideClick ||
        elementIsInsideButton(event.target)
      ) {
        // We only clear out the selection on outside click if the click target
        // was not a button. We don't want to clear out the selection when a
        // button is clicked because Fb users might want to trigger some
        // selection-related action on that button click.
        return;
      }
      dispatch(reduxActions.clearSelection());
    },
    [dispatch, clearSelectionOnOutsideClick],
  );

  // Generate necessary components
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
  const {
    onTouchStart,
    onTouchMove,
    onTouchCancel,
    onTouchEnd,
    onContextMenu,
  } = useContextMenuHandler(showContextMenu);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div
        id="file-browser"
        className="flex flex-col text-left rounded-2xl size-full touch-manipulation select-none bg-surface"
        onContextMenu={onContextMenu}
        onTouchStart={onTouchStart}
        onTouchCancel={onTouchCancel}
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
      >
        {hotkeyListenerComponents}
        {children ? children : null}
      </div>
    </ClickAwayListener>
  );
};
