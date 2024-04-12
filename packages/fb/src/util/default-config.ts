import { FbActions } from "@/action-definitions/index";
import { FileBrowserProps } from "@/types/file-browser.types";
import { FbIconName, SortOrder } from "./enums";

export type FbConfig = Pick<
  FileBrowserProps,
  | "fileActions"
  | "onFileAction"
  | "thumbnailGenerator"
  | "doubleClickDelay"
  | "disableSelection"
  | "disableDefaultFileActions"
  | "hideToolbarInfo"
  | "forceEnableOpenParent"
  | "defaultSortActionId"
  | "defaultFileViewActionId"
  | "defaultSortOrder"
  | "clearSelectionOnOutsideClick"
  | "fileActionGroups"
  | "i18n"
>;

export const defaultConfig: FbConfig = {
  fileActions: null,
  onFileAction: null,
  thumbnailGenerator: null,
  doubleClickDelay: 300,
  disableSelection: false,
  disableDefaultFileActions: false,
  forceEnableOpenParent: false,
  hideToolbarInfo: false,
  defaultSortActionId: FbActions.SortFilesByName.id,
  defaultFileViewActionId: FbActions.EnableListView.id,
  defaultSortOrder: SortOrder.ASC,
  clearSelectionOnOutsideClick: true,
  fileActionGroups: {
    Options: {
      sortOrder: 4,
      icon: FbIconName.config,
      tooltip: "Options",
    },
    Sort: {
      sortOrder: 3,
      icon: FbIconName.sort,
      tooltip: "Sort Options",
    },
    View: {
      sortOrder: 2,
      icon: FbIconName.view,
      tooltip: "Layout Options",
    },
    Add: {
      sortOrder: 0,
      icon: FbIconName.plus,
      tooltip: "Create New Item",
    },
    Actions: {
      sortOrder: -1,
      icon: FbIconName.menu,
      tooltip: "File Actions",
    },
    OpenOptions: {
      sortOrder: 1,
      icon: FbIconName.openOptions,
      tooltip: "Open Options",
    },
  },
  i18n: {},
};

export const setFbDefaults = (config: Partial<FbConfig>) => {
  for (const key of Object.keys(defaultConfig)) {
    if (key in config) {
      defaultConfig[key] = config[key as keyof FbConfig] as any;
    }
  }
};
