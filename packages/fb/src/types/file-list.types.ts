import { Nullable } from "@/util/ts-types";

import { FileData } from "./file.types";

export interface FileEntryProps {
  file: Nullable<FileData>;
  selected: boolean;
}
