import { filesize } from "filesize";
import { createContext, useContext, useMemo } from "react";
import {
  useDateFormatter,
  useLocalizedStringFormatter,
} from "@react-aria/i18n";
import { Nullable, Undefinable } from "@/util/ts-types";

import { FileAction } from "@/types/action.types";
import { FileData } from "@/types/file.types";
import { FbFormatters } from "@/types/i18n.types";
import { FileHelper } from "./file-helper";

export enum I18nNamespace {
  Toolbar = "toolbar",
  FileList = "fileList",
  FileEntry = "fileEntry",
  FileContextMenu = "contextMenu",

  FileActions = "actions",
  FileActionGroups = "actionGroups",
}

export const getI18nId = (
  namespace: I18nNamespace,
  stringId: string,
): string => `Fb.${namespace}.${stringId}`;

export const getActionI18nId = (
  actionId: string,
  stringId: string,
): string => `Fb.${I18nNamespace.FileActions}.${actionId}.${stringId}`;

// ---- Default English messages ----

const defaultMessages: Record<string, Record<string, string>> = {
  en: {
    // Toolbar
    "Fb.toolbar.searchPlaceholder": "Search",
    // File list
    "Fb.fileList.nothingToShow": "Nothing to show",
  },
};

// ---- Hooks ----

export const useLocalizedFileActionGroup = (groupName: string) => {
  const stringFormatter = useLocalizedStringFormatter(defaultMessages);
  return useMemo(() => {
    const key = getI18nId(I18nNamespace.FileActionGroups, groupName);
    try {
      return stringFormatter.format(key);
    } catch {
      return groupName;
    }
  }, [groupName, stringFormatter]);
};

export const useLocalizedFileActionStrings = (
  action: Nullable<FileAction>,
) => {
  const stringFormatter = useLocalizedStringFormatter(defaultMessages);
  return useMemo(() => {
    if (!action) {
      return {
        actionName: "",
        actionTooltip: undefined,
      };
    }

    const ui = action.ui;
    const nameKey = getActionI18nId(action.id, "button.name");
    let actionName: string;
    try {
      actionName = stringFormatter.format(nameKey);
    } catch {
      actionName = ui?.name ?? "";
    }

    let actionTooltip: Undefinable<string> = undefined;
    if (ui?.tooltip) {
      const tooltipKey = getActionI18nId(action.id, "button.tooltip");
      try {
        actionTooltip = stringFormatter.format(tooltipKey);
      } catch {
        actionTooltip = ui?.tooltip;
      }
    }

    return {
      actionName,
      actionTooltip,
    };
  }, [action, stringFormatter]);
};

export const useLocalizedFileEntryStrings = (file: Nullable<FileData>) => {
  const formatters = useContext(FbFormattersContext);
  const dateFormatter = useDateFormatter({
    dateStyle: "medium",
    timeStyle: "short",
  });

  return useMemo(() => {
    return {
      fileModDateString: formatters.formatFileModDate(file, dateFormatter),
      fileSizeString: formatters.formatFileSize(file),
    };
  }, [file, formatters, dateFormatter]);
};

// ---- Default formatters ----

export const defaultFormatters: FbFormatters = {
  formatFileModDate: (
    file: Nullable<FileData>,
    dateFormatter: { format: (date: Date) => string },
  ): Nullable<string> => {
    const safeModDate = FileHelper.getModDate(file);
    if (safeModDate) {
      return dateFormatter.format(new Date(safeModDate));
    }
    return null;
  },
  formatFileSize: (file: Nullable<FileData>): Nullable<string> => {
    if (!file || typeof file.size !== "number") return null;
    return filesize(file.size, {
      standard: "jedec",
    });
  },
};

export const FbFormattersContext = createContext(defaultFormatters);
