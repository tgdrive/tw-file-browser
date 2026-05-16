import React, { type ReactNode, useMemo } from "react";
import { I18nProvider } from "@react-aria/i18n";
import shortid from "shortid";
import { FbStoreProvider } from "../../store/store";
import type {
  FileBrowserHandle,
  FileBrowserProps,
} from "../../types/file-browser.types";
import { defaultConfig } from "../../util/default-config";
import { getValueOrFallback } from "../../util/helpers";
import { useStaticValue } from "../../util/hooks-helpers";
import { FbFormattersContext, defaultFormatters } from "../../util/i18n";
import { FbBusinessLogic } from "./fb-business-logic";
import { FbPresentationLayer } from "./fb-presentation-layer";

export const FileBrowser = React.forwardRef<
  FileBrowserHandle,
  FileBrowserProps & { children?: ReactNode }
>((props, ref) => {
  const { instanceId, children } = props;

  const i18n = getValueOrFallback(props.i18n, defaultConfig.i18n);

  const formatters = useMemo(
    () => ({ ...defaultFormatters, ...i18n?.formatters }),
    [i18n],
  );

  const fBInstanceId = useStaticValue(() => instanceId ?? shortid.generate());

  const fBComps = (
    <>
      <FbBusinessLogic ref={ref} {...props} />
      <FbPresentationLayer>{children}</FbPresentationLayer>
    </>
  );

  return (
    <I18nProvider locale={i18n?.locale || "en"}>
      <FbFormattersContext.Provider value={formatters}>
        <FbStoreProvider instanceId={fBInstanceId}>
          {fBComps}
        </FbStoreProvider>
      </FbFormattersContext.Provider>
    </I18nProvider>
  );
});
FileBrowser.displayName = "FileBrowser";
