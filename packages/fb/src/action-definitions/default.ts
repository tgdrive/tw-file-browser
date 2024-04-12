import { Nullable } from "tsdef";

import { selectFocusSearchInput } from "@/redux/selectors";
import { thunkRequestFileAction } from "@/redux/thunks/dispatchers.thunks";
import { FileSelectionTransform } from "@/types/action.types";
import { FileData } from "@/types/file.types";
import { FileHelper } from "@/util/file-helper";
import { defineFileAction } from "@/util/helpers";
import { EssentialActions } from "./essential";
import { OptionIds } from "./option-ids";
import { FbIconName, FileViewMode } from "@/util/enums";
import { reduxActions } from "..";

export const DefaultActions = {
  /**
   * Action that can be used to open currently selected files.
   */
  OpenSelection: defineFileAction(
    {
      id: "open_selection",
      hotkeys: ["enter"],
      requiresSelection: true,
      fileFilter: FileHelper.isOpenable,
      button: {
        name: "Open selection",
        toolbar: true,
        contextMenu: true,
        group: "Options",
        icon: FbIconName.openFiles,
      },
    } as const,
    ({ state, reduxDispatch }) => {
      reduxDispatch(
        thunkRequestFileAction(EssentialActions.OpenFiles, {
          files: state.selectedFilesForAction!,
        }),
      );
      return undefined;
    },
  ),
  /**
   * Action that selects all files.
   */
  SelectAllFiles: defineFileAction({
    id: "select_all_files",
    hotkeys: ["ctrl+a"],
    button: {
      name: "Select all files",
      toolbar: true,
      contextMenu: true,
      group: "Options",
      icon: FbIconName.selectAllFiles,
    },
    selectionTransform: (({ fileIds, hiddenFileIds }) => {
      const newSelection = new Set<string>();
      fileIds.map((fileId) => {
        // We don't need to check if file is selectable because Fb does
        // it own checks internally.
        if (!hiddenFileIds.has(fileId)) newSelection.add(fileId);
      });
      return newSelection;
    }) as FileSelectionTransform,
  } as const),
  /**
   * Action that clear the file selection.
   */
  ClearSelection: defineFileAction({
    id: "clear_selection",
    hotkeys: ["escape"],
    button: {
      name: "Clear selection",
      toolbar: true,
      contextMenu: true,
      group: "Options",
      icon: FbIconName.clearSelection,
    },
    selectionTransform: (({ prevSelection }) => {
      if (prevSelection.size === 0) return null;
      return new Set<string>();
    }) as FileSelectionTransform,
  } as const),
  /**
   * Action that enables List view.
   */
  EnableListView: defineFileAction({
    id: "enable_list_view",
    fileViewConfig: {
      mode: FileViewMode.List,
    },
    button: {
      name: "Switch to List",
      toolbar: true,
      icon: FbIconName.list,
      group: "View",
    },
  } as const),
  /**
   * Action that enables Grid view.
   */
  EnableGridView: defineFileAction({
    id: "enable_grid_view",
    fileViewConfig: {
      mode: FileViewMode.Grid,
    },
    button: {
      name: "Switch to Grid",
      toolbar: true,
      icon: FbIconName.smallThumbnail,
      group: "View",
    },
  } as const),
  /**
   * Action that enables Grid view.
   */
  EnableTileView: defineFileAction({
    id: "enable_tile_view",
    fileViewConfig: {
      mode: FileViewMode.Tile,
    },
    button: {
      name: "Switch to Tile",
      toolbar: true,
      icon: FbIconName.mediumThumbnail,
      group: "View",
    },
  } as const),
  /**
   * Action that sorts files by `file.name`.
   */
  SortFilesByName: defineFileAction({
    id: "sort_files_by_name",
    sortKeySelector: (file: Nullable<FileData>) =>
      file ? file.name.toLowerCase() : undefined,
    button: {
      name: "Sort by name",
      toolbar: true,
      group: "Sort",
      ascIcon: FbIconName.sortNameAsc,
      descIcon: FbIconName.sortNameDesc,
    },
  } as const),
  /**
   * Action that sorts files by `file.size`.
   */
  SortFilesBySize: defineFileAction({
    id: "sort_files_by_size",
    sortKeySelector: (file: Nullable<FileData>) =>
      file ? file.size : undefined,
    button: {
      name: "Sort by size",
      toolbar: true,
      group: "Sort",
    },
  } as const),
  /**
   * Action that sorts files by `file.modDate`.
   */
  SortFilesByDate: defineFileAction({
    id: "sort_files_by_date",
    sortKeySelector: (file: Nullable<FileData>) =>
      file ? file.modDate : undefined,
    button: {
      name: "Sort by date",
      toolbar: true,
      group: "Sort",
      ascIcon: FbIconName.sortDateAsc,
      descIcon: FbIconName.sortDateDesc,
    },
  } as const),
  /**
   * Action that toggles whether hidden files are shown to the user or not.
   */
  ToggleHiddenFiles: defineFileAction({
    id: "toggle_hidden_files",
    hotkeys: ["ctrl+h"],
    option: {
      id: OptionIds.ShowHiddenFiles,
      defaultValue: true,
    },
    button: {
      name: "Show hidden files",
      toolbar: true,
      group: "Options",
    },
  } as const),
  /**
   * Action that toggles whether folders should appear before files regardless of
   * current sort function.
   */
  ToggleShowFoldersFirst: defineFileAction({
    id: "toggle_show_folders_first",
    option: {
      id: OptionIds.ShowFoldersFirst,
      defaultValue: true,
    },
    button: {
      name: "Show folders first",
      toolbar: true,
      group: "Options",
    },
  } as const),
  /**
   * Action that focuses the search input when it is dispatched.
   */
  FocusSearchInput: defineFileAction(
    {
      id: "focus_search_input",
      hotkeys: ["ctrl+f"],
    } as const,
    ({ getReduxState }) => {
      const focusSearchInput = selectFocusSearchInput(getReduxState());
      if (focusSearchInput) focusSearchInput();
    },
  ),
  SelectMode: defineFileAction(
    {
      id: "select_mode",
      button: {
        name: "Select Mode",
        toolbar: true,
        icon: FbIconName.select,
        iconOnly: true,
      },
    } as const,
    ({ reduxDispatch }) => {
      reduxDispatch(reduxActions.setSelectionMode(true));
      return undefined;
    },
  ),
};
