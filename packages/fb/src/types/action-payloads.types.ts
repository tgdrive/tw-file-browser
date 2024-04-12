import { Nullable } from "tsdef";

import { FileArray, FileData } from "./file.types";

export interface MouseClickFilePayload {
  file: FileData;
  fileDisplayIndex: number;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  clickType: "single" | "double";
}

export type MoveFilesPayload = {
  files: FileArray;
  source: FileData;
  target: FileData;
};

export type ChangeSelectionPayload = { selection: Set<string> };

export interface OpenFilesPayload {
  targetFile?: FileData;
  files: FileData[];
}

export interface OpenFileContextMenuPayload {
  clientX: number;
  clientY: number;
  triggerFileId: Nullable<string>;
}
