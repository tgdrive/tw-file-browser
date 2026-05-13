import React, { memo } from "react";
import { FileGrid } from "./file-grid";

export const FileList = memo(() => {
  return <FileGrid />;
});
FileList.displayName = "FileList";
