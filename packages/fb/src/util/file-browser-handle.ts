import React, { useImperativeHandle } from "react";

import { useFbStoreApi } from "@/store/store";
import { FileAction } from "@/types/action.types";
import { FileBrowserHandle } from "@/types/file-browser.types";

export const useFileBrowserHandle = (ref: React.Ref<FileBrowserHandle>) => {
  const storeApi = useFbStoreApi();

  useImperativeHandle(
    ref,
    () => ({
      getFileSelection(): Set<string> {
        const selectionMap = storeApi.getState().state.selectionMap;
        const selectionSet = new Set(Object.keys(selectionMap));
        return selectionSet;
      },
      setFileSelection(selection, reset = true): void {
        const fileIds = Array.from(selection);
        storeApi.getState().actions.selectFiles({ fileIds, reset });
      },
      async requestFileAction<Action extends FileAction>(
        action: Action,
        payload: Action["__payloadType"],
      ): Promise<void> {
        return Promise.resolve(
          storeApi.getState().actions.requestFileAction(action, payload),
        );
      },
    }),
    [storeApi],
  );
};
