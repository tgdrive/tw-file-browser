import { Nullable } from "tsdef";

import { FileData } from "./file.types";

export interface FileEntryProps {
  file: Nullable<FileData>;
  selected: boolean;
}
