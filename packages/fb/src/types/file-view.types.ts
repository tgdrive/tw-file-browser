import type { FileViewMode } from "@/util/enums";

export type FileViewConfig = {
  mode: FileViewMode.Grid | FileViewMode.List | FileViewMode.Tile;
};
