import React from "react";

import { FileEntryProps } from "../../types/file-list.types";
import { FileHelper } from "../../util/file-helper";
import { useFileEntryHtmlProps, useFileEntryState } from "./file-entry.hooks";
import { FileEntryName } from "./file-entry-name";
import { GridEntryPreview } from "./grid-entry-preview";
import { useLocalizedFileEntryStrings } from "../../util/i18n";

export const GridEntry = React.memo(({ file, selected }: FileEntryProps) => {
	const isDir = FileHelper.isDirectory(file);
	const { icon, thumbnailUrl, color } = useFileEntryState(file, selected);
	const fileEntryHtmlProps = useFileEntryHtmlProps(file);
	const { fileModDateString, fileSizeString } =
		useLocalizedFileEntryStrings(file);
	const metaSize = isDir ? "Folder" : fileSizeString || "0 B";

	return (
		<div className="flex h-full min-h-45 flex-col p-2" {...fileEntryHtmlProps}>
			<div className="flex min-h-0 flex-1 items-center justify-center">
				<GridEntryPreview
					className="w-full"
					icon={icon}
					color={color}
					thumbnailUrl={thumbnailUrl}
					isDir={isDir}
				/>
			</div>
			<div className="mt-2 min-w-0 space-y-1">
				<FileEntryName className="truncate text-sm font-medium" file={file} />
				<div className="flex items-center justify-between gap-2 text-xs tabular-nums text-muted">
					<span className="truncate">{metaSize}</span>
					<span className="truncate text-right">{fileModDateString}</span>
				</div>
			</div>
		</div>
	);
});
GridEntry.displayName = "GridEntry";
