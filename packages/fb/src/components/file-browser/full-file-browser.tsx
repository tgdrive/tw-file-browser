import React from "react";

import type {
	FileBrowserHandle,
	FileBrowserProps,
} from "../../types/file-browser.types";
import { FileList } from "../file-list/file-list";
import { FileBrowser } from "./file-browser";
import { FileNavbar } from "../nav/file-navbar";
import { FileToolbar } from "../toolbar/file-toolbar";
import { FileContextMenu } from "../context-menu/file-context-menu";

export const FullFileBrowser = React.memo(
	React.forwardRef<FileBrowserHandle, FileBrowserProps>((props, ref) => {
		return (
			<FileBrowser ref={ref} {...props}>
				{props.folderChain?.length ? <FileNavbar /> : undefined}
				<FileToolbar />
				<FileList />
				<FileContextMenu />
			</FileBrowser>
		);
	}),
);
FullFileBrowser.displayName = "FullFileBrowser";
