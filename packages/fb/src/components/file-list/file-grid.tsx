import React, { memo, useCallback, useMemo, Key } from "react";
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

// ---- Content renderer (shared between list/grid paths) ----

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

  // Grid layout options (must be before early returns — hooks rule)
  const gridLayoutOptions = useMemo(
    () => ({
      minItemSize: new Size(
        viewMode === FileViewMode.Grid ? 180 : 200,
        180,
      ),
      maxColumns: 12,
      minSpace: new Size(8, 8),
    }),
    [viewMode],
  );

  // Empty state
  if (items.length === 0) {
    return (
      <div className="size-full pl-2 pb-2 rounded-b-3xl">
        <FileListEmpty />
      </div>
    );
  }

  // ---- List view: HeroUI ListBox + Virtualizer ListLayout ----
  if (isList) {
    return (
      <div className="size-full pl-2 pb-2 rounded-b-3xl">
        <Virtualizer layout={ListLayout} layoutOptions={{ estimatedRowSize: 56 }}>
          <ListBox
            aria-label="File browser"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={handleSelectionChange}
            onAction={handleAction}
            items={items}
            className="size-full overflow-y-auto"
            style={{ minHeight: "100%", display: "block" }}
          >
            {(item: FileGridItem) => (
              <ListBox.Item
                key={item.id}
                id={item.id}
                textValue={getTextValue(item)}
              >
                <FileItemContent fileId={item.id} viewMode={viewMode} />
              </ListBox.Item>
            )}
          </ListBox>
        </Virtualizer>
      </div>
    );
  }

  // ---- Grid / Tile view: GridList + Virtualizer GridLayout ----
  return (
    <div className="size-full pl-2 pb-2 rounded-b-3xl">
      <Virtualizer layout={GridLayout} layoutOptions={gridLayoutOptions}>
        <StyledGridList
          aria-label="File browser"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
          onAction={handleAction}
          layout="grid"
          items={items}
          style={{ minHeight: "100%", display: "block" }}
        >
          {(item: FileGridItem) => (
            <StyledGridListItem
              key={item.id}
              id={item.id}
              textValue={getTextValue(item)}
              isCard
            >
              <FileItemContent fileId={item.id} viewMode={viewMode} />
            </StyledGridListItem>
          )}
        </StyledGridList>
      </Virtualizer>
    </div>
  );
});
FileGrid.displayName = "FileGrid";
