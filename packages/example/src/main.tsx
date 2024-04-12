import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./globals.css";

import { VFSBrowser } from "./VFSBrowser";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <VFSBrowser />
  </React.StrictMode>,
);
