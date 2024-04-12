import { FbActions } from "@/action-definitions/index";
import { RootState } from "@/types/redux.types";
import { SortOrder } from "@/util/enums";

export const initialRootState: RootState = {
  instanceId: "FB_INVALID_ID",

  externalFileActionHandler: null,

  rawFileActions: [],
  fileActionsErrorMessages: [],
  fileActionMap: {},
  fileActionIds: [],
  toolbarItems: [],
  contextMenuItems: [],

  rawFolderChain: null,
  folderChainErrorMessages: [],
  folderChain: [],

  rawFiles: [],
  filesErrorMessages: [],
  fileMap: {},
  fileIds: [],
  cleanFileIds: [],
  fileActionGroups: {},
  sortedFileIds: [],
  hiddenFileIdMap: {},
  cutState: {
    files: [],
  },

  focusSearchInput: null,
  searchString: "",
  searchMode: "currentFolder",

  selectionMap: {},
  disableSelection: false,
  selectionMode: false,

  fileViewConfig: FbActions.EnableGridView.fileViewConfig,

  sortActionId: null,
  sortOrder: SortOrder.ASC,

  optionMap: {},

  thumbnailGenerator: null,
  doubleClickDelay: 300,
  clearSelectionOnOutsideClick: true,
  forceEnableOpenParent: false,
  hideToolbarInfo: false,

  lastClick: null,

  contextMenuMounted: false,
  contextMenuConfig: null,
};
