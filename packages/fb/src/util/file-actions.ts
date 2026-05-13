import { useCallback, useMemo } from "react";
import { Nullable } from "@/util/ts-types";

import { FbActions } from "@/action-definitions/index";
import { useFbStore, useFbStoreApi, useShallow } from "@/store/store";
import { FbIconName, CustomVisibilityState, SortOrder } from "@/util/enums";
import { FileHelper } from "./file-helper";

const getActionUi = (action: any) => action?.ui;
const getOptionStep = (action: any) => action?.steps?.find((s: any) => s.type === "toggle-option");
const getViewStep = (action: any) => action?.steps?.find((s: any) => s.type === "set-view");
const getSortStep = (action: any) => action?.steps?.find((s: any) => s.type === "sort");

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
  const optionId = getOptionStep(action)?.optionId as string | undefined;
  const optionValue = useFbStore((s) => (optionId ? s.state.optionMap[optionId] : undefined));

  const actionSelectionSize = useFbStore((s) => {
    const a = s.state.fileActionMap[fileActionId];
    if (!a?.target) return undefined;
    const selectedFiles = Object.keys(s.state.selectionMap).map((id) => s.state.fileMap[id]);
    const triggerFileId = s.state.contextMenuConfig?.triggerFileId ?? null;
    const triggerFile = triggerFileId ? s.state.fileMap[triggerFileId] ?? null : null;
    let targetFiles = selectedFiles;
    if (a.target.source === "context-item") targetFiles = triggerFile ? [triggerFile] : [];
    else if (a.target.source === "selection-or-context-item") targetFiles = selectedFiles.length > 0 ? selectedFiles : (triggerFile ? [triggerFile] : []);
    else if (a.target.source === "none") targetFiles = [];
    const filtered = a.target.filter ? targetFiles.filter(a.target.filter) : targetFiles;
    return filtered.length;
  });

  const actionSelectionEmpty = actionSelectionSize === 0;

  return useMemo(() => {
    if (!action) return { icon: null, active: false, disabled: true };

    const ui = getActionUi(action);
    let icon = ui?.icon ?? null;
    const sortStep = getSortStep(action);
    if (sortStep) {
      if (sortActionId === action.id) {
        if (sortOrder === SortOrder.ASC) {
          icon = ui?.ascIcon || FbIconName.sortAsc;
        } else {
          icon = ui?.descIcon || FbIconName.sortDesc;
        }
      } else {
        icon = FbIconName.placeholder;
      }
    } else if (optionId) {
      if (optionValue) {
        icon = FbIconName.toggleOn;
      } else {
        icon = FbIconName.toggleOff;
      }
    }

    const isSortButtonAndCurrentSort = action.id === sortActionId;
    const viewStep = getViewStep(action);
    const isFileViewButtonAndCurrentView = !!viewStep && viewStep.config.mode === fileViewConfig.mode;
    const isOptionAndEnabled = optionId ? !!optionValue : false;

    let customDisabled = false;
    let customActive = false;
    if (action.customVisibility !== undefined) {
      customDisabled =
        action.customVisibility() === CustomVisibilityState.Disabled;
      customActive = action.customVisibility() === CustomVisibilityState.Active;
    }
    const active =
      (!!sortStep && isSortButtonAndCurrentSort) ||
      isFileViewButtonAndCurrentView ||
      isOptionAndEnabled ||
      customActive;

    const minTarget = action.target?.min ?? 0;
    let disabled: boolean =
      (minTarget > 0 && actionSelectionEmpty) || customDisabled;

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
