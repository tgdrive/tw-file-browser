import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocalizedStringFormatter } from "@react-aria/i18n";

import { reduxActions } from "@/redux/reducers";
import { selectSearchString } from "@/redux/selectors";
import { useDebounce } from "@/util/hooks-helpers";
import { getI18nId, I18nNamespace } from "@/util/i18n";
import { FbDispatch } from "@/types/redux.types";

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

  const dispatch: FbDispatch = useDispatch();
  const reduxSearchString = useSelector(selectSearchString);

  const [localSearchString, setLocalSearchString] = useState(reduxSearchString);
  const [debouncedLocalSearchString] = useDebounce(localSearchString, 50);

  useEffect(() => {
    dispatch(
      reduxActions.setFocusSearchInput(() => {
        if (searchInputRef.current) searchInputRef.current.focus();
      }),
    );
    return () => {
      dispatch(reduxActions.setFocusSearchInput(null));
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(reduxActions.setSearchString(debouncedLocalSearchString));
  }, [debouncedLocalSearchString, dispatch]);

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
        dispatch(reduxActions.setSearchString(""));
        if (searchInputRef.current) searchInputRef.current.blur();
      }
    },
    [dispatch],
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
