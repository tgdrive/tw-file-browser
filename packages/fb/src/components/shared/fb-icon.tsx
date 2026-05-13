import React from "react";
import { FbIconName } from "@/util/enums";
import type { FbIconProps } from "@/types/icons.types";
import IconFaSolidCircleNotch from "~icons/fa-solid/circle-notch";
import IconFaSolidChevronDown from "~icons/fa-solid/chevron-down";
import IconFaSolidMinus from "~icons/fa-solid/minus";
import IconFaSolidSquareArrowUpRight from "~icons/fa6-solid/square-arrow-up-right";
import IconFaSolidPlay from "~icons/fa-solid/play";
import IconFaSolidPlus from "~icons/fa-solid/plus";
import IconFaSolidBoxOpen from "~icons/fa-solid/box-open";
import IconIcRoundArrowBack from "~icons/ic/round-arrow-back";
import IconFaSolidCopy from "~icons/fa-solid/copy";
import IconMaterialSymbolsEditSquareOutlineRounded from "~icons/material-symbols/edit-square-outline-rounded";
import IconClarityPasteSolid from "~icons/clarity/paste-solid";
import IconFaSolidShareAlt from "~icons/fa-solid/share-alt";
import IconFaSolidSearch from "~icons/fa-solid/search";
import IconFaSolidObjectGroup from "~icons/fa-solid/object-group";
import IconFaSolidEraser from "~icons/fa-solid/eraser";
import IconMdiCancelBold from "~icons/mdi/cancel-bold";
import IconFaSolidCut from "~icons/fa-solid/cut";
import IconPhSelectionAllBold from "~icons/ph/selection-all-bold";
import IconFaSolidSortAmountDownAlt from "~icons/fa-solid/sort-amount-down-alt";
import IconFaSolidSortAmountUpAlt from "~icons/fa-solid/sort-amount-up-alt";
import IconFa6SolidToggleOn from "~icons/fa6-solid/toggle-on";
import IconFa6SolidToggleOff from "~icons/fa6-solid/toggle-off";
import IconFaSolidList from "~icons/fa-solid/list";
import IconFaSolidThList from "~icons/fa-solid/th-list";
import IconFaSolidTh from "~icons/fa-solid/th";
import IconFaSolidThLarge from "~icons/fa-solid/th-large";
import IconIcOutlineFolderOpen from "~icons/ic/outline-folder-open";
import IconFaSolidFolderPlus from "~icons/fa-solid/folder-plus";
import IconFaSolidFolderOpen from "~icons/fa-solid/folder-open";
import IconFaSolidChevronRight from "~icons/fa-solid/chevron-right";
import IconFaSolidDownload from "~icons/fa-solid/download";
import IconFaSolidUpload from "~icons/fa-solid/upload";
import IconFa6SolidTrashCan from "~icons/fa6-solid/trash-can";
import IconFaSolidExclamationTriangle from "~icons/fa-solid/exclamation-triangle";
import IconFaSolidExternalLinkAlt from "~icons/fa-solid/external-link-alt";
import IconFaSolidEyeSlash from "~icons/fa-solid/eye-slash";
import IconFaSolidFile from "~icons/fa-solid/file";
import IconFaSolidBalanceScale from "~icons/fa-solid/balance-scale";
import IconFaSolidFileCode from "~icons/fa-solid/file-code";
import IconFaSolidCogs from "~icons/fa-solid/cogs";
import IconFaSolidCubes from "~icons/fa-solid/cubes";
import IconFaSolidDatabase from "~icons/fa-solid/database";
import IconFaSolidFileAlt from "~icons/fa-solid/file-alt";
import IconFaSolidFileArchive from "~icons/fa-solid/file-archive";
import IconFaSolidFileImage from "~icons/fa-solid/file-image";
import IconFa6SolidFileVideo from "~icons/fa6-solid/file-video";
import IconFaSolidInfoCircle from "~icons/fa-solid/info-circle";
import IconFaSolidKey from "~icons/fa-solid/key";
import IconFaSolidLock from "~icons/fa-solid/lock";
import IconIconamoonMusic1Bold from "~icons/iconamoon/music-1-bold";
import IconFaSolidTerminal from "~icons/fa-solid/terminal";
import IconFaSolidUsers from "~icons/fa-solid/users";
import IconFaBrandsLinux from "~icons/fa-brands/linux";
import IconFaBrandsUbuntu from "~icons/fa-brands/ubuntu";
import IconFaBrandsWindows from "~icons/fa-brands/windows";
import IconFaBrandsRust from "~icons/fa-brands/rust";
import IconFaBrandsPython from "~icons/fa-brands/python";
import IconFaBrandsNodeJs from "~icons/fa-brands/node-js";
import IconFaBrandsPhp from "~icons/fa-brands/php";
import IconFaBrandsGitAlt from "~icons/fa-brands/git-alt";
import IconFaSolidFilePdf from "~icons/fa-solid/file-pdf";
import IconFaSolidFileExcel from "~icons/fa-solid/file-excel";
import IconFaSolidFileWord from "~icons/fa-solid/file-word";
import IconFaSolidRunning from "~icons/fa-solid/running";
import IconMaterialSymbolsLightViewWeek from "~icons/material-symbols-light/view-week";
import IconMdiSortAlphabeticalAscending from "~icons/mdi/sort-alphabetical-ascending";
import IconMdiSortAlphabeticalDescending from "~icons/mdi/sort-alphabetical-descending";
import IconMdiSortCalendarAscending from "~icons/mdi/sort-calendar-ascending";
import IconMdiSortCalendarDescending from "~icons/mdi/sort-calendar-descending";
import IconIcOutlineSort from "~icons/ic/outline-sort";
import IconMaterialSymbolsViewAgenda from "~icons/material-symbols/view-agenda";
import IconSolarMenuDotsBold from "~icons/solar/menu-dots-bold";
import IconMajesticonsOpenLine from "~icons/majesticons/open-line";
import clsx from "clsx";

