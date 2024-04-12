import React from "react";
import { Nullable } from "tsdef";
import { FbIconName } from "@/util/enums";
import { FileThumbnail } from "./FileThumbnail";
import { FbIcon } from "../external/FbIcon";
import clsx from "clsx";

export interface FileEntryPreviewProps {
  className?: string;
  color: string;
  thumbnailUrl: Nullable<string>;
  icon: FbIconName | string;
  isDir: boolean;
}

export const GridEntryPreview = React.memo(
  ({
    className,
    color,
    thumbnailUrl,
    icon,
    isDir = false,
  }: FileEntryPreviewProps) => {
    const styles = !isDir ? { backgroundColor: `${color}1F` } : undefined;
    return (
      <div
        className={clsx(
          "flex-grow bg-surface aspect-[16/10] relative overflow-hidden rounded-lg",
          className,
        )}
      >
        {thumbnailUrl === "" ? (
          <div
            style={styles}
            className={clsx(
              "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 size-14",
              "rounded-lg",
              isDir && "bg-primary/focus",
            )}
          >
            <FbIcon
              style={{ color }}
              className={clsx("size-full p-2", isDir && color)}
              icon={icon}
              fixedWidth={true}
            />
          </div>
        ) : (
          <FileThumbnail thumbnailUrl={thumbnailUrl!} />
        )}
      </div>
    );
  },
);
GridEntryPreview.displayName = "GridEntryPreviewFolder";
