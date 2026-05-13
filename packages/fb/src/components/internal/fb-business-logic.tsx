import React from "react";

import { reduxActions } from "@/redux/reducers";
import { initialRootState } from "@/redux/state";
import { useDTE, usePropReduxUpdate } from "@/redux/store";
import {
	thunkActivateSortAction,
	thunkUpdateDefaultFileViewActionId,
	thunkUpdateRawFileActions,
} from "@/redux/thunks/file-actions.thunks";
import type {
	FileBrowserHandle,
	FileBrowserProps,
} from "@/types/file-browser.types";
import { defaultConfig } from "@/util/default-config";
import { useFileBrowserHandle } from "@/util/file-browser-handle";
import { getValueOrFallback } from "@/util/helpers";
import deepmerge from "deepmerge";

export const FbBusinessLogicInner = React.memo(
	React.forwardRef<FileBrowserHandle, FileBrowserProps>((props, ref) => {
		usePropReduxUpdate(
			reduxActions.setFileActionGroup,
			deepmerge(props.fileActionGroups!, defaultConfig.fileActionGroups!),
		);

		usePropReduxUpdate(
			reduxActions.setRawFiles,
			props.files ?? initialRootState.rawFiles,
		);

		usePropReduxUpdate(reduxActions.setRawFolderChain, props.folderChain);
		useDTE(
			thunkUpdateRawFileActions,
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
		);
		useDTE(
			reduxActions.setExternalFileActionHandler,
			getValueOrFallback(props.onFileAction, defaultConfig.onFileAction) as any,
		);

		useDTE(
			reduxActions.setSelectionDisabled,
			getValueOrFallback(
				props.disableSelection,
				defaultConfig.disableSelection,
				"boolean",
			),
		);
		useDTE(
			thunkActivateSortAction,
			getValueOrFallback(
				props.defaultSortActionId,
				defaultConfig.defaultSortActionId,
			),
			getValueOrFallback(
				props.defaultSortOrder,
				defaultConfig.defaultSortOrder,
			),
		);
		useDTE(
			thunkUpdateDefaultFileViewActionId,
			getValueOrFallback(
				props.defaultFileViewActionId,
				defaultConfig.defaultFileViewActionId,
				"string",
			),
		);

		useDTE(
			reduxActions.setThumbnailGenerator,
			getValueOrFallback(
				props.thumbnailGenerator,
				defaultConfig.thumbnailGenerator,
			),
		);
		useDTE(
			reduxActions.setDoubleClickDelay,
			getValueOrFallback(
				props.doubleClickDelay,
				defaultConfig.doubleClickDelay,
				"number",
			),
		);
		useDTE(
			reduxActions.setForceEnableOpenParent,
			getValueOrFallback(
				props.forceEnableOpenParent,
				defaultConfig.forceEnableOpenParent,
				"boolean",
			),
		);
		useDTE(
			reduxActions.setHideToolbarInfo,
			getValueOrFallback(
				props.hideToolbarInfo,
				defaultConfig.hideToolbarInfo,
				"boolean",
			),
		);
		useDTE(
			reduxActions.setClearSelectionOnOutsideClick,
			getValueOrFallback(
				props.clearSelectionOnOutsideClick,
				defaultConfig.clearSelectionOnOutsideClick,
				"boolean",
			),
		);

		// ==== Setup the imperative handle for external use
		useFileBrowserHandle(ref);

		return null;
	}),
);
FbBusinessLogicInner.displayName = "FbBusinessLogicInner";

export const FbBusinessLogic = React.memo(FbBusinessLogicInner);
FbBusinessLogic.displayName = "FbBusinessLogic";
