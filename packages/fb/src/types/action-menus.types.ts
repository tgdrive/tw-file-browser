import { Nullable } from "tsdef";
import { FbIconName } from "@/util/enums";

export interface FileActionGroup {
  name: string;
  sortOrder: number;
  icon?: Nullable<FbIconName | string>;
  fileActionIds: string[];
  tooltip?: string;
}

export interface ActionGroup {
  sortOrder: number;
  icon: Nullable<FbIconName | string>;
  tooltip?: string;
}

export type FileActionMenuItem = string | FileActionGroup;