const IconMap = {
  // Misc
  [FbIconName.loading]: IconFaSolidCircleNotch,
  [FbIconName.dropdown]: IconFaSolidChevronDown,
  [FbIconName.placeholder]: IconFaSolidMinus,
  [FbIconName.newTab]: IconFaSolidSquareArrowUpRight,
  [FbIconName.play]: IconFaSolidPlay,
  [FbIconName.plus]: IconFaSolidPlus,
  [FbIconName.menu]: IconSolarMenuDotsBold,
  [FbIconName.openOptions]: IconMajesticonsOpenLine,

  // File Actions: File operations
  [FbIconName.openFiles]: IconFaSolidBoxOpen,
  [FbIconName.openParentFolder]: IconIcRoundArrowBack,
  [FbIconName.copy]: IconFaSolidCopy,
  [FbIconName.rename]: IconMaterialSymbolsEditSquareOutlineRounded,
  [FbIconName.paste]: IconClarityPasteSolid,
  [FbIconName.share]: IconFaSolidShareAlt,
  [FbIconName.search]: IconFaSolidSearch,
  [FbIconName.selectAllFiles]: IconFaSolidObjectGroup,
  [FbIconName.clearSelection]: IconFaSolidEraser,
  [FbIconName.cross]: IconMdiCancelBold,
  [FbIconName.cut]: IconFaSolidCut,
  [FbIconName.select]: IconPhSelectionAllBold,

  // File Actions: Sorting & options
  [FbIconName.sortAsc]: IconFaSolidSortAmountDownAlt,
  [FbIconName.sortDesc]: IconFaSolidSortAmountUpAlt,
  [FbIconName.sortNameAsc]: IconMdiSortAlphabeticalAscending,
  [FbIconName.sortNameDesc]: IconMdiSortAlphabeticalDescending,
  [FbIconName.sortDateAsc]: IconMdiSortCalendarAscending,
  [FbIconName.sortDateDesc]: IconMdiSortCalendarDescending,
  [FbIconName.toggleOn]: IconFa6SolidToggleOn,
  [FbIconName.toggleOff]: IconFa6SolidToggleOff,
  [FbIconName.sort]: IconIcOutlineSort,

  // File Actions: File Views
  [FbIconName.list]: IconFaSolidList,
  [FbIconName.compact]: IconFaSolidThList,
  [FbIconName.smallThumbnail]: IconFaSolidTh,
  [FbIconName.view]: IconMaterialSymbolsViewAgenda,
  [FbIconName.largeThumbnail]: IconFaSolidThLarge,
  [FbIconName.mediumThumbnail]: IconMaterialSymbolsLightViewWeek,

  // File Actions: Unsorted
  [FbIconName.folder]: IconIcOutlineFolderOpen,
  [FbIconName.folderCreate]: IconFaSolidFolderPlus,
  [FbIconName.folderOpen]: IconFaSolidFolderOpen,
  [FbIconName.folderChainSeparator]: IconFaSolidChevronRight,
  [FbIconName.download]: IconFaSolidDownload,
  [FbIconName.upload]: IconFaSolidUpload,
  [FbIconName.trash]: IconFa6SolidTrashCan,
  [FbIconName.fallbackIcon]: IconFaSolidExclamationTriangle,

  // File modifiers
  [FbIconName.symlink]: IconFaSolidExternalLinkAlt,
  [FbIconName.hidden]: IconFaSolidEyeSlash,

  // Generic file types
  [FbIconName.file]: IconFaSolidFile,
  [FbIconName.license]: IconFaSolidBalanceScale,
  [FbIconName.code]: IconFaSolidFileCode,
  [FbIconName.config]: IconFaSolidCogs,
  [FbIconName.model]: IconFaSolidCubes,
  [FbIconName.database]: IconFaSolidDatabase,
  [FbIconName.text]: IconFaSolidFileAlt,
  [FbIconName.archive]: IconFaSolidFileArchive,
  [FbIconName.image]: IconFaSolidFileImage,
  [FbIconName.video]: IconFa6SolidFileVideo,
  [FbIconName.info]: IconFaSolidInfoCircle,
  [FbIconName.key]: IconFaSolidKey,
  [FbIconName.lock]: IconFaSolidLock,
  [FbIconName.music]: IconIconamoonMusic1Bold,
  [FbIconName.terminal]: IconFaSolidTerminal,
  [FbIconName.users]: IconFaSolidUsers,

  // OS file types
  [FbIconName.linux]: IconFaBrandsLinux,
  [FbIconName.ubuntu]: IconFaBrandsUbuntu,
  [FbIconName.windows]: IconFaBrandsWindows,

  // Programming language file types
  [FbIconName.rust]: IconFaBrandsRust,
  [FbIconName.python]: IconFaBrandsPython,
  [FbIconName.nodejs]: IconFaBrandsNodeJs,
  [FbIconName.php]: IconFaBrandsPhp,

  // Development tools file types
  [FbIconName.git]: IconFaBrandsGitAlt,

  // Other program file types
  [FbIconName.pdf]: IconFaSolidFilePdf,
  [FbIconName.excel]: IconFaSolidFileExcel,
  [FbIconName.word]: IconFaSolidFileWord,
  [FbIconName.flash]: IconFaSolidRunning,
} as const;

export const FbIcon = React.memo((props: FbIconProps) => {
  const { icon, fixedWidth, className, ...otherProps } = props;
  let RealIcon: any;
  if (typeof icon === "function" || typeof icon == "object") RealIcon = icon;
  else RealIcon = IconMap[icon as keyof typeof IconMap] ?? IconMap.fallbackIcon;
  const iconProps = {
    ...otherProps,
    className: clsx(fixedWidth && "size-5 text-center", className),
  };
  return <RealIcon {...iconProps} />;
});
