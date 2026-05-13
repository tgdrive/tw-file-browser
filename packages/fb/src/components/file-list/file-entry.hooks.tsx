import React, {
  HTMLProps,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { Nullable, Undefinable } from "tsdef";

import { selectThumbnailGenerator } from "@/redux/selectors";
import { FileData } from "@/types/file.types";
import { FbIconName } from "@/util/enums";
import { FileHelper } from "@/util/file-helper";
import { ColorsLight, useIconData } from "@/util/icon-helper";
import { Logger } from "@/util/logger";
import { FbIcon } from "@/components/shared/fb-icon";

export type FileEntryState = {
  childrenCount: Nullable<number>;
  color: string;
  icon: FbIconName | string;
  thumbnailUrl: Nullable<string>;
  selected: boolean;
};

export const useFileEntryHtmlProps = (
  file: Nullable<FileData>,
): HTMLProps<HTMLDivElement> => {
  return useMemo(() => {
    const dataProps: { [prop: string]: Undefinable<string> } = {
      "data-test-id": "file-entry",
      "data-file-id": file ? file.id : undefined,
    };

    return {
      role: "listitem",
      ...dataProps,
    };
  }, [file]);
};

export const useFileEntryState = (
  file: Nullable<FileData>,
  selected: boolean,
) => {
  const iconData = useIconData(file);
  const { thumbnailUrl } = useThumbnailUrl(file);

  return useMemo<FileEntryState>(() => {
    const iconSpin = !file;
    const icon = iconData.icon;

    return {
      childrenCount: FileHelper.getChildrenCount(file),
      icon: file && file.icon !== undefined ? file.icon : icon,
      iconSpin,
      thumbnailUrl,
      color:
        file && file.isDir ? "text-accent" : ColorsLight[iconData.colorCode],
      selected,
    };
  }, [file, iconData, selected, thumbnailUrl]);
};

export const useModifierIconComponents = (file: Nullable<FileData>) => {
  const modifierIcons: FbIconName[] = useMemo(() => {
    const modifierIcons: FbIconName[] = [];
    if (FileHelper.isHidden(file)) modifierIcons.push(FbIconName.hidden);
    if (FileHelper.isSymlink(file)) modifierIcons.push(FbIconName.symlink);
    if (FileHelper.isEncrypted(file)) modifierIcons.push(FbIconName.lock);
    return modifierIcons;
  }, [file]);
  const modifierIconComponents = useMemo(
    () =>
      modifierIcons.map((icon, index) => (
        <FbIcon key={`file-modifier-${index}`} icon={icon} />
      )),

    [FbIcon, modifierIcons],
  );
  return modifierIconComponents;
};

const _extname = (fileName: string) => {
  const parts = fileName.split(".");
  if (parts.length) {
    return `.${parts[parts.length - 1]}`;
  }
  return "";
};

export const useFileNameComponent = (file: Nullable<FileData>) => {
  return useMemo(() => {
    if (!file) return null;

    let name;
    let extension = "";

    const isDir = FileHelper.isDirectory(file as FileData);
    if (isDir) {
      name = file.name;
    } else {
      extension = file.ext ?? _extname(file.name);
      name = file.name.substring(0, file.name.length - extension.length);
    }

    return (
      <>
        {name}
        {extension && <span>{extension}</span>}
      </>
    );
  }, [file]);
};

export const useThumbnailUrl = (file: Nullable<FileData>) => {
  const thumbnailGenerator = useSelector(selectThumbnailGenerator);
  const [thumbnailUrl, setThumbnailUrl] = useState<Nullable<string>>(null);
  const [thumbnailLoading, setThumbnailLoading] = useState<boolean>(false);
  const loadingAttempts = useRef(0);

  useEffect(() => {
    let loadingCancelled = false;

    if (file) {
      if (thumbnailGenerator) {
        if (loadingAttempts.current === 0) {
          setThumbnailLoading(true);
        }
        loadingAttempts.current++;
        Promise.resolve()
          .then(() => thumbnailGenerator(file))
          .then((thumbnailUrl: any) => {
            if (loadingCancelled) return;
            setThumbnailLoading(false);

            if (thumbnailUrl && typeof thumbnailUrl === "string")
              setThumbnailUrl(thumbnailUrl);
            else setThumbnailUrl("");
          })
          .catch((error) => {
            if (!loadingCancelled) setThumbnailLoading(false);
            Logger.error(
              `User-defined "thumbnailGenerator" handler threw an error: ${error.message}`,
            );
          });
      } else if (file.thumbnailUrl) setThumbnailUrl(file.thumbnailUrl);
      else setThumbnailUrl("");
    }

    return () => {
      loadingCancelled = true;
    };
  }, [file, setThumbnailUrl, setThumbnailLoading, thumbnailGenerator]);

  return { thumbnailUrl, thumbnailLoading };
};
