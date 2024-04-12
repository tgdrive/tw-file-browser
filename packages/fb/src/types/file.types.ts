import type { FbIconName } from "@/util/enums";
import { Nullable, Undefinable } from "tsdef";

export interface FileData {
  id: string; // (Required) String that uniquely identifies the file
  name: string; // (Required) Full name, e.g. `MyImage.jpg`
  ext?: string; // File extension, e.g. `.jpg`

  isDir?: boolean; // Is a directory, default: false
  isHidden?: boolean; // Is a hidden file, default: false
  isSymlink?: boolean; // Is a symlink, default: false
  isEncrypted?: boolean; // Is encrypted in some way, default: false
  openable?: boolean; // Can be opened, default: true
  selectable?: boolean; // Can be selected, default: true

  size?: number; // File size in bytes
  modDate?: Date | string; // Last change date (or its string representation)
  childrenCount?: number; // Number of files inside of a folder (only for folders)

  // Default preview overriding
  color?: string; // Color to use for this file
  icon?: FbIconName | string | any; // Icon to use for this file
  thumbnailUrl?: string; // Automatically load thumbnail from this URL
  folderChainIcon?: Nullable<FbIconName | string | any>; // Folder chain icon

  [property: string]: any; // Any other user-defined property
}

export type FileArray<FT extends FileData = FileData> = Nullable<FT>[];
export type FileFilter = (file: Nullable<FileData>) => boolean;

export type FileMap<FT extends FileData = FileData> = { [fileId: string]: FT };
export type FileIdTrueMap = { [fileId: string]: Undefinable<true> };
