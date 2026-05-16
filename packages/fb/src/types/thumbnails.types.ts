import { Nilable } from "../util/utils";

import { FileData } from "./file.types";

export type ThumbnailGenerator = (
  file: FileData,
) => Nilable<string> | Promise<Nilable<string>>;
