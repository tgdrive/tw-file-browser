import { Nullable } from "@/util/ts-types";

export interface ContextMenuConfig {
  triggerFileId: Nullable<string>;
  mouseX: number;
  mouseY: number;
}
