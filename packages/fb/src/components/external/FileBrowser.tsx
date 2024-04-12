import React, { ReactNode, useMemo } from "react";
import { IntlProvider } from "react-intl";
import { Provider as ReduxProvider } from "react-redux";
import shortid from "shortid";
import { useFbStore } from "@/redux/store";
import {
  FileBrowserHandle,
  FileBrowserProps,
} from "@/types/file-browser.types";
import { defaultConfig } from "@/util/default-config";
import { getValueOrFallback } from "@/util/helpers";
import { useStaticValue } from "@/util/hooks-helpers";
import { FbFormattersContext, defaultFormatters } from "@/util/i18n";
import { FbBusinessLogic } from "@/components/internal/FbBusinessLogic";
import { FbPresentationLayer } from "@/components/internal/FbPresentationLayer";

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

  const store = useFbStore(fBInstanceId);

  const fBComps = (
    <>
      <FbBusinessLogic ref={ref} {...props} />
      <FbPresentationLayer>{children}</FbPresentationLayer>
    </>
  );

  return (
    <IntlProvider locale="en" defaultLocale="en" {...i18n}>
      <FbFormattersContext.Provider value={formatters}>
        <ReduxProvider store={store}>{fBComps}</ReduxProvider>
      </FbFormattersContext.Provider>
    </IntlProvider>
  );
});
FileBrowser.displayName = "FileBrowser";
