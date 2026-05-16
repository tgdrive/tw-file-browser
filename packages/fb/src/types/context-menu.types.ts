import { Nullable } from "../util/utils";

export interface ContextMenuConfig {
  triggerFileId: Nullable<string>;
  mouseX: number;
  mouseY: number;
}
