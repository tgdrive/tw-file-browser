import { Nullable } from "../util/utils";

import { FileData } from "./file.types";

export type FileSortKeySelector = (file: Nullable<FileData>) => any;
