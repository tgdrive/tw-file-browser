import type React from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Nullable } from "tsdef";

import { FbActions } from "@/action-definitions/index";
import { reduxActions } from "@/redux/reducers";
import { selectContextMenuMounted } from "@/redux/selectors";
import { thunkRequestFileAction } from "@/redux/thunks/dispatchers.thunks";
import type { FbDispatch } from "@/types/redux.types";
import { findElementAmongAncestors } from "@/util/helpers";
import { useInstanceVariable } from "@/util/hooks-helpers";

export const findClosestFbFileId = (
	element: HTMLElement | any,
): Nullable<string> => {
	const fileEntryWrapperDiv = findElementAmongAncestors(
		element,
		(element: any) =>
			element.tagName &&
			element.tagName.toLowerCase() === "div" &&
			element.dataset &&
			element.dataset.fileId,
	);
	return fileEntryWrapperDiv ? fileEntryWrapperDiv.dataset.fileId! : null;
};

export const useContextMenuTrigger = () => {
	const dispatch: FbDispatch = useDispatch();
	const contextMenuMountedRef = useInstanceVariable(
		useSelector(selectContextMenuMounted),
	);
	return useCallback(
		(event: PointerEvent) => {
			if (!contextMenuMountedRef.current) return;
			const triggerFileId = findClosestFbFileId(event.target);
			dispatch(
				thunkRequestFileAction(FbActions.OpenFileContextMenu, {
					clientX: event.clientX,
					clientY: event.clientY,
					triggerFileId,
				}),
			);
		},
		[contextMenuMountedRef, dispatch],
	);
};

export const useContextMenuDismisser = () => {
	const dispatch: FbDispatch = useDispatch();
	return useCallback(
		() => dispatch(reduxActions.hideContextMenu()),
		[dispatch],
	);
};
