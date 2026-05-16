import { type ReactNode, useCallback, useRef } from "react";
import {
  useInteractOutside,
  useKeyboard,
} from "@react-aria/interactions";

import { useFbStore, useFbStoreApi, useShallow } from "../../store/store";
import { elementIsInsideButton } from "../../util/helpers";
import { useContextMenuTrigger } from "../context-menu/file-context-menu.hooks";
import React from "react";

export interface FbPresentationLayerProps {
  children?: ReactNode;
}

export const FbPresentationLayer = ({
  children,
}: FbPresentationLayerProps) => {
  const storeApi = useFbStoreApi();
  const clearSelectionOnOutsideClick = useFbStore(
    (s) => s.state.clearSelectionOnOutsideClick,
  );
  const fileActionIds = useFbStore(useShallow((s) => s.state.fileActionIds));
  const fileActionMap = useFbStore(useShallow((s) => s.state.fileActionMap));

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
        storeApi.getState().actions.clearSelection();
      },
      [clearSelectionOnOutsideClick, storeApi],
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
            const state = storeApi.getState().state;
            const selectedFiles = Object.keys(state.selectionMap).map((fid) => state.fileMap[fid]).filter(Boolean);
            const triggerFileId = state.contextMenuConfig?.triggerFileId ?? null;
            const triggerFile = triggerFileId ? state.fileMap[triggerFileId] ?? null : null;
            let targetFiles = selectedFiles;
            if (action.target?.source === "context-item") targetFiles = triggerFile ? [triggerFile] : [];
            else if (action.target?.source === "selection-or-context-item") targetFiles = selectedFiles.length > 0 ? selectedFiles : (triggerFile ? [triggerFile] : []);
            else if (action.target?.source === "none") targetFiles = [];
            const filteredTargets = action.target?.filter ? targetFiles.filter(action.target.filter) : targetFiles;
            const minTarget = action.target?.min ?? 0;
            if (minTarget > 0 && filteredTargets.length < minTarget) return;
            storeApi.getState().actions.requestFileAction(action, undefined);
            return;
          }
        }
      },
      [fileActionIds, fileActionMap, storeApi],
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
