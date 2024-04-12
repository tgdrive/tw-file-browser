import { IntlConfig, IntlShape } from "react-intl";
import { Nullable } from "tsdef";

import { FileData } from "./file.types";

export interface I18nConfig extends Partial<IntlConfig> {
  formatters?: Partial<FbFormatters>;
}

export interface FbFormatters {
  formatFileModDate: (
    intl: IntlShape,
    file: Nullable<FileData>,
  ) => Nullable<string>;
  formatFileSize: (
    intl: IntlShape,
    file: Nullable<FileData>,
  ) => Nullable<string>;
}
