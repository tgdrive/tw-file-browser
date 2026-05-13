import React, { memo } from "react";
import type { Nullable } from "tsdef";

import { selectFileData, selectIsFileSelected } from "@/redux/selectors";
import { useParamSelector } from "@/redux/store";
import { FileEntryProps } from "@/types/file-list.types";
import { FileHelper } from "@/util/file-helper";
import { ClickableWrapper } from "@/components/internal/clickable-wrapper";
import { useFileClickHandlers } from "./file-entry.hooks";
import { GridEntry } from "./grid-entry";
import { ListEntry } from "./list-entry";
import { FileViewMode } from "@/util/enums";
import clsx from "clsx";
import { TileEntry } from "./tile-entry";

export interface SmartFileEntryProps {
  fileId: Nullable<string>;
  displayIndex: number;
  fileViewMode: FileViewMode;
}

export const SmartFileEntry = memo(
  ({ fileId, displayIndex, fileViewMode }: SmartFileEntryProps) => {
    const file = useParamSelector(selectFileData, fileId);
    const selected = useParamSelector(selectIsFileSelected, fileId);

    const fileClickHandlers = useFileClickHandlers(file, displayIndex);
    const clickableWrapperProps = {
      className: clsx(
        "outline-none relative rounded-2xl",
        "data-[view=grid]:bg-accent-soft",
      ),
      "data-view": fileViewMode,
      selected,
      ...(FileHelper.isClickable(file) ? fileClickHandlers : undefined),
    };

    const fileEntryProps: FileEntryProps = {
      file,
      selected,
    };

    let EntryComponent: React.FC<FileEntryProps>;
    if (fileViewMode === FileViewMode.List) EntryComponent = ListEntry;
    else if (fileViewMode === FileViewMode.Grid) EntryComponent = GridEntry;
    else EntryComponent = TileEntry;

    return (
      <ClickableWrapper {...clickableWrapperProps}>
        <EntryComponent {...fileEntryProps} />
      </ClickableWrapper>
    );
  },
);
SmartFileEntry.displayName = "SmartFileEntry";
