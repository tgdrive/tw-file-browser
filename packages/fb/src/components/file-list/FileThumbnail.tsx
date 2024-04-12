import clsx from "clsx";
import React from "react";

export interface FileThumbnailProps {
  thumbnailUrl: string;
}

export const FileThumbnail = React.memo(
  ({ thumbnailUrl }: FileThumbnailProps) => {
    const [loaded, setLoaded] = React.useState(false);
    return (
      <div className="size-full">
        <img
          onLoad={() => setLoaded(true)}
          src={thumbnailUrl}
          className={clsx(
            "absolute inset-0 object-contain w-full h-full opacity-0",
            loaded && "opacity-100 transition-opacity duration-300 ease-in-out",
          )}
        />
      </div>
    );
  },
);
FileThumbnail.displayName = "FileThumbnail";
