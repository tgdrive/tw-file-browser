import React from "react";
import { useLocalizedStringFormatter } from "@react-aria/i18n";

import { FbIconName } from "../../util/enums";
import { getI18nId, I18nNamespace } from "../../util/i18n";
import { FbIcon } from "../shared/fb-icon";

const emptyMessages: Record<string, Record<string, string>> = {
  en: {
    [getI18nId(I18nNamespace.FileList, "nothingToShow")]: "Nothing to show",
  },
};

export const FileListEmpty = () => {
  const stringFormatter = useLocalizedStringFormatter(emptyMessages);

  const emptyString = (() => {
    try {
      return stringFormatter.format(
        getI18nId(I18nNamespace.FileList, "nothingToShow"),
      );
    } catch {
      return "Nothing to show";
    }
  })();

  return (
    <div
      className="text-headline-medium flex gap-2 items-center absolute 
      left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <FbIcon icon={FbIconName.folderOpen} />
      <span className="size-full">{emptyString}</span>
    </div>
  );
};
