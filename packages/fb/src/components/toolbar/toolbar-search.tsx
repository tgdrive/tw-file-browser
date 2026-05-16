import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocalizedStringFormatter } from "@react-aria/i18n";

import { useDebounce } from "../../util/hooks-helpers";
import { getI18nId, I18nNamespace } from "../../util/i18n";
import { useFbStore, useFbStoreApi } from "../../store/store";

const searchMessages: Record<string, Record<string, string>> = {
  en: {
    [getI18nId(I18nNamespace.Toolbar, "searchPlaceholder")]: "Search",
  },
};

export const ToolbarSearch = React.memo(() => {
  const stringFormatter = useLocalizedStringFormatter(searchMessages);

  const searchPlaceholderString = (() => {
    try {
      return stringFormatter.format(
        getI18nId(I18nNamespace.Toolbar, "searchPlaceholder"),
      );
    } catch {
      return "Search";
    }
  })();

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const reduxSearchString = useFbStore((s) => s.state.searchString);
  const storeApi = useFbStoreApi();

  const [localSearchString, setLocalSearchString] = useState(reduxSearchString);
  const [debouncedLocalSearchString] = useDebounce(localSearchString, 50);

  useEffect(() => {
    storeApi.getState().actions.setFocusSearchInput(() => {
      if (searchInputRef.current) searchInputRef.current.focus();
    });
    return () => {
      storeApi.getState().actions.setFocusSearchInput(null);
    };
  }, [storeApi]);

  useEffect(() => {
    storeApi.getState().actions.setSearchString(debouncedLocalSearchString);
  }, [debouncedLocalSearchString, storeApi]);

  const handleChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      setLocalSearchString(event.currentTarget.value);
    },
    [],
  );
  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        setLocalSearchString("");
        storeApi.getState().actions.setSearchString("");
        if (searchInputRef.current) searchInputRef.current.blur();
      }
    },
    [storeApi],
  );

  return (
    <input
      value={localSearchString}
      placeholder={searchPlaceholderString}
      onChange={handleChange}
      ref={searchInputRef}
      onKeyUp={handleKeyUp}
      type="search"
    />
  );
});
