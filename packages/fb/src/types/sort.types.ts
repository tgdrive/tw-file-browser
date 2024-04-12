import { Nullable } from "tsdef";

import { FileData } from "./file.types";

export type FileSortKeySelector = (file: Nullable<FileData>) => any;
