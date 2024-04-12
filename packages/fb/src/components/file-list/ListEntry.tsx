import React from "react";

import { FileEntryProps } from "@/types/file-list.types";
import { useLocalizedFileEntryStrings } from "@/util/i18n";
import { useFileEntryHtmlProps, useFileEntryState } from "./FileEntry-hooks";
import { FileEntryName } from "./FileEntryName";
import { FileEntryState } from "./GridEntryPreview";
import { FbIcon } from "../external/FbIcon";
import { FileHelper } from "@/util/file-helper";
import clsx from "clsx";

export const ListEntry: React.FC<FileEntryProps> = React.memo(
  ({ file, selected }) => {
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
          "items-center relative grid h-full text-inherit",
          "md:grid-cols-[70%_1fr_1fr] grid-cols-[1fr_1fr]",
          "md:gap-0 gap-2 grid-areas-[name_name,date_size]",
          "md:grid-areas-[name_size_date] p-2",
        )}
        {...fileEntryHtmlProps}
      >
        <div className="self-center inline-flex items-center gap-2 area-[name]">
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
          <FileEntryName
            className="truncate md:text-base text-sm"
            file={file}
          />
        </div>

        <span className="self-center flex md:justify-center area-[date] md:text-base text-sm">
          {fileModDateString}
        </span>

        <span className="self-center flex md:justify-center area-[size] md:text-base text-sm">
          {fileSizeString}
        </span>
      </div>
    );
  },
);
