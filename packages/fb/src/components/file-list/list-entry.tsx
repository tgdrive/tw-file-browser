import React from "react";

import { FileEntryProps } from "../../types/file-list.types";
import { useLocalizedFileEntryStrings } from "../../util/i18n";
import {
	FileEntryState,
	useFileEntryHtmlProps,
	useFileEntryState,
} from "./file-entry.hooks";
import { FileEntryName } from "./file-entry-name";
import { FbIcon } from "../shared/fb-icon";
import { FileHelper } from "../../util/file-helper";
import clsx from "clsx";

export const ListEntry = React.memo(({ file, selected }: FileEntryProps) => {
	const entryState: FileEntryState = useFileEntryState(file, selected);

	const { fileModDateString, fileSizeString } =
		useLocalizedFileEntryStrings(file);

	const fileEntryHtmlProps = useFileEntryHtmlProps(file);

	const isDir = FileHelper.isDirectory(file);

	const styles = !isDir
		? { backgroundColor: `${entryState.color}1F` }
		: undefined;

	return (
		<div
			className={clsx(
				"relative grid items-center w-full min-w-0",
				"text-inherit gap-3 px-2 py-2",
				"grid-cols-[minmax(0,1fr)_96px_136px] sm:grid-cols-[minmax(0,1fr)_110px_180px]",
			)}
			{...fileEntryHtmlProps}
		>
			<div className="self-center inline-flex items-center gap-2 min-w-0 col-span-3 sm:col-span-1">
				<div
					className={clsx(
						"size-8 grid rounded-lg shrink-0",
						isDir && "bg-accent/20",
					)}
					style={styles}
				>
					<FbIcon
						style={{ color: entryState.color }}
						className={clsx(
							"min-w-5 place-self-center",
							isDir && entryState.color,
						)}
						icon={entryState.icon}
						fixedWidth={true}
					/>
				</div>
				<FileEntryName className="truncate min-w-0" file={file} />
			</div>

			<span className="justify-self-start text-left tabular-nums text-muted whitespace-nowrap text-xs sm:text-sm col-start-2">
				{fileSizeString || "0 B"}
			</span>
			<span className="justify-self-start text-left tabular-nums text-muted whitespace-nowrap truncate text-xs sm:text-sm col-start-3">
				{fileModDateString}
			</span>
		</div>
	);
});
