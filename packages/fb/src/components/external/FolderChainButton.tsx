import React, { memo } from "react";

import { FbIconName } from "@/util/enums";
import { FolderChainItem } from "./FileNavbar-hooks";
import { ToolbarButton } from "./ToolbarButton";
export interface FolderChainButtonProps {
	first: boolean;
	current: boolean;
	item: FolderChainItem;
}

export const FolderChainButton = memo(
	({ first, item }: FolderChainButtonProps) => {
		const { file, disabled, onClick } = item;
		const text = file ? file.name : "Loading...";
		const icon =
			first && file?.folderChainIcon === undefined
				? FbIconName.folder
				: file?.folderChainIcon;

		return (
			<ToolbarButton
				icon={icon}
				className="bg-surface-tertiary hover:bg-default [&>span]:truncate max-w-32 min-w-0 px-2"
				text={text}
				variant="tertiary"
				size="sm"
				isDisabled={disabled}
				onPress={onClick}
			/>
		);
	},
);
