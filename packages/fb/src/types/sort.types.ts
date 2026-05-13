import { Nullable } from "@/util/ts-types";

import { FileData } from "./file.types";

export type FileSortKeySelector = (file: Nullable<FileData>) => any;
