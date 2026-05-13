import React, { memo, useCallback, useMemo, Key } from "react";

import {
  Virtualizer,
  ListLayout,
  GridLayout,
  Size,
} from "react-aria-components";
import type { Selection } from "react-aria-components";
import { ListBox } from "@heroui/react";

import { FbActions } from "@/action-definitions/index";
import { FileViewMode } from "@/util/enums";
import type { Nullable } from "@/util/ts-types";
import type { FileData } from "@/types/file.types";
import { useFbStore, useFbStoreApi, useShallow } from "@/store/store";

import { GridEntry } from "./grid-entry";
import { ListEntry } from "./list-entry";
import { FileListEmpty } from "./file-list-empty";
import { StyledGridList, StyledGridListItem } from "./grid-list-collection";

type FileGridItem = {
  id: string;
  index: number;
};

const FileItemContent = memo(
  ({
    fileId,
    viewMode,
  }: {
    fileId: Nullable<string>;
    viewMode: FileViewMode;
  }) => {
    const file = useFbStore((s) => (fileId ? s.state.fileMap?.[fileId] ?? null : null));
    const selected = useFbStore((s) => !!fileId && !!s.state.selectionMap?.[fileId]);

    if (viewMode === FileViewMode.List) {
      return <ListEntry file={file} selected={selected} />;
    }
    if (viewMode === FileViewMode.Grid) {
      return <GridEntry file={file} selected={selected} />;
    }
    return <GridEntry file={file} selected={selected} />;
  },
);
FileItemContent.displayName = "FileItemContent";

export const FileGrid = memo(() => {
  const storeApi = useFbStoreApi();
  const displayFileIds = useFbStore(useShallow((s) => s.state.displayFileIds));
  const viewConfig = useFbStore((s) => s.state.fileViewConfig);
  const selectedFileIds = useFbStore(useShallow((s) => Object.keys(s.state.selectionMap)));
  const fileMap = useFbStore(useShallow((s) => s.state.fileMap));

  const viewMode = viewConfig.mode;

  const items: FileGridItem[] = useMemo(
    () =>
      displayFileIds
        .filter((id): id is string => id !== null)
        .map((id, index) => ({ id, index })),
    [displayFileIds],
  );

  const selectedKeys: Selection = useMemo(
    () => new Set(selectedFileIds),
    [selectedFileIds],
  );

  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      if (keys === "all") {
        storeApi.getState().actions.selectAllFiles();
        return;
      }
      const fileIds = Array.from(keys) as string[];
      storeApi.getState().actions.selectFiles({ fileIds, reset: true });
    },
    [storeApi],
  );

  const handleAction = useCallback(
    (key: Key) => {
      const fileId = key as string;
      const file: Nullable<FileData> = fileMap[fileId] ?? null;
      const index = displayFileIds.indexOf(fileId);
      if (!file) return;

      storeApi.getState().actions.requestFileAction(FbActions.MouseClickFile, {
        clickType: "double",
        file,
        fileDisplayIndex: index,
        altKey: false,
        ctrlKey: false,
        shiftKey: false,
      });
    },
    [storeApi, displayFileIds, fileMap],
  );

  const handleItemContextMenu = useCallback(
    (event: React.MouseEvent, fileId: string) => {
      event.preventDefault();
      event.stopPropagation();

      storeApi.getState().actions.requestFileAction(FbActions.OpenFileContextMenu, {
        clientX: event.clientX,
        clientY: event.clientY,
        triggerFileId: fileId,
      });
    },
    [storeApi],
  );

  const handleEmptyAreaPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (event.button !== 0) return;
      const target = event.target as HTMLElement;
      if (target.closest("[data-file-id]")) return;
      event.preventDefault();
      event.stopPropagation();
      storeApi.getState().actions.clearSelection();
    },
    [storeApi],
  );

  const getTextValue = useCallback(
    (item: FileGridItem) => fileMap[item.id]?.name ?? "Loading...",
    [fileMap],
  );

  const isList = viewMode === FileViewMode.List;

  const virtualizerLayout = isList ? ListLayout : GridLayout;

  const virtualizerLayoutOptions = useMemo(
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

  if (items.length === 0) {
    return (
      <div className="flex-1 pl-2 pb-2 rounded-b-3xl min-h-0">
        <FileListEmpty />
      </div>
    );
  }

  return (
    <div
      className="flex-1 pl-2 pb-2 rounded-b-3xl min-h-0"
      onPointerDownCapture={handleEmptyAreaPointerDown}
    >
      <Virtualizer
        layout={virtualizerLayout}
        layoutOptions={virtualizerLayoutOptions}
      >
        {isList ? (
          <ListBox
            aria-label="File browser"
            selectionMode="multiple"
            selectionBehavior="replace"
            selectedKeys={selectedKeys}
            onSelectionChange={handleSelectionChange}
            onAction={handleAction}
            items={items}
            className="size-full p-0 relative overflow-y-auto"
          >
            {(item: FileGridItem) => (
              <ListBox.Item
                key={item.id}
                id={item.id}
                data-file-id={item.id}
                textValue={getTextValue(item)}
                className="w-full mt-0.5 data-[selected=true]:bg-accent-soft"
                onContextMenu={(event) => handleItemContextMenu(event, item.id)}
              >
                <FileItemContent fileId={item.id} viewMode={viewMode} />
              </ListBox.Item>
            )}
          </ListBox>
        ) : (
          <StyledGridList
            aria-label="File browser"
            selectionMode="multiple"
            selectionBehavior="replace"
            selectedKeys={selectedKeys}
            onSelectionChange={handleSelectionChange}
            onAction={handleAction}
            layout="grid"
            items={items}
            style={{ display: "block" }}
          >
            {(item: FileGridItem) => (
              <StyledGridListItem
                key={item.id}
                id={item.id}
                data-file-id={item.id}
                textValue={getTextValue(item)}
                onContextMenu={(event) => handleItemContextMenu(event, item.id)}
              >
                <FileItemContent fileId={item.id} viewMode={viewMode} />
              </StyledGridListItem>
            )}
          </StyledGridList>
        )}
      </Virtualizer>
    </div>
  );
});
FileGrid.displayName = "FileGrid";
