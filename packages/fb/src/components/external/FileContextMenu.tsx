import React, { type ReactElement, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { reduxActions } from "@/redux/reducers";
import {
	selectContextMenuConfig,
	selectContextMenuItems,
} from "@/redux/selectors";

import { useContextMenuDismisser } from "./FileContextMenu-hooks";
import { SmartToolbarDropdownButton } from "./ToolbarDropdownButton";
import type { FbDispatch } from "@/types/redux.types";
import { Popover } from "@heroui/react";
import { useMediaQuery } from "@react-hook/media-query";

export const FileContextMenu = React.memo(() => {
	const dispatch: FbDispatch = useDispatch();
	useEffect(() => {
		dispatch(reduxActions.setContextMenuMounted(true));
		return () => {
			dispatch(reduxActions.setContextMenuMounted(false));
		};
	}, [dispatch]);

	const elemRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!elemRef.current)
			elemRef.current = document.querySelector("#file-browser");
	}, []);

	const contextMenuConfig = useSelector(selectContextMenuConfig);
	const contextMenuItems = useSelector(selectContextMenuItems);

	const hideContextMenu = useContextMenuDismisser();
	const contextMenuItemComponents = useMemo(() => {
		const components: ReactElement[] = [];
		for (let i = 0; i < contextMenuItems.length; ++i) {
			const item = contextMenuItems[i];

			if (typeof item === "string") {
				components.push(
					<SmartToolbarDropdownButton
						key={`context-menu-item-${item}`}
						fileActionId={item}
						onClickFollowUp={hideContextMenu}
					/>,
				);
			} else {
				item.fileActionIds.map((id) =>
					components.push(
						<SmartToolbarDropdownButton
							key={`context-menu-item-${item.name}-${id}`}
							fileActionId={id}
							onClickFollowUp={hideContextMenu}
						/>,
					),
				);
			}
		}
		return components;
	}, [contextMenuItems, hideContextMenu]);

	const anchorPosition = useMemo(
		() =>
			contextMenuConfig
				? { top: contextMenuConfig.mouseY, left: contextMenuConfig.mouseX }
				: undefined,
		[contextMenuConfig],
	);

	const sm = useMediaQuery("only screen and (max-width: 475px)");

	const renderMenu = () => {
		if (!contextMenuConfig) return null;

		return (
			<Popover
				isOpen={!!anchorPosition}
				onOpenChange={(open) => {
					if (!open) hideContextMenu();
				}}
			>
				<button
					type="button"
					style={{
						position: "fixed",
						top: anchorPosition?.top || 0,
						left: anchorPosition?.left || 0,
						width: 0,
						height: 0,
						opacity: 0,
					}}
					aria-hidden="true"
				/>
				<Popover.Content
					className="w-full relative flex flex-col gap-1 bg-surface text-foreground rounded-lg shadow-overlay p-1"
					placement={sm ? "bottom" : "bottom start"}
				>
					<Popover.Dialog>
						{contextMenuItemComponents}
					</Popover.Dialog>
				</Popover.Content>
			</Popover>
		);
	};

	return renderMenu();
});
