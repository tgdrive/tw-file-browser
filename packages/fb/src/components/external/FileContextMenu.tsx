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
import { Popover, PopoverContent, PopoverTrigger } from "@tw-material/react";
import { Drawer } from "vaul";
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

	const renderDrawer = () => {
		if (!contextMenuConfig) return null;
		if (sm) {
			return (
				<Drawer.Root open={!!anchorPosition} onOpenChange={hideContextMenu}>
					<Drawer.Trigger asChild>
						<button
							type="button"
							style={{
								position: "fixed",
								top: anchorPosition?.top || 0,
								left: anchorPosition?.left || 0,
							}}
						/>
					</Drawer.Trigger>
					<Drawer.Portal>
						<Drawer.Overlay className="fixed inset-0 bg-black/40" />
						<Drawer.Content className="bg-surface-container-low flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0">
							<div className="p-4 rounded-t-[10px] flex-1">
								<div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-on-surface-variant mb-4" />
								<div className="max-w-md mx-auto">
									{contextMenuItemComponents}
								</div>
							</div>
						</Drawer.Content>
					</Drawer.Portal>
				</Drawer.Root>
			);
		}
		return (
			<Popover
				placement="bottom-start"
				isOpen={!!anchorPosition}
				onOpenChange={hideContextMenu}
				disableAnimation
				classNames={{
					content: [
						"w-full relative flex flex-col gap-1 bg-surface-container-low ",
						"text-on-surface rounded-lg shadow-1 p-1",
					],
				}}
			>
				<PopoverTrigger>
					<button
						type="button"
						style={{
							position: "fixed",
							top: anchorPosition?.top || 0,
							left: anchorPosition?.left || 0,
						}}
					/>
				</PopoverTrigger>
				<PopoverContent>{contextMenuItemComponents}</PopoverContent>
			</Popover>
		);
	};

	return renderDrawer();
});
