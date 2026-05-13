import type { FileSelectionTransform } from "@/types/action.types";
import { defineFileAction } from "@/util/helpers";
import { FbIconName, FileViewMode } from "@/util/enums";
import { FileHelper } from "@/util/file-helper";
import { EssentialActions } from "./essential";

export const DefaultActions = {
  /**
   * Action that can be used to open currently selected files.
   */
  OpenSelection: defineFileAction(
    {
      id: "open_selection",
      hotkeys: ["enter"],
      target: { source: "selection-or-context-item", min: 1, filter: (file) => FileHelper.isOpenable(file) },
      ui: {
        name: "Open selection",
        toolbar: true,
        contextMenu: true,
        group: "Options",
        icon: FbIconName.openFiles,
      },
    } as const,
    ({ state, getStore }) => {
      getStore().getState().actions.requestFileAction(EssentialActions.OpenFiles, {
        files: state.selectedFilesForAction!,
      }, {
        triggerFileId: state.contextMenuTriggerFile?.id ?? null,
      });
      return undefined;
    },
  ),

  /**
   * Action that selects all files.
   */
  SelectAllFiles: defineFileAction({
    id: "select_all_files",
    hotkeys: ["ctrl+a"],
    ui: {
      name: "Select all files",
      toolbar: true,
      contextMenu: true,
      group: "Options",
      icon: FbIconName.selectAllFiles,
    },
    steps: [{ type: "transform-selection", transform: (({ fileIds, hiddenFileIds }) => {
      const newSelection = new Set<string>();
      fileIds.forEach((fileId) => {
        if (!hiddenFileIds.has(fileId)) newSelection.add(fileId);
      });
      return newSelection;
    }) as FileSelectionTransform }],
  } as const),

  /**
   * Action that clears file selection.
   */
  ClearSelection: defineFileAction({
    id: "clear_selection",
    hotkeys: ["escape"],
    ui: {
      name: "Clear selection",
      toolbar: true,
      contextMenu: true,
      group: "Options",
      icon: FbIconName.clearSelection,
    },
    steps: [{ type: "transform-selection", transform: (({ prevSelection }) => {
      if (prevSelection.size === 0) return null;
      return new Set<string>();
    }) as FileSelectionTransform }],
  } as const),

  /**
   * Action that enables list view.
   */
  EnableListView: defineFileAction({
    id: "enable_list_view",
    steps: [{ type: "set-view", config: { mode: FileViewMode.List } }],
    ui: {
      name: "List view",
      toolbar: true,
      group: "View",
      icon: FbIconName.list,
    },
  } as const),

  /**
   * Action that enables grid view.
   */
  EnableGridView: defineFileAction({
    id: "enable_grid_view",
    steps: [{ type: "set-view", config: { mode: FileViewMode.Grid } }],
    ui: {
      name: "Grid view",
      toolbar: true,
      group: "View",
      icon: FbIconName.smallThumbnail,
    },
  } as const),

  SortFilesByName: defineFileAction({
    id: "sort_files_by_name",
    steps: [{ type: "sort", keySelector: (file) => file?.name }],
    ui: {
      name: "Sort by name",
      toolbar: true,
      group: "Sort",
      icon: FbIconName.sortNameAsc,
      ascIcon: FbIconName.sortNameAsc,
      descIcon: FbIconName.sortNameDesc,
    },
  } as const),

  SortFilesBySize: defineFileAction({
    id: "sort_files_by_size",
    steps: [{ type: "sort", keySelector: (file) => file?.size }],
    ui: {
      name: "Sort by size",
      toolbar: true,
      group: "Sort",
      ascIcon: FbIconName.sortSizeAsc,
      descIcon: FbIconName.sortSizeDesc,
    },
  } as const),

  SortFilesByDate: defineFileAction({
    id: "sort_files_by_date",
    steps: [{ type: "sort", keySelector: (file) => {
      if (typeof file?.modDate === "string") return new Date(file.modDate);
      return file?.modDate;
    } }],
    ui: {
      name: "Sort by date",
      toolbar: true,
      group: "Sort",
      icon: FbIconName.sortDateAsc,
      ascIcon: FbIconName.sortDateAsc,
      descIcon: FbIconName.sortDateDesc,
    },
  } as const),

  ToggleHiddenFiles: defineFileAction({
    id: "toggle_hidden_files",
    hotkeys: ["ctrl+h"],
    steps: [{ type: "toggle-option", optionId: "show_hidden_files", defaultValue: true }],
    ui: {
      name: "Show hidden files",
      toolbar: true,
      group: "Options",
      icon: FbIconName.hidden,
    },
  } as const),

  ToggleShowFoldersFirst: defineFileAction({
    id: "toggle_show_folders_first",
    steps: [{ type: "toggle-option", optionId: "show_folders_first", defaultValue: true }],
    ui: {
      name: "Show folders first",
      toolbar: true,
      group: "Options",
      icon: FbIconName.sort,
    },
  } as const),

  FocusSearchInput: defineFileAction(
    {
      id: "focus_search_input",
      hotkeys: ["ctrl+f"],
      ui: {
        name: "Search",
        icon: FbIconName.search,
        iconOnly: true,
      },
    } as const,
    ({ getState }) => {
      const fn = getState().focusSearchInput;
      if (fn) fn();
    },
  ),
};
