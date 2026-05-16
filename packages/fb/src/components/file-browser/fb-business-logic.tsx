import React, { useEffect } from "react";
import deepmerge from "deepmerge";
import { useFbStoreApi } from "../../store/store";
import type { FileBrowserHandle, FileBrowserProps } from "../../types/file-browser.types";
import { defaultConfig } from "../../util/default-config";
import { getValueOrFallback } from "../../util/helpers";
import { useFileBrowserHandle } from "../../util/file-browser-handle";

const useStoreEffect = (action: (api: ReturnType<typeof useFbStoreApi>) => void, deps: any[]) => {
  const store = useFbStoreApi();
  useEffect(() => {
    action(store);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, ...deps]);
};

export const FbBusinessLogicInner = React.memo(
  React.forwardRef<FileBrowserHandle, FileBrowserProps>((props, ref) => {
    const store = useFbStoreApi();

    useStoreEffect(
      (s) =>
        s.getState().actions.setFileActionGroup(
          deepmerge(props.fileActionGroups!, defaultConfig.fileActionGroups!),
        ),
      [props.fileActionGroups],
    );

    useStoreEffect(
      (s) =>
        s.getState().actions.setRawFiles(
          props.files ?? [],
        ),
      [props.files],
    );

    useStoreEffect(
      (s) => s.getState().actions.setRawFolderChain(props.folderChain),
      [props.folderChain],
    );

    useStoreEffect(
      (s) =>
        s.getState().actions.updateRawFileActions(
          getValueOrFallback(props.fileActions, defaultConfig.fileActions),
          props.breakpoint,
          getValueOrFallback(
            props.disableDefaultFileActions,
            defaultConfig.disableDefaultFileActions,
          ),
          getValueOrFallback(
            props.disableEssentailFileActions,
            defaultConfig.disableEssentailFileActions,
          ),
        ),
      [
        props.fileActions,
        props.breakpoint,
        props.disableDefaultFileActions,
        props.disableEssentailFileActions,
      ],
    );

    useStoreEffect(
      (s) =>
        s.getState().actions.setExternalFileActionHandler(
          getValueOrFallback(props.onFileAction, defaultConfig.onFileAction) as any,
        ),
      [props.onFileAction],
    );

    useStoreEffect(
      (s) =>
        s.getState().actions.setSelectionDisabled(
          getValueOrFallback(
            props.disableSelection,
            defaultConfig.disableSelection,
            "boolean",
          ),
        ),
      [props.disableSelection],
    );

    useStoreEffect(
      (s) =>
        s.getState().actions.activateSortAction(
          getValueOrFallback(
            props.defaultSortActionId,
            defaultConfig.defaultSortActionId,
          ),
          getValueOrFallback(
            props.defaultSortOrder,
            defaultConfig.defaultSortOrder,
          ),
        ),
      [props.defaultSortActionId, props.defaultSortOrder],
    );

    useStoreEffect(
      (s) =>
        s.getState().actions.updateDefaultFileViewActionId(
          getValueOrFallback(
            props.defaultFileViewActionId,
            defaultConfig.defaultFileViewActionId,
            "string",
          ),
        ),
      [props.defaultFileViewActionId],
    );

    useStoreEffect(
      (s) =>
        s.getState().actions.setThumbnailGenerator(
          getValueOrFallback(
            props.thumbnailGenerator,
            defaultConfig.thumbnailGenerator,
          ),
        ),
      [props.thumbnailGenerator],
    );

    useStoreEffect(
      (s) =>
        s.getState().actions.setDoubleClickDelay(
          getValueOrFallback(
            props.doubleClickDelay,
            defaultConfig.doubleClickDelay,
            "number",
          ),
        ),
      [props.doubleClickDelay],
    );

    useStoreEffect(
      (s) =>
        s.getState().actions.setForceEnableOpenParent(
          getValueOrFallback(
            props.forceEnableOpenParent,
            defaultConfig.forceEnableOpenParent,
            "boolean",
          ),
        ),
      [props.forceEnableOpenParent],
    );

    useStoreEffect(
      (s) =>
        s.getState().actions.setHideToolbarInfo(
          getValueOrFallback(
            props.hideToolbarInfo,
            defaultConfig.hideToolbarInfo,
            "boolean",
          ),
        ),
      [props.hideToolbarInfo],
    );

    useStoreEffect(
      (s) =>
        s.getState().actions.setClearSelectionOnOutsideClick(
          getValueOrFallback(
            props.clearSelectionOnOutsideClick,
            defaultConfig.clearSelectionOnOutsideClick,
            "boolean",
          ),
        ),
      [props.clearSelectionOnOutsideClick],
    );

    // Setup imperative handle
    useFileBrowserHandle(ref);

    return null;
  }),
);
FbBusinessLogicInner.displayName = "FbBusinessLogicInner";

export const FbBusinessLogic = React.memo(FbBusinessLogicInner);
FbBusinessLogic.displayName = "FbBusinessLogic";
