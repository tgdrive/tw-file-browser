import { memo, useEffect } from "react";
import { useDispatch } from "react-redux";

import { selectFileActionData } from "@/redux/selectors";
import { useParamSelector } from "@/redux/store";
import { thunkRequestFileAction } from "@/redux/thunks/dispatchers.thunks";
import type { FbDispatch } from "@/types/redux.types";

export interface HotkeyListenerProps {
  fileActionId: string;
}

/**
 * Parses a hotkey string like "ctrl+c" or "shift+alt+delete" and checks if the
 * given KeyboardEvent matches it.
 */
const matchHotkey = (hotkey: string, e: KeyboardEvent): boolean => {
  const parts = hotkey.toLowerCase().split("+");
  const key = parts.pop()!;

  // Handle special key names
  const normalizeKey = (k: string): string => {
    const map: Record<string, string> = {
      esc: "Escape",
      return: "Enter",
      enter: "Enter",
      tab: "Tab",
      space: " ",
      delete: "Delete",
      backspace: "Backspace",
      up: "ArrowUp",
      down: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight",
      pageup: "PageUp",
      pagedown: "PageDown",
      home: "Home",
      end: "End",
    };
    return map[k] ?? k;
  };

  return (
    normalizeKey(e.key.toLowerCase()) === key &&
    parts.includes("ctrl") === (e.ctrlKey || e.metaKey) &&
    parts.includes("shift") === e.shiftKey &&
    parts.includes("alt") === e.altKey &&
    parts.includes("meta") === e.metaKey
  );
};

export const HotkeyListener = memo(
  ({ fileActionId }: HotkeyListenerProps) => {
    const dispatch: FbDispatch = useDispatch();
    const fileAction = useParamSelector(selectFileActionData, fileActionId);

    useEffect(() => {
      if (
        !fileAction ||
        !fileAction.hotkeys ||
        fileAction.hotkeys.length === 0
      ) {
        return;
      }

      const handler = (e: KeyboardEvent) => {
        const matched = fileAction.hotkeys!.some((hotkey) =>
          matchHotkey(hotkey, e),
        );
        if (!matched) return;

        e.preventDefault();
        e.stopPropagation();
        dispatch(thunkRequestFileAction(fileAction, undefined));
      };

      window.addEventListener("keydown", handler, true);
      return () => window.removeEventListener("keydown", handler, true);
    }, [dispatch, fileAction]);

    return null;
  },
);
HotkeyListener.displayName = "HotkeyListener";
