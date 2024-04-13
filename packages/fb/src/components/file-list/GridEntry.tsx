import React from "react";

import { FileEntryProps } from "@/types/file-list.types";
import { FileHelper } from "@/util/file-helper";
import { useFileEntryHtmlProps, useFileEntryState } from "./FileEntry-hooks";
import { FileEntryName } from "./FileEntryName";
import { GridEntryPreview } from "./GridEntryPreview";
import { useLocalizedFileEntryStrings } from "@/util/i18n";

export const GridEntry = React.memo(({ file, selected }: FileEntryProps) => {
  const isDir = FileHelper.isDirectory(file);
  const { icon, thumbnailUrl, color } = useFileEntryState(file, selected);
  const fileEntryHtmlProps = useFileEntryHtmlProps(file);
  const { fileModDateString, fileSizeString } =
    useLocalizedFileEntryStrings(file);

  return (
    <div className={"flex flex-col h-full p-2 gap-2"} {...fileEntryHtmlProps}>
      <FileEntryName className="text-base truncate" file={file} />
      <GridEntryPreview
        icon={icon}
        color={color}
        thumbnailUrl={thumbnailUrl}
        isDir={isDir}
      />
      <div className="inline-flex justify-between text-sm">
        <span>{fileModDateString}</span>
        <span>{fileSizeString}</span>
      </div>
    </div>
  );
});
GridEntry.displayName = "GridEntry";
