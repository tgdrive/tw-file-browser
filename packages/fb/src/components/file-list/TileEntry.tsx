import React from "react";

import { FileEntryProps } from "@/types/file-list.types";
import { useFileEntryHtmlProps, useFileEntryState } from "./FileEntry-hooks";
import { FileEntryName } from "./FileEntryName";
import { useLocalizedFileEntryStrings } from "@/util/i18n";
import { FbIcon } from "../external/FbIcon";
import clsx from "clsx";
import { FileHelper } from "@/util/file-helper";

export const TileEntry = React.memo(({ file, selected }: FileEntryProps) => {
  const entryState = useFileEntryState(file, selected);
  const fileEntryHtmlProps = useFileEntryHtmlProps(file);
  const { fileModDateString, fileSizeString } =
    useLocalizedFileEntryStrings(file);

  const isDir = FileHelper.isDirectory(file);

  const styles = !isDir
    ? { backgroundColor: `${entryState.color}1F` }
    : undefined;

  return (
    <div
      className="flex gap-3 items-start w-full max-h-40 p-2 rounded-lg"
      {...fileEntryHtmlProps}
    >
      <div
        className={clsx(
          "size-10 shrink-0 grid rounded-lg",
          isDir && "bg-primary/focus",
        )}
        style={styles}
      >
        <FbIcon
          style={{ color: entryState.color }}
          className={clsx(
            "min-w-6 size-6 place-self-center",
            isDir && entryState.color,
          )}
          icon={entryState.icon}
          fixedWidth={true}
        />
      </div>
      <div className="flex flex-col gap-2 min-w-0 truncate">
        <FileEntryName className="text-base truncate" file={file} />
        <div className="inline-flex gap-2 text-sm">
          <span>{fileModDateString}</span>
          <span>{fileSizeString}</span>
        </div>
      </div>
    </div>
  );
});
TileEntry.displayName = "TileEntry";
