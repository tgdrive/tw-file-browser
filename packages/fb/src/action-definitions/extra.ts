import { reduxActions } from "@/redux/reducers";
import { selectCurrentFolder } from "@/redux/selectors";
import { thunkRequestFileAction } from "@/redux/thunks/dispatchers.thunks";
import { FbIconName } from "@/util/enums";
import { defineFileAction } from "@/util/helpers";
import { EssentialActions } from "./essential";

export const ExtraActions = {
  /**
   * Action that adds a button to create a new folder.
   */
  CreateFolder: defineFileAction({
    id: "create_folder",
    button: {
      name: "Create folder",
      toolbar: true,
      tooltip: "Create a folder",
      icon: FbIconName.folderCreate,
      group: "Add",
    },
  } as const),
  /**
   * Action that adds a button to upload files.
   */
  UploadFiles: defineFileAction({
    id: "upload_files",
    button: {
      name: "Upload files",
      toolbar: true,
      tooltip: "Upload files",
      icon: FbIconName.upload,
      group: "Add",
    },
  } as const),
  /**
   * Action that adds a button to download files.
   */
  DownloadFiles: defineFileAction({
    id: "download_files",
    requiresSelection: true,
    fileFilter: (file) => !file?.isDir,
    button: {
      name: "Download",
      toolbar: true,
      contextMenu: true,
      icon: FbIconName.download,
      iconOnly: true,
    },
    breakPointsOverrides: {
      sm: {
        group: "Actions",
      },
      xs: {
        group: "Actions",
      },
    },
  } as const),
  /**
   * Action that adds a button and shortcut to delete files.
   */
  DeleteFiles: defineFileAction({
    id: "delete_files",
    requiresSelection: true,
    hotkeys: ["delete"],
    button: {
      name: "Delete",
      toolbar: true,
      contextMenu: true,
      iconOnly: true,
      icon: FbIconName.trash,
    },
    breakPointsOverrides: {
      sm: {
        group: "Actions",
      },
      xs: {
        group: "Actions",
      },
    },
  } as const),
  /**
   * Action that adds a button to paste files.
   */
  PasteFiles: defineFileAction(
    {
      id: "paste_files",
      hotkeys: ["ctrl+v"],
      button: {
        name: "Paste",
        contextMenu: true,
        icon: FbIconName.paste,
        toolbar: true,
        iconOnly: true,
      },
    } as const,
    ({ getReduxState, reduxDispatch }) => {
      const state = getReduxState();
      if (state.cutState.files.length == 0) return undefined;
      const target = selectCurrentFolder(state);
      if (target?.id === state.cutState.source?.id) return undefined;
      reduxDispatch(
        thunkRequestFileAction(EssentialActions.MoveFiles, {
          source: state.cutState?.source!,
          target: selectCurrentFolder(state)!,
          files: state.cutState?.files!,
        }),
      );
      reduxDispatch(
        reduxActions.setCutState({
          files: [],
        }),
      );
      return undefined;
    },
  ),

  CutFiles: defineFileAction(
    {
      id: "cut_files",
      requiresSelection: true,
      hotkeys: ["ctrl+x"],
      button: {
        name: "Cut",
        contextMenu: true,
        icon: FbIconName.cut,
        toolbar: true,
        iconOnly: true,
      },
      breakPointsOverrides: {
        sm: {
          group: "Actions",
        },
        xs: {
          group: "Actions",
        },
      },
    } as const,
    ({ state, reduxDispatch, getReduxState }) => {
      const curentFolder = selectCurrentFolder(getReduxState());
      reduxDispatch(
        reduxActions.setCutState({
          files: state.selectedFilesForAction,
          source: curentFolder!,
        }),
      );
      return undefined;
    },
  ),

  RenameFile: defineFileAction({
    id: "rename_file",
    requiresSelection: true,
    hotkeys: ["f2"],
    button: {
      name: "Rename",
      contextMenu: true,
      toolbar: true,
      iconOnly: true,
      icon: FbIconName.rename,
    },
    breakPointsOverrides: {
      sm: {
        group: "Actions",
      },
      xs: {
        group: "Actions",
      },
    },
  } as const),
};
