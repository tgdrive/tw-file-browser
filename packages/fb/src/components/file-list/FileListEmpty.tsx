import React from "react";
import { useIntl } from "react-intl";

import { FbIconName } from "@/util/enums";
import { getI18nId, I18nNamespace } from "@/util/i18n";
import { FbIcon } from "../external/FbIcon";

export const FileListEmpty = () => {
  const intl = useIntl();
  const emptyString = intl.formatMessage({
    id: getI18nId(I18nNamespace.FileList, "nothingToShow"),
    defaultMessage: "Nothing to show",
  });

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
