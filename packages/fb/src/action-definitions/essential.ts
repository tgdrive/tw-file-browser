import type {
  ChangeSelectionPayload, MoveFilesPayload,
  OpenFileContextMenuPayload, OpenFilesPayload, MouseClickFilePayload,
} from "@/types/action-payloads.types";
import { FileHelper } from "@/util/file-helper";
import { defineFileAction } from "@/util/helpers";
import { FbIconName } from "@/util/enums";
import { FbActions } from "./index";

export const EssentialActions = {
  MouseClickFile: defineFileAction(
    {
      id: "mouse_click_file",
      __payloadType: {} as MouseClickFilePayload,
    } as const,
    ({ payload, getState, getStore }) => {
      if (payload.clickType === "double") {
        if (FileHelper.isOpenable(payload.file)) {
          getStore().getState().actions.requestFileAction(FbActions.OpenFiles, {
            targetFile: payload.file,
            files: [payload.file],
          });
        }
        return false;
      }
      const state = getState();
      const store = getStore();
      const { file, fileDisplayIndex } = payload;
      const a = store.getState().actions;

      if (payload.shiftKey) {
        const lci = state.lastClickIndex;
        if (lci !== null && lci !== fileDisplayIndex) {
          const start = Math.min(lci, fileDisplayIndex);
          const end = Math.max(lci, fileDisplayIndex);
          const ids = state.displayFileIds
            .slice(start, end + 1)
            .filter((id) => id && FileHelper.isSelectable(state.fileMap[id])) as string[];
          if (payload.ctrlKey) for (const id of ids) a.selectFiles({ fileIds: [id], reset: false });
          else a.selectFiles({ fileIds: ids, reset: true });
          a.setLastClickIndex({ index: fileDisplayIndex, fileId: file.id });
          return false;
        }
      }

      if (payload.ctrlKey) a.toggleSelection({ fileId: file.id, exclusive: false });
      else a.selectFiles({ fileIds: [file.id], reset: true });
      a.setLastClickIndex({ index: fileDisplayIndex, fileId: file.id });
      return false;
    },
  ),

  OpenFiles: defineFileAction(
    { id: "open_files", __payloadType: {} as OpenFilesPayload } as const,
    ({ getState }) => {
      if (getState().disableSelection) return true;
      return false;
    },
  ),

  OpenParentFolder: defineFileAction(
    {
      id: "open_parent_folder",
      hotkeys: ["backspace"],
      button: {
        name: "Go up a directory",
        toolbar: true,
        contextMenu: false,
        icon: FbIconName.openParentFolder,
        iconOnly: true,
      },
      __payloadType: undefined,
    } as const,
    ({ getState, getStore }) => {
      const chain = getState().folderChain;
      const parentFolder = chain.length > 1 ? chain[chain.length - 2] : null;
      if (FileHelper.isOpenable(parentFolder)) {
        getStore().getState().actions.requestFileAction(FbActions.OpenFiles, {
          targetFile: parentFolder,
          files: [parentFolder],
        });
      }
    },
  ),
  MoveFiles: defineFileAction({ id: "move_files", __payloadType: {} as MoveFilesPayload } as const),

  ChangeSelection: defineFileAction(
    { id: "change_selection", __payloadType: {} as ChangeSelectionPayload } as const,
    ({ payload, getStore }) => {
      const a = getStore().getState().actions;
      if (payload.selection.size === 0) a.clearSelection();
      else a.selectFiles({ fileIds: Array.from(payload.selection), reset: true });
      return true;
    },
  ),

  SetSelection: defineFileAction({ id: "set_selection", __payloadType: undefined } as const),

  SelectMode: defineFileAction(
    {
      id: "select_mode",
      button: {
        name: "Select mode",
        toolbar: true,
        icon: FbIconName.select,
        iconOnly: true,
      },
      __payloadType: undefined,
    } as const,
    ({ getStore }) => {
      getStore().getState().actions.setSelectionMode(true);
    },
  ),

  PasteFiles: defineFileAction({ id: "paste_files", __payloadType: undefined } as const),
  RenameFile: defineFileAction({ id: "rename_file", __payloadType: undefined } as const),
  CutFiles: defineFileAction({ id: "cut_files", __payloadType: undefined } as const),
  DeleteFiles: defineFileAction({ id: "delete_files", __payloadType: undefined } as const),
  UploadFiles: defineFileAction({ id: "upload_files", __payloadType: undefined } as const),
  CreateFolder: defineFileAction({ id: "create_folder", __payloadType: undefined } as const),
  DownloadFiles: defineFileAction({ id: "download_files", __payloadType: undefined } as const),

  OpenFileContextMenu: defineFileAction(
    { id: "open_file_context_menu", __payloadType: {} as OpenFileContextMenuPayload } as const,
    ({ payload, getState, getStore }) => {
      const state = getState();
      const a = getStore().getState().actions;
      const tf = payload.triggerFileId ? state.fileMap[payload.triggerFileId] ?? null : null;
      if (tf) {
        if (!state.selectionMap[payload.triggerFileId!]) {
          if (FileHelper.isSelectable(tf)) a.selectFiles({ fileIds: [payload.triggerFileId!], reset: true });
          else a.clearSelection();
        }
      }
      a.showContextMenu({ triggerFileId: payload.triggerFileId ?? null, mouseX: payload.clientX, mouseY: payload.clientY });
      return true;
    },
  ),
};
