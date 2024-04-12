import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectionMode, selectSelectionSize } from "@/redux/selectors";
import { reduxActions } from "@/redux/reducers";
import { FbDispatch } from "@/types/redux.types";
import { FbIconName } from "@/util/enums";
import { Button } from "@tw-material/react";
import { cn } from "@tw-material/theme";
import { FbIcon } from "./FbIcon";
import clsx from "clsx";

export interface ToolbarInfoProps {
  className?: string;
}

export const ToolbarInfo: React.FC<ToolbarInfoProps> = React.memo(
  ({ className }) => {
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
          !enabled && "text-on-surface/[0.38] pointer-events-none",
          className,
        )}
      >
        <>
          <Button
            size="sm"
            classNames={{
              base: "text-inherit",
            }}
            variant="text"
            isIconOnly
            onPress={clearSelection}
          >
            <FbIcon icon={FbIconName.cross} fixedWidth={true} />
          </Button>
          <p className="text-focus text-inherit text-label-large text-nowrap w-24">
            {`${selectionSize} selected`}
          </p>
        </>
      </div>
    );
  },
);
