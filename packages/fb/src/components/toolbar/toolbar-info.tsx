import React, { useCallback } from "react";
import { useFbStore, useFbStoreApi } from "@/store/store";
import { FbIconName } from "@/util/enums";
import { Button } from "@heroui/react";
import { FbIcon } from "../shared/fb-icon";
import clsx from "clsx";

export interface ToolbarInfoProps {
  className?: string;
}

export const ToolbarInfo = React.memo(({ className }: ToolbarInfoProps) => {
  const storeApi = useFbStoreApi();
  const selectionSize = useFbStore((s) => Object.keys(s.state.selectionMap).length);
  const selectionMode = useFbStore((s) => s.state.selectionMode);

  const handleClearSelection = useCallback(
    () => storeApi.getState().actions.clearSelection(),
    [storeApi],
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
          variant="ghost"
          isIconOnly
          onPress={handleClearSelection}
        >
          <FbIcon icon={FbIconName.cross} fixedWidth={true} />
        </Button>
        <p className="text-nowrap">
          {`${selectionSize} selected`}
        </p>
      </>
    </div>
  );
});
