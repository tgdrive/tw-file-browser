import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Nullable } from "tsdef";

import { FbActions } from "@/action-definitions/index";
import {
  selectFileActionData,
  selectFileViewConfig,
  selectForceEnableOpenParent,
  selectOptionValue,
  selectParentFolder,
  selectSelectedFilesForActionCount,
  selectSortActionId,
  selectSortOrder,
} from "@/redux/selectors";
import { useParamSelector } from "@/redux/store";
import { thunkRequestFileAction } from "@/redux/thunks/dispatchers.thunks";
import { FbIconName, CustomVisibilityState, SortOrder } from "@/util/enums";
import { FileHelper } from "./file-helper";

export const useFileActionTrigger = (fileActionId: string) => {
  const dispatch: any = useDispatch();
  const fileAction = useParamSelector(selectFileActionData, fileActionId);
  return useCallback(
    () => dispatch(thunkRequestFileAction(fileAction, undefined)),
    [dispatch, fileAction],
  );
};

export const useFileActionProps = (
  fileActionId: string,
): {
  icon: Nullable<FbIconName | string>;
  active: boolean;
  disabled: boolean;
} => {
  const parentFolder = useSelector(selectParentFolder);
  const forceEnableOpenParent = useSelector(selectForceEnableOpenParent);
  const fileViewConfig = useSelector(selectFileViewConfig);

  const sortActionId = useSelector(selectSortActionId);
  const sortOrder = useSelector(selectSortOrder);

  const action = useParamSelector(selectFileActionData, fileActionId);
  // @ts-ignore
  const optionValue = useParamSelector(selectOptionValue, action?.option?.id);

  const actionSelectionSize = useParamSelector(
    selectSelectedFilesForActionCount,
    fileActionId,
  );

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
