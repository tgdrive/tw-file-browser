import React, { type ReactElement, useMemo } from "react";

import { FbActions } from "../../action-definitions/index";
import { useFolderChainItems } from "./file-navbar.hooks";

import { FolderChainButton } from "./folder-chain-button";

import { SmartToolbarButton } from "../toolbar/toolbar-button";
import { Breadcrumbs } from "@heroui/react";
import type { Nilable } from "../../util/utils";
import clsx from "clsx";

interface FileNavbarProps {
	breakpoint?: Nilable<string>;
	className?: string;
}

export const FileNavbar = React.memo(
	({ breakpoint: _breakpoint, className }: FileNavbarProps) => {
		const folderChainItems = useFolderChainItems();

		const folderChainComponents = useMemo(() => {
			const components: ReactElement[] = [];
			for (let i = 0; i < folderChainItems.length; ++i) {
				const component = (
					<Breadcrumbs.Item key={`folder-chain-${i}`}>
						<FolderChainButton
							first={i === 0}
							current={i === folderChainItems.length - 1}
							item={folderChainItems[i]}
						/>
					</Breadcrumbs.Item>
				);
				components.push(component);
			}
			return components;
		}, [folderChainItems]);

		return (
			<div className={clsx("flex p-2 min-h-10 items-center", className)}>
				<SmartToolbarButton
					size="sm"
					className="cursor-pointer"
					fileActionId={FbActions.OpenParentFolder.id}
				/>
				<Breadcrumbs>
					{folderChainComponents}
				</Breadcrumbs>
			</div>
		);
	},
);
