import { useCallback } from "react";
import { useFbStore, useFbStoreApi } from "../../store/store";
import { FbActions } from "../../action-definitions/index";

export const useContextMenuTrigger = () => {
  const contextMenuMounted = useFbStore((s) => s.state.contextMenuMounted);
  const storeApi = useFbStoreApi();
  return useCallback(
    (event: PointerEvent) => {
      if (!contextMenuMounted) return;
      storeApi.getState().actions.requestFileAction(
        FbActions.OpenFileContextMenu,
        {
          clientX: event.clientX,
          clientY: event.clientY,
          triggerFileId: null,
        },
      );
    },
    [contextMenuMounted, storeApi],
  );
};

export const useContextMenuDismisser = () => {
  const storeApi = useFbStoreApi();
  return useCallback(
    () => storeApi.getState().actions.hideContextMenu(),
    [storeApi],
  );
};
