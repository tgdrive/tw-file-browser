import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FbActions } from "@/action-definitions/index";
import { reduxActions } from "@/redux/reducers";
import { selectContextMenuMounted } from "@/redux/selectors";
import { thunkRequestFileAction } from "@/redux/thunks/dispatchers.thunks";
import type { FbDispatch } from "@/types/redux.types";
import { useInstanceVariable } from "@/util/hooks-helpers";

export const useContextMenuTrigger = () => {
	const dispatch: FbDispatch = useDispatch();
	const contextMenuMountedRef = useInstanceVariable(
		useSelector(selectContextMenuMounted),
	);
	return useCallback(
		(event: PointerEvent) => {
			if (!contextMenuMountedRef.current) return;
			dispatch(
				thunkRequestFileAction(FbActions.OpenFileContextMenu, {
					clientX: event.clientX,
					clientY: event.clientY,
					triggerFileId: null,
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
