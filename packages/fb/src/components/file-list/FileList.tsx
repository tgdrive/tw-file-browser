import React, { useCallback, forwardRef, memo, Ref } from "react";
import { useSelector } from "react-redux";
import { selectFileViewConfig, selectors } from "@/redux/selectors";
import { FileListProps } from "@/types/file-list.types";
import { FileListEmpty } from "./FileListEmpty";
import { GridContainer } from "./GridContainer";
import { ListContainer } from "./ListContainer";
import type { VirtuosoHandle, VirtuosoGridHandle } from "react-virtuoso";
import { FileViewMode } from "@/util/enums";

export const FileList = memo(
  forwardRef<unknown, FileListProps>((props, ref) => {
    const displayFileIds = useSelector(selectors.getDisplayFileIds);
    const viewConfig = useSelector(selectFileViewConfig);

    const listRenderer = useCallback(() => {
      if (displayFileIds.length === 0) {
        return <FileListEmpty />;
      } else if (viewConfig.mode === FileViewMode.List) {
        return <ListContainer ref={ref as Ref<VirtuosoHandle>} {...props} />;
      } else {
        return (
          <GridContainer ref={ref as Ref<VirtuosoGridHandle>} {...props} />
        );
      }
    }, [displayFileIds, viewConfig]);

    return (
      <div className="size-full pl-2 pb-2 rounded-b-3xl">{listRenderer()}</div>
    );
  }),
);
FileList.displayName = "FileList";
