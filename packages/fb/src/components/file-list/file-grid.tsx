import React, {
  memo,
  useCallback,
  useMemo,
  type ComponentType,
  type ElementType,
  Key,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Virtualizer,
  ListLayout,
  GridLayout,
  Size,
} from "react-aria-components";
import type { Selection } from "react-aria-components";
import { ListBox } from "@heroui/react";

import {
  selectFileViewConfig,
  selectors,
  selectSelectedFileIds,
  selectFileMap,
} from "@/redux/selectors";
import { reduxActions } from "@/redux/reducers";
import { thunkRequestFileAction } from "@/redux/thunks/dispatchers.thunks";
import { FbActions } from "@/action-definitions/index";
import { FileViewMode } from "@/util/enums";
import type { FbDispatch } from "@/types/redux.types";
import { useParamSelector } from "@/redux/store";
import type { Nullable } from "tsdef";
import type { FileData } from "@/types/file.types";

import { GridEntry } from "./grid-entry";
import { ListEntry } from "./list-entry";
import { TileEntry } from "./tile-entry";
import { FileListEmpty } from "./file-list-empty";
import { StyledGridList, StyledGridListItem } from "./styled-grid-list";

// ---- Parametrized selectors ----

const selectIsFileSelected =
  (fileId: Nullable<string>) =>
  (state: any): boolean =>
    !!fileId && !!state.selectionMap?.[fileId];

const selectFileDataById =
  (fileId: Nullable<string>) =>
  (state: any): Nullable<FileData> =>
    fileId ? state.fileMap?.[fileId] ?? null : null;

// ---- Item wrapper type ----

type FileGridItem = {
  id: string;
  index: number;
};

// ---- Content renderer (same for all view modes) ----

const FileItemContent = memo(
  ({
    fileId,
    viewMode,
  }: {
    fileId: Nullable<string>;
    viewMode: FileViewMode;
  }) => {
    const file = useParamSelector(selectFileDataById, fileId);
    const selected = useParamSelector(selectIsFileSelected, fileId);

    if (viewMode === FileViewMode.List) {
      return <ListEntry file={file} selected={selected} />;
    }
    if (viewMode === FileViewMode.Grid) {
      return <GridEntry file={file} selected={selected} />;
    }
    return <TileEntry file={file} selected={selected} />;
  },
);
FileItemContent.displayName = "FileItemContent";

// ---- Main FileGrid component ----
// Unifies list (HeroUI ListBox) and grid/tile (GridList) into a single render path
// by dynamically picking the collection and item wrapper based on view mode.

export const FileGrid = memo(() => {
  const dispatch: FbDispatch = useDispatch();
  const displayFileIds: (string | null)[] = useSelector(
    selectors.getDisplayFileIds,
  );
  const viewConfig = useSelector(selectFileViewConfig);
  const selectedFileIds = useSelector(selectSelectedFileIds);
  const fileMap = useSelector(selectFileMap);

  const viewMode = viewConfig.mode;

  // Filter out nulls and wrap with index for RAC dynamic collection
  const items: FileGridItem[] = useMemo(
    () =>
      displayFileIds
        .filter((id): id is string => id !== null)
        .map((id, index) => ({ id, index })),
    [displayFileIds],
  );

  // Sync Redux selection → RAC selectedKeys
  const selectedKeys: Selection = useMemo(
    () => new Set(selectedFileIds),
    [selectedFileIds],
  );

  // Handle RAC selection change → sync back to Redux
  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      if (keys === "all") {
        dispatch(reduxActions.selectAllFiles());
        return;
      }
      const fileIds = Array.from(keys) as string[];
      dispatch(reduxActions.selectFiles({ fileIds, reset: true }));
    },
    [dispatch],
  );

  // Handle double-click / Enter → open file action
  const handleAction = useCallback(
    (key: Key) => {
      const fileId = key as string;
      const file: Nullable<FileData> = fileMap[fileId] ?? null;
      const index = displayFileIds.indexOf(fileId);
      if (!file) return;

      dispatch(
        thunkRequestFileAction(FbActions.MouseClickFile, {
          clickType: "double",
          file,
          fileDisplayIndex: index,
          altKey: false,
          ctrlKey: false,
          shiftKey: false,
        }),
      );
    },
    [dispatch, displayFileIds, fileMap],
  );

  // Get textValue for an item (for accessibility/typeahead)
  const getTextValue = useCallback(
    (item: FileGridItem) => fileMap[item.id]?.name ?? "Loading...",
    [fileMap],
  );

  const isList = viewMode === FileViewMode.List;

  // ---- Pick collection, item wrapper, layout, and options based on view mode ----

  const Collection = (isList ? ListBox : StyledGridList) as
    | typeof ListBox
    | typeof StyledGridList;
  const ItemWrapper = (isList ? ListBox.Item : StyledGridListItem) as
    | ElementType
    | ComponentType<any>;

  const LayoutClass = isList ? ListLayout : GridLayout;

  const layoutOptions = useMemo(
    () =>
      isList
        ? { estimatedRowSize: 56 }
        : {
            minItemSize: new Size(
              viewMode === FileViewMode.Grid ? 180 : 200,
              180,
            ),
            maxColumns: 12,
            minSpace: new Size(8, 8),
          },
    [isList, viewMode],
  );

  // ListBox needs overflow-y-auto to scroll; StyledGridList gets size-full from its own className
  const collectionClassName = isList
    ? "size-full overflow-y-auto"
    : undefined;

  // StyledGridList needs layout="grid"; ListBox doesn't
  const collectionExtraProps = isList ? {} : { layout: "grid" as const };
  // StyledGridListItem needs isCard; ListBox.Item doesn't
  const itemExtraProps = isList ? {} : { isCard: true as const };

  // Empty state
  if (items.length === 0) {
    return (
      <div className="flex-1 pl-2 pb-2 rounded-b-3xl min-h-0">
        <FileListEmpty />
      </div>
    );
  }

  // Single unified render path
  return (
    <div className="flex-1 pl-2 pb-2 rounded-b-3xl min-h-0">
      <Virtualizer layout={LayoutClass} layoutOptions={layoutOptions}>
        <Collection
          aria-label="File browser"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
          onAction={handleAction}
          items={items}
          className={collectionClassName}
          style={{ display: "block" }}
          {...collectionExtraProps}
        >
          {(item: FileGridItem) => (
            <ItemWrapper
              key={item.id}
              id={item.id}
              textValue={getTextValue(item)}
              {...itemExtraProps}
            >
              <FileItemContent fileId={item.id} viewMode={viewMode} />
            </ItemWrapper>
          )}
        </Collection>
      </Virtualizer>
    </div>
  );
});
FileGrid.displayName = "FileGrid";
