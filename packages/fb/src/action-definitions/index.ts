import { DefaultActions } from "./default";
import { EssentialActions } from "./essential";
import { ExtraActions } from "./extra";

export { OptionIds } from "./option-ids";

export const FbActions = {
  ...EssentialActions,
  ...DefaultActions,
  ...ExtraActions,
};

export const EssentialFileActions = [
  FbActions.MouseClickFile,
  FbActions.MoveFiles,
  FbActions.ChangeSelection,
  FbActions.OpenFiles,
  FbActions.OpenParentFolder,
  FbActions.OpenFileContextMenu,
  FbActions.SelectMode,
  FbActions.PasteFiles,
  FbActions.RenameFile,
  FbActions.CutFiles,
  FbActions.DeleteFiles,
  FbActions.UploadFiles,
  FbActions.CreateFolder,
  FbActions.DownloadFiles,
];

export const DefaultFileActions = [
  FbActions.OpenSelection,
  FbActions.SelectAllFiles,
  FbActions.ClearSelection,
  FbActions.EnableListView,
  FbActions.EnableGridView,
  FbActions.EnableTileView,
  FbActions.SortFilesByName,
  FbActions.SortFilesBySize,
  FbActions.SortFilesByDate,
  FbActions.ToggleHiddenFiles,
  FbActions.ToggleShowFoldersFirst,
  FbActions.FocusSearchInput,
];
