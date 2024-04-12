import React, { useCallback, useMemo, forwardRef } from "react";
import { useSelector } from "react-redux";
import { selectFileViewConfig, selectors } from "@/redux/selectors";
import { FileListProps } from "@/types/file-list.types";
import { FileViewConfig } from "@/types/file-view.types";
import { useInstanceVariable } from "@/util/hooks-helpers";
import { SmartFileEntry } from "./FileEntry";
import { VirtuosoGrid, VirtuosoGridHandle } from "react-virtuoso";
import { Scroller } from "./ListContainer";
import clsx from "clsx";

export const GridContainer = React.memo(
  forwardRef<VirtuosoGridHandle, FileListProps>(
    ({ hasNextPage, loadNextPage }, ref) => {
      const viewConfig = useSelector(selectFileViewConfig) as FileViewConfig;

      const displayFileIds = useSelector(selectors.getDisplayFileIds);

      const displayFileIdsRef = useInstanceVariable(displayFileIds);

      const getItemKey = useCallback(
        (index: number) =>
          displayFileIdsRef.current[index] ?? `loading-file-${index}`,
        [displayFileIdsRef],
      );

      const cellRenderer = useCallback(
        (index: number) => {
          const fileId = displayFileIds[index];
          if (displayFileIds[index] === undefined) return null;

          return (
            <SmartFileEntry
              fileId={fileId ?? null}
              displayIndex={index}
              fileViewMode={viewConfig.mode}
            />
          );
        },
        [displayFileIds, viewConfig.mode],
      );

      const loadMoreItems = useMemo(
        () => (hasNextPage ? loadNextPage : () => void 0),
        [hasNextPage, loadNextPage],
      );

      const gridComponent = useMemo(() => {
        return (
          <VirtuosoGrid
            ref={ref}
            components={{ Scroller }}
            totalCount={displayFileIds.length}
            listClassName={clsx(
              "grid gap-4 px-2",
              viewConfig.mode === "grid"
                ? "grid-cols-[repeat(auto-fill,minmax(min(180px,100%),1fr))]"
                : "grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))]",
            )}
            endReached={loadMoreItems}
            itemContent={(index) => cellRenderer(index)}
            computeItemKey={getItemKey}
          />
        );
      }, [cellRenderer]);

      return gridComponent;
    },
  ),
);
