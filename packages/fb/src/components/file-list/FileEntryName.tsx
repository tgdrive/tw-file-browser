import React from "react";
import { Nullable } from "tsdef";

import { FileData } from "@/types/file.types";
import {
  useFileNameComponent,
  useModifierIconComponents,
} from "./FileEntry-hooks";

export interface FileEntryNameProps {
  file: Nullable<FileData>;
  className?: string;
}

export const FileEntryName = React.memo(
  ({ file, className }: FileEntryNameProps) => {
    const modifierIconComponents = useModifierIconComponents(file);

    return (
      <div className="flex items-center gap-1 truncate" title={file?.name}>
        {modifierIconComponents.length > 0 && (
          <span className="text-inherit relative text-sm pr-1">
            {modifierIconComponents}
          </span>
        )}
        <span className={className}>{file?.name}</span>
      </div>
    );
  },
);
FileEntryName.displayName = "FileEntryName";
