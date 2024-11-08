import React from "react";

import { FileEntryProps } from "@/types/file-list.types";
import { useLocalizedFileEntryStrings } from "@/util/i18n";
import {
	FileEntryState,
	useFileEntryHtmlProps,
	useFileEntryState,
} from "./FileEntry-hooks";
import { FileEntryName } from "./FileEntryName";
import { FbIcon } from "../external/FbIcon";
import { FileHelper } from "@/util/file-helper";
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
				"items-center relative grid",
				"text-inherit grid-cols-6 p-2 gap-2",
			)}
			{...fileEntryHtmlProps}
		>
			<div className="self-center inline-flex items-center gap-2 col-span-6 sm:col-span-3 xl:col-span-4">
				<div
					className={clsx(
						"size-8 grid rounded-lg shrink-0",
						isDir && "bg-primary/focus",
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
				<FileEntryName className="truncate" file={file} />
			</div>

			<span className="col-span-2 sm:col-span-1">
				{fileSizeString || "0 B"}
			</span>
			<span className="col-span-4 sm:col-span-2 xl:col-span-1">
				{fileModDateString}
			</span>
		</div>
	);
});
