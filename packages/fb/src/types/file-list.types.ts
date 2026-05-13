import { Nullable } from "@/util/utils";

import { FileData } from "./file.types";

export interface FileEntryProps {
  file: Nullable<FileData>;
  selected: boolean;
}
