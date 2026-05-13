import React, { memo, useCallback, useMemo, Key } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Virtualizer,
  ListLayout,
  GridLayout,
  Size,
} from "react-aria-components";
import type { Selection } from "react-aria-components";

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

// ---- Single grid item renderer ----

const FileGridItemRenderer = memo(
  ({
    fileId,
    viewMode,
  }: {
    fileId: Nullable<string>;
    viewMode: FileViewMode;
  }) => {
    const file = useParamSelector(selectFileDataById, fileId);
    const selected = useParamSelector(selectIsFileSelected, fileId);

    const textValue = file?.name ?? "Loading...";

    return (
      <StyledGridListItem
        id={fileId ?? undefined}
        textValue={textValue}
        isCard={viewMode !== FileViewMode.List}
      >
        {viewMode === FileViewMode.List ? (
          <ListEntry file={file} selected={selected} />
        ) : viewMode === FileViewMode.Grid ? (
          <GridEntry file={file} selected={selected} />
        ) : (
          <TileEntry file={file} selected={selected} />
        )}
      </StyledGridListItem>
    );
  },
);
FileGridItemRenderer.displayName = "FileGridItemRenderer";

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

  // Layout config: Virtualizer layout class + options
  const isList = viewMode === FileViewMode.List;
  const LayoutClass = isList ? ListLayout : GridLayout;
  const layoutOptions = useMemo(
    () =>
      isList
        ? { estimatedRowSize: 56, gap: 2 }
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
  const gridListLayout = isList ? "stack" : "grid";

  // Empty state
  if (items.length === 0) {
    return (
      <div className="size-full pl-2 pb-2 rounded-b-3xl">
        <FileListEmpty />
      </div>
    );
  }

  return (
    <div className="size-full pl-2 pb-2 rounded-b-3xl">
      <Virtualizer layout={LayoutClass} layoutOptions={layoutOptions}>
        <StyledGridList
          aria-label="File browser"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
          onAction={handleAction}
          layout={gridListLayout}
          items={items}
          style={{ minHeight: "100%", display: "block" }}
        >
          {(item: FileGridItem) => (
            <FileGridItemRenderer
              key={item.id}
              fileId={item.id}
              viewMode={viewMode}
            />
          )}
        </StyledGridList>
      </Virtualizer>
    </div>
  );
});
FileGrid.displayName = "FileGrid";
