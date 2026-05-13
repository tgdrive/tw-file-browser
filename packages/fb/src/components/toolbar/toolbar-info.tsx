import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectionMode, selectSelectionSize } from "@/redux/selectors";
import { reduxActions } from "@/redux/reducers";
import { FbDispatch } from "@/types/redux.types";
import { FbIconName } from "@/util/enums";
import { Button } from "@heroui/react";
import { FbIcon } from "../shared/fb-icon";
import clsx from "clsx";

export interface ToolbarInfoProps {
  className?: string;
}

export const ToolbarInfo = React.memo(({ className }: ToolbarInfoProps) => {
  const selectionSize = useSelector(selectSelectionSize);
  const selectionMode = useSelector(selectSelectionMode);
  const dispatch: FbDispatch = useDispatch();

  const clearSelection = useCallback(
    () => dispatch(reduxActions.clearSelection()),
    [],
  );

  const enabled = (selectionSize && selectionSize > 0) || selectionMode;

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2",
        !enabled && "status-disabled",
        className,
      )}
    >
      <>
        <Button
          size="sm"
          className="text-inherit"
          variant="tertiary"
          isIconOnly
          onPress={clearSelection}
        >
          <FbIcon icon={FbIconName.cross} fixedWidth={true} />
        </Button>
        <p className="text-inherit text-label-large text-nowrap w-24">
          {`${selectionSize} selected`}
        </p>
      </>
    </div>
  );
});
