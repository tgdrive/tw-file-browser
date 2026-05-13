import { Nilable } from "@/util/ts-types";

import { FileData } from "./file.types";

export type ThumbnailGenerator = (
  file: FileData,
) => Nilable<string> | Promise<Nilable<string>>;
