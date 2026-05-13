import { Nullable } from "tsdef";

import { FileData } from "./file.types";

export interface I18nConfig {
  /**
   * The locale to use for formatting dates, numbers, and selecting
   * translations. Falls back to the browser default if not set.
   */
  locale?: string;
  /**
   * Custom formatters for file modification dates and file sizes.
   * These override the default formatters.
   */
  formatters?: Partial<FbFormatters>;
}

export interface FbFormatters {
  formatFileModDate: (
    file: Nullable<FileData>,
    dateFormatter: { format: (date: Date) => string },
  ) => Nullable<string>;
  formatFileSize: (file: Nullable<FileData>) => Nullable<string>;
}
