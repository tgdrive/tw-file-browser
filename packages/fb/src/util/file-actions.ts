import { useCallback, useMemo } from "react";
import { Nullable } from "@/util/ts-types";

import { FbActions } from "@/action-definitions/index";
import { useFbStore, useFbStoreApi, useShallow } from "@/store/store";
import { FbIconName, CustomVisibilityState, SortOrder } from "@/util/enums";
import { FileHelper } from "./file-helper";

export const useFileActionTrigger = (fileActionId: string) => {
  const storeApi = useFbStoreApi();
  const fileAction = useFbStore(useShallow((s) => s.state.fileActionMap[fileActionId]));
  return useCallback(
    () => storeApi.getState().actions.requestFileAction(fileAction, undefined),
    [storeApi, fileAction],
  );
};

export const useFileActionProps = (
  fileActionId: string,
): {
  icon: Nullable<FbIconName | string>;
  active: boolean;
  disabled: boolean;
} => {
  const parentFolder = useFbStore((s) => {
    const fc = s.state.folderChain;
    return fc.length > 1 ? fc[fc.length - 2] : null;
  });
  const forceEnableOpenParent = useFbStore((s) => s.state.forceEnableOpenParent);
  const fileViewConfig = useFbStore(useShallow((s) => s.state.fileViewConfig));

  const sortActionId = useFbStore((s) => s.state.sortActionId);
  const sortOrder = useFbStore((s) => s.state.sortOrder);

  const action = useFbStore(useShallow((s) => s.state.fileActionMap[fileActionId]));
  const optionValue = useFbStore(
    (s) => s.state.optionMap[(action?.option?.id) as string],
  );

  const actionSelectionSize = useFbStore((s) => {
    const a = s.state.fileActionMap[fileActionId];
    if (!a || !a.requiresSelection) return undefined;
    const selectedFiles = Object.keys(s.state.selectionMap).map((id) => s.state.fileMap[id]);
    const filtered = a.fileFilter ? selectedFiles.filter(a.fileFilter) : selectedFiles;
    return filtered.length;
  });

  const actionSelectionEmpty = actionSelectionSize === 0;

  return useMemo(() => {
    if (!action) return { icon: null, active: false, disabled: true };

    let icon = action.button?.icon ?? null;
    if (action.sortKeySelector) {
      if (sortActionId === action.id) {
        if (sortOrder === SortOrder.ASC) {
          icon = action.button?.ascIcon || FbIconName.sortAsc;
        } else {
          icon = action.button?.descIcon || FbIconName.sortDesc;
        }
      } else {
        icon = FbIconName.placeholder;
      }
    } else if (action.option) {
      if (optionValue) {
        icon = FbIconName.toggleOn;
      } else {
        icon = FbIconName.toggleOff;
      }
    }

    const isSortButtonAndCurrentSort = action.id === sortActionId;
    const isFileViewButtonAndCurrentView =
      action.fileViewConfig === fileViewConfig;
    const isOptionAndEnabled = action.option ? !!optionValue : false;

    let customDisabled = false;
    let customActive = false;
    if (action.customVisibility !== undefined) {
      customDisabled =
        action.customVisibility() === CustomVisibilityState.Disabled;
      customActive = action.customVisibility() === CustomVisibilityState.Active;
    }
    const active =
      isSortButtonAndCurrentSort ||
      isFileViewButtonAndCurrentView ||
      isOptionAndEnabled ||
      customActive;

    let disabled: boolean =
      (!!action.requiresSelection && actionSelectionEmpty) || customDisabled;

    if (action.id === FbActions.OpenParentFolder.id) {
      // We treat `open_parent_folder` file action as a special case as it
      // requires the parent folder to be present to work, unless the
      // forceOpenParent prop is set, which forces the action to be available.
      disabled =
        disabled ||
        (!forceEnableOpenParent && !FileHelper.isOpenable(parentFolder));
    }

    return { icon, active, disabled };
  }, [
    parentFolder,
    fileViewConfig,
    sortActionId,
    sortOrder,
    action,
    optionValue,
    actionSelectionEmpty,
  ]);
};
