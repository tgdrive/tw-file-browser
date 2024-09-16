import ClickAwayListener from "react-click-away-listener";
import { type ReactNode, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { reduxActions } from "@/redux/reducers";
import {
	selectClearSelectionOnOutsideClick,
	selectFileActionIds,
} from "@/redux/selectors";
import type { FbDispatch } from "@/types/redux.types";
import { elementIsInsideButton } from "@/util/helpers";
import { useContextMenuTrigger } from "@/components/external/FileContextMenu-hooks";
import { HotkeyListener } from "./HotkeyListener";
import React from "react";

export interface FbPresentationLayerProps {
	children?: ReactNode;
}

export const FbPresentationLayer = ({ children }: FbPresentationLayerProps) => {
	const dispatch: FbDispatch = useDispatch();
	const fileActionIds = useSelector(selectFileActionIds);
	const clearSelectionOnOutsideClick = useSelector(
		selectClearSelectionOnOutsideClick,
	);

	const handleClickAway = useCallback(
		(event: any) => {
			if (
				!clearSelectionOnOutsideClick ||
				elementIsInsideButton(event.target)
			) {
				return;
			}
			dispatch(reduxActions.clearSelection());
		},
		[dispatch, clearSelectionOnOutsideClick],
	);

	const hotkeyListenerComponents = useMemo(
		() =>
			fileActionIds.map((actionId) => (
				<HotkeyListener
					key={`file-action-listener-${actionId}`}
					fileActionId={actionId}
				/>
			)),
		[fileActionIds],
	);

	const showContextMenu = useContextMenuTrigger();

	const onContextMenu = useCallback(
		(e: any) => {
			e.stopPropagation();
			showContextMenu(e);
			e.preventDefault();
		},
		[showContextMenu],
	);

	return (
		<ClickAwayListener onClickAway={handleClickAway}>
			<div
				id="file-browser"
				className="flex flex-col text-left rounded-2xl size-full touch-manipulation select-none bg-surface"
				onContextMenu={onContextMenu}
			>
				{hotkeyListenerComponents}
				{children ? children : null}
			</div>
		</ClickAwayListener>
	);
};
