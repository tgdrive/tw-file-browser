import React, { type ReactElement, useMemo } from "react";

import { FbActions } from "@/action-definitions/index";
import { useFolderChainItems } from "./FileNavbar-hooks";
import { FolderChainButton } from "./FolderChainButton";
import { SmartToolbarButton } from "./ToolbarButton";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Button,
	Breadcrumbs,
	BreadcrumbItem,
} from "@tw-material/react";
import { scrollbarClasses } from "@/util/classes";
import type { Nilable } from "tsdef";
import clsx from "clsx";

interface FileNavbarProps {
	breakpoint?: Nilable<string>;
	className?: string;
}

const maxbreadCrumbItems = {
	xs: 2,
	sm: 3,
	md: 4,
	lg: 5,
};

export const FileNavbar = React.memo(
	({ breakpoint, className }: FileNavbarProps) => {
		const folderChainItems = useFolderChainItems();

		const folderChainComponents = useMemo(() => {
			const components: ReactElement[] = [];
			for (let i = 0; i < folderChainItems.length; ++i) {
				const component = (
					<BreadcrumbItem
						classNames={{
							item: "hover:!opacity-100",
						}}
						key={`folder-chain-${i}`}
					>
						<FolderChainButton
							first={i === 0}
							current={i === folderChainItems.length - 1}
							item={folderChainItems[i]}
						/>
					</BreadcrumbItem>
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
				<Breadcrumbs
					maxItems={maxbreadCrumbItems[breakpoint ?? "lg"]}
					itemsBeforeCollapse={1}
					itemsAfterCollapse={maxbreadCrumbItems[breakpoint ?? "lg"] - 1}
					renderEllipsis={({ items, ellipsisIcon, separator }) => (
						<div className="flex items-center">
							<Dropdown>
								<DropdownTrigger>
									<Button
										disableRipple
										isIconOnly
										className="min-w-6 size-6 text-inherit"
										size="sm"
										variant="text"
									>
										{ellipsisIcon}
									</Button>
								</DropdownTrigger>
								<DropdownMenu
									aria-label="folder-chain"
									className={clsx(scrollbarClasses, "max-h-60 overflow-y-auto")}
								>
									{items.map((item, index) => (
										<DropdownItem
											className="data-[hover=true]:bg-transparent"
											key={index}
										>
											{item.children}
										</DropdownItem>
									))}
								</DropdownMenu>
							</Dropdown>
							{separator}
						</div>
					)}
				>
					{folderChainComponents}
				</Breadcrumbs>
			</div>
		);
	},
);
