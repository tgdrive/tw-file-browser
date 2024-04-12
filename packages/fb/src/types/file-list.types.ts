import { Nullable } from "tsdef";

import { FileData } from "./file.types";

import type { StateSnapshot } from "react-virtuoso";

export interface FileEntryProps {
  file: Nullable<FileData>;
  selected: boolean;
}

export interface FileListProps {
  hasNextPage?: boolean;
  isNextPageLoading?: boolean;
  loadNextPage?: () => void;
  restoreStateFrom?: StateSnapshot;
}
