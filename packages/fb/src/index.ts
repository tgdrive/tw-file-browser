import type {
  GenericFileActionHandler,
  MapFileActionsToData,
} from "./types/action-handler.types";
import type { FbActionUnion } from "./types/file-browser.types";

export { FileBrowser } from "./components/external/FileBrowser";

export { FileNavbar } from "./components/external/FileNavbar";
export { FileToolbar } from "./components/external/FileToolbar";
export { FileList } from "./components/file-list/FileList";
export { FileContextMenu } from "./components/external/FileContextMenu";
export { FullFileBrowser } from "./components/external/FullFileBrowser";

export { FbIcon } from "./components/external/FbIcon";

export { FbActions, DefaultFileActions, OptionIds } from "./action-definitions";

export { defineFileAction } from "./util/helpers";
export { defaultConfig } from "./util/default-config";
export { FileHelper } from "./util/file-helper";
export { useIconData, ColorsLight } from "./util/icon-helper";

export type { FileData, FileArray } from "./types/file.types";

export type {
  FileAction,
  FileActionEffect,
  FileSelectionTransform,
  FileActionButton,
} from "./types/action.types";

export type {
  GenericFileActionHandler,
  MapFileActionsToData,
  FileActionData,
  FileActionState,
} from "./types/action-handler.types";
export type { FbActionUnion } from "./types/file-browser.types";
export type FbIconProps = import("./types/icons.types").FbIconProps;
export type {
  FileBrowserHandle,
  FileBrowserProps,
} from "./types/file-browser.types";
export type FileViewConfig = import("./types/file-view.types").FileViewConfig;
export type { ThumbnailGenerator } from "./types/thumbnails.types";

export type { I18nConfig, FbFormatters } from "./types/i18n.types";
export {
  defaultFormatters,
  getI18nId,
  getActionI18nId,
  I18nNamespace,
} from "./util/i18n";

export { setFbDefaults } from "./util/default-config";

export type FileActionHandler = GenericFileActionHandler<FbActionUnion>;
export type FbFileActionData = MapFileActionsToData<FbActionUnion>;
export * from "./util/enums";

// Extensions
export * from "./extensions";

// Redux/Store
export * from "./redux/reducers";
export * from "./redux/store";
export * from "./redux/selectors";
export {
  thunkDispatchFileAction,
  thunkRequestFileAction,
} from "./redux/thunks/dispatchers.thunks";
