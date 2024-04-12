import React from "react";
import { Nullable } from "tsdef";
import { FbIconName } from "@/util/enums";
import { FileThumbnail } from "./FileThumbnail";
import { FbIcon } from "../external/FbIcon";
import clsx from "clsx";

export type FileEntryState = {
  childrenCount: Nullable<number>;
  color: string;
  icon: FbIconName | string;
  thumbnailUrl: Nullable<string>;
  thumbnailLoading: boolean;
  selected: boolean;
};

export interface FileEntryPreviewProps {
  className?: string;
  entryState: FileEntryState;
  isDir: boolean;
}

export const GridEntryPreview = React.memo(
  ({ className, entryState, isDir = false }: FileEntryPreviewProps) => {
    const styles = !isDir
      ? { backgroundColor: `${entryState.color}1F` }
      : undefined;
    return (
      <div
        className={clsx(
          "flex-grow bg-surface aspect-[16/10] relative overflow-hidden rounded-lg",
          className,
        )}
      >
        {!entryState.thumbnailUrl ? (
          <div
            style={styles}
            className={clsx(
              "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 size-14",
              "rounded-lg",
              isDir && "bg-primary/focus",
            )}
          >
            <FbIcon
              style={{ color: entryState.color }}
              className={clsx("size-full p-2", isDir && entryState.color)}
              icon={entryState.icon}
              fixedWidth={true}
            />
          </div>
        ) : (
          <FileThumbnail thumbnailUrl={entryState.thumbnailUrl} />
        )}
      </div>
    );
  },
);
GridEntryPreview.displayName = "GridEntryPreviewFolder";
