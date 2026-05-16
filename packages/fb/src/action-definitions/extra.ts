import { FbIconName } from "../util/enums";
import { defineFileAction } from "../util/helpers";
import { EssentialActions } from "./essential";

export const ExtraActions = {
  CreateFolder: defineFileAction({
    id: "create_folder", ui: { name: "Create folder", toolbar: true, tooltip: "Create a folder", icon: FbIconName.folderCreate, group: "Add" },
  } as const),

  UploadFiles: defineFileAction({
    id: "upload_files", ui: { name: "Upload files", toolbar: true, tooltip: "Upload files", icon: FbIconName.upload, group: "Add" },
  } as const),

  DownloadFiles: defineFileAction({
    id: "download_files",
    target: { source: "selection-or-context-item", min: 1, filter: (f) => !f?.isDir },
    ui: { name: "Download", toolbar: true, contextMenu: true, icon: FbIconName.download, iconOnly: true },
    breakPointsOverrides: { sm: { group: "Actions" }, xs: { group: "Actions" } },
  } as const),

  DeleteFiles: defineFileAction({
    id: "delete_files", hotkeys: ["delete"],
    target: { source: "selection-or-context-item", min: 1 },
    ui: { name: "Delete", toolbar: true, contextMenu: true, iconOnly: true, icon: FbIconName.trash },
    breakPointsOverrides: { sm: { group: "Actions" }, xs: { group: "Actions" } },
  } as const),

  PasteFiles: defineFileAction(
    { id: "paste_files", hotkeys: ["ctrl+v"],
      ui: { name: "Paste", contextMenu: true, icon: FbIconName.paste, toolbar: true, iconOnly: true },
    } as const,
    ({ getState, getStore }) => {
      const state = getState();
      const a = getStore().getState().actions;
      if (state.cutState.files.length === 0) return undefined;
      const cf = state.folderChain.length > 0 ? state.folderChain[state.folderChain.length - 1] : null;
      if (cf?.id === state.cutState.source?.id) return undefined;
      a.requestFileAction(EssentialActions.MoveFiles, { source: state.cutState.source!, target: cf!, files: state.cutState.files! });
      a.setCutState({ files: [] });
      return undefined;
    },
  ),

  CutFiles: defineFileAction(
    { id: "cut_files", hotkeys: ["ctrl+x"],
      target: { source: "selection-or-context-item", min: 1 },
      ui: { name: "Cut", contextMenu: true, icon: FbIconName.cut, toolbar: true, iconOnly: true },
      breakPointsOverrides: { sm: { group: "Actions" }, xs: { group: "Actions" } },
    } as const,
    ({ state, getState, getStore }) => {
      const cf = getState().folderChain.length > 0 ? getState().folderChain[getState().folderChain.length - 1] : null;
      getStore().getState().actions.setCutState({ files: state.selectedFilesForAction, source: cf! });
      return undefined;
    },
  ),

  RenameFile: defineFileAction({
    id: "rename_file", hotkeys: ["f2"],
    target: { source: "selection-or-context-item", min: 1, max: 1 },
    ui: { name: "Rename", contextMenu: true, toolbar: true, iconOnly: true, icon: FbIconName.rename },
    breakPointsOverrides: { sm: { group: "Actions" }, xs: { group: "Actions" } },
  } as const),
};
