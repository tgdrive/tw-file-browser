import React, { useCallback, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";

import { reduxActions } from "@/redux/reducers";
import { selectSearchString } from "@/redux/selectors";
import { useDebounce } from "@/util/hooks-helpers";
import { getI18nId, I18nNamespace } from "@/util/i18n";
import { FbDispatch } from "@/types/redux.types";

export const ToolbarSearch = React.memo(() => {
  const intl = useIntl();
  const searchPlaceholderString = intl.formatMessage({
    id: getI18nId(I18nNamespace.Toolbar, "searchPlaceholder"),
    defaultMessage: "Search",
  });

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
      // Remove focus from the search input field when user presses escape.
      // Note: We use KeyUp instead of KeyPress because some browser plugins can
      //       intercept KeyPress events with Escape key.
      //       @see https://stackoverflow.com/a/37461974
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
