import React from "react";

import {
  FileBrowserHandle,
  FileBrowserProps,
} from "@/types/file-browser.types";
import { FileList } from "@/components/file-list/FileList";
import { FileBrowser } from "./FileBrowser";
import { FileNavbar } from "./FileNavbar";
import { FileToolbar } from "./FileToolbar";
import { FileContextMenu } from "./FileContextMenu";

export const FullFileBrowser = React.memo(
  React.forwardRef<FileBrowserHandle, FileBrowserProps>((props, ref) => {
    return (
      <FileBrowser ref={ref} {...props}>
        {props.folderChain?.length ? <FileNavbar /> : undefined}
        <FileToolbar />
        <FileList />
        <FileContextMenu />
      </FileBrowser>
    );
  }),
);
FullFileBrowser.displayName = "FullFileBrowser";
