import React, { useCallback, useMemo, forwardRef } from "react";
import { useSelector } from "react-redux";
import { selectors } from "@/redux/selectors";
import { useInstanceVariable } from "@/util/hooks-helpers";
import { SmartFileEntry } from "./FileEntry";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { FileListProps } from "@/types/file-list.types";
import { scrollbarClasses } from "@/util/classes";
import { FileViewMode } from "@/util/enums";

const List = React.forwardRef<HTMLDivElement>((props, ref) => {
  return <div {...props} className="flex flex-col gap-2 pr-2" ref={ref} />;
});

export const Scroller = React.forwardRef<HTMLDivElement>((props, ref) => {
  return <div {...props} className={scrollbarClasses} ref={ref} />;
});

export const ListContainer = React.memo(
  forwardRef<VirtuosoHandle, FileListProps>(
    ({ hasNextPage, loadNextPage, restoreStateFrom }, ref) => {
      const displayFileIds = useSelector(selectors.getDisplayFileIds);
      const displayFileIdsRef = useInstanceVariable(displayFileIds);
      const getItemKey = useCallback(
        (index: number) =>
          displayFileIdsRef.current[index] ?? `loading-file-${index}`,
        [displayFileIdsRef],
      );

      const loadMoreItems = useMemo(
        () => (hasNextPage ? loadNextPage : () => void 0),
        [hasNextPage, loadNextPage],
      );

      const listComponent = useMemo(() => {
        const rowRenderer = (index: number) => {
          return (
            <SmartFileEntry
              fileId={displayFileIds[index] ?? null}
              displayIndex={index}
              fileViewMode={FileViewMode.List}
            />
          );
        };

        return (
          <Virtuoso
            ref={ref}
            totalCount={displayFileIds.length}
            components={{ List, Scroller }}
            endReached={loadMoreItems}
            itemContent={(index) => rowRenderer(index)}
            computeItemKey={getItemKey}
            restoreStateFrom={restoreStateFrom}
          />
        );
      }, [displayFileIds, getItemKey]);

      return listComponent;
    },
  ),
);
