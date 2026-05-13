import { type ReactNode, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useInteractOutside,
  useKeyboard,
} from "@react-aria/interactions";

import { reduxActions } from "@/redux/reducers";
import {
  selectClearSelectionOnOutsideClick,
  selectFileActionIds,
  selectFileActionMap,
} from "@/redux/selectors";
import type { FbDispatch } from "@/types/redux.types";
import { elementIsInsideButton } from "@/util/helpers";
import { useContextMenuTrigger } from "@/components/context-menu/file-context-menu.hooks";
import { thunkRequestFileAction } from "@/redux/thunks/dispatchers.thunks";
import React from "react";

export interface FbPresentationLayerProps {
  children?: ReactNode;
}

export const FbPresentationLayer = ({
  children,
}: FbPresentationLayerProps) => {
  const dispatch: FbDispatch = useDispatch();
  const fileActionIds = useSelector(selectFileActionIds);
  const fileActionMap = useSelector(selectFileActionMap);
  const clearSelectionOnOutsideClick = useSelector(
    selectClearSelectionOnOutsideClick,
  );

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Click-away handling via RAC hook
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

  // Centralized keyboard hotkey handling via RAC hook
  const { keyboardProps } = useKeyboard({
    onKeyDown: useCallback(
      (e) => {
        for (const id of fileActionIds) {
          const action = fileActionMap[id];
          if (!action?.hotkeys?.length) continue;

          const matched = action.hotkeys.some((hotkey) => {
            const parts = hotkey.toLowerCase().split("+");
            const key = parts.pop()!;
            const normalizeKey = (k: string): string => {
              const map: Record<string, string> = {
                esc: "Escape",
                return: "Enter",
                enter: "Enter",
                space: " ",
                delete: "Delete",
                backspace: "Backspace",
                up: "ArrowUp",
                down: "ArrowDown",
                left: "ArrowLeft",
                right: "ArrowRight",
              };
              return map[k] ?? k;
            };
            return (
              normalizeKey(e.key.toLowerCase()) === key &&
              parts.includes("ctrl") === (e.ctrlKey || e.metaKey) &&
              parts.includes("shift") === e.shiftKey &&
              parts.includes("alt") === e.altKey
            );
          });

          if (matched) {
            e.preventDefault();
            e.stopPropagation();
            dispatch(thunkRequestFileAction(action, undefined));
            return;
          }
        }
      },
      [dispatch, fileActionIds, fileActionMap],
    ),
  });

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
      {...keyboardProps}
    >
      {children ? children : null}
    </div>
  );
};
