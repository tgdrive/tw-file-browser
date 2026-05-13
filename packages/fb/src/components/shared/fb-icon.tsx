import React from "react";
import { FbIconName } from "@/util/enums";
import type { FbIconProps } from "@/types/icons.types";
import IconFaSolidCircleNotch from "~icons/fa-solid/circle-notch";
import IconFaSolidShareAlt from "~icons/fa-solid/share-alt";
import IconFaSolidObjectGroup from "~icons/fa-solid/object-group";
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
import IconRiSortNumberAsc from '~icons/ri/sort-number-asc';
import IconRiSortNumberDesc from '~icons/ri/sort-number-desc';
import IconMdiSortAlphabeticalAscending from "~icons/mdi/sort-alphabetical-ascending";
import IconMdiSortAlphabeticalDescending from "~icons/mdi/sort-alphabetical-descending";
import IconMdiSortDateAscending from '~icons/mdi/sort-date-ascending';
import IconMdiSortDateDescending from '~icons/mdi/sort-date-descending';
import IconMdiSelectAll from '~icons/mdi/select-all';
import IconMdiContentPaste from '~icons/mdi/content-paste';
import IconGravityUiChevronDown from "~icons/gravity-ui/chevron-down";
import IconGravityUiMinus from "~icons/gravity-ui/minus";
import IconGravityUiPlayFill from "~icons/gravity-ui/play-fill";
import IconGravityUiPlus from "~icons/gravity-ui/plus";
import IconGravityUiEllipsis from "~icons/gravity-ui/ellipsis";
import IconGravityUiFolderArrowUp from "~icons/gravity-ui/folder-arrow-up";
import IconGravityUiCopy from "~icons/gravity-ui/copy";
import IconGravityUiPencilToLine from "~icons/gravity-ui/pencil-to-line";
import IconGravityUiMagnifier from "~icons/gravity-ui/magnifier";
import IconGravityUiEraser from "~icons/gravity-ui/eraser";
import IconGravityUiXmark from "~icons/gravity-ui/xmark";
import IconGravityUiScissors from "~icons/gravity-ui/scissors";
import IconGravityUiArrowDown from "~icons/gravity-ui/arrow-down";
import IconGravityUiArrowUp from "~icons/gravity-ui/arrow-up";
import IconGravityUiListUl from "~icons/gravity-ui/list-ul";
import IconGravityUiFolder from "~icons/gravity-ui/folder";
import IconGravityUiFolderOpen from "~icons/gravity-ui/folder-open";
import IconGravityUiChevronRight from "~icons/gravity-ui/chevron-right";
import IconGravityUiArrowDownFromLine from "~icons/gravity-ui/arrow-down-from-line";
import IconGravityUiArrowUpFromLine from "~icons/gravity-ui/arrow-up-from-line";
import IconGravityUiTrashBin from "~icons/gravity-ui/trash-bin";
import IconGravityUiTriangleExclamation from "~icons/gravity-ui/triangle-exclamation";
import IconGravityUiArrowUpRightFromSquare from "~icons/gravity-ui/arrow-up-right-from-square";
import IconGravityUiEyeSlash from "~icons/gravity-ui/eye-slash";
import IconGravityUiFile from "~icons/gravity-ui/file";
import IconGravityUiFileCode from "~icons/gravity-ui/file-code";
import IconGravityUiGear from "~icons/gravity-ui/gear";
import IconGravityUiCubes3 from "~icons/gravity-ui/cubes-3";
import IconGravityUiDatabase from "~icons/gravity-ui/database";
import IconGravityUiFileText from "~icons/gravity-ui/file-text";
import IconGravityUiArchive from "~icons/gravity-ui/archive";
import IconGravityUiVideo from "~icons/gravity-ui/video";
import IconGravityUiCircleInfo from "~icons/gravity-ui/circle-info";
import IconGravityUiKey from "~icons/gravity-ui/key";
import IconGravityUiLock from "~icons/gravity-ui/lock";
import IconGravityUiMusicNote from "~icons/gravity-ui/music-note";
import IconGravityUiTerminal from "~icons/gravity-ui/terminal";
import IconGravityUiPersons from "~icons/gravity-ui/persons";
import IconGravityUiBox from "~icons/gravity-ui/box";
import IconGravityUiLayoutList from "~icons/gravity-ui/layout-list";
import IconGravityUiLayoutCells from "~icons/gravity-ui/layout-cells";
import IconGravityUiLayoutCellsLarge from "~icons/gravity-ui/layout-cells-large";
import IconGravityUiLayoutHeaderCells from "~icons/gravity-ui/layout-header-cells";
import IconGravityUiFolderPlus from "~icons/gravity-ui/folder-plus";
import IconGravityUiScalesBalanced from "~icons/gravity-ui/scales-balanced";
import IconGravityUiPicture from "~icons/gravity-ui/picture";
import IconGravityUiToggleOn from "~icons/gravity-ui/toggle-on";
import IconGravityUiToggleOff from "~icons/gravity-ui/toggle-off";
import IconGravityUiArrowUpRight from '~icons/gravity-ui/arrow-up-right-from-square';
import IconGravityUiBarsDescending from '~icons/gravity-ui/bars-descending-align-left';
import clsx from "clsx";

const IconMap = {
  // Misc
  [FbIconName.loading]: IconFaSolidCircleNotch,
  [FbIconName.dropdown]: IconGravityUiChevronDown,
  [FbIconName.placeholder]: IconGravityUiMinus,
  [FbIconName.play]: IconGravityUiPlayFill,
  [FbIconName.plus]: IconGravityUiPlus,
  [FbIconName.menu]: IconGravityUiEllipsis,
  [FbIconName.openOptions]: IconGravityUiArrowUpRight,

  // File Actions: File operations
  [FbIconName.openFiles]: IconGravityUiBox,
  [FbIconName.openParentFolder]: IconGravityUiFolderArrowUp,
  [FbIconName.copy]: IconGravityUiCopy,
  [FbIconName.rename]: IconGravityUiPencilToLine,
  [FbIconName.paste]: IconMdiContentPaste,
  [FbIconName.share]: IconFaSolidShareAlt,
  [FbIconName.search]: IconGravityUiMagnifier,
  [FbIconName.selectAllFiles]: IconFaSolidObjectGroup,
  [FbIconName.clearSelection]: IconGravityUiEraser,
  [FbIconName.cross]: IconGravityUiXmark,
  [FbIconName.cut]: IconGravityUiScissors,
  [FbIconName.select]: IconMdiSelectAll,

  // File Actions: Sorting & options
  [FbIconName.sortAsc]: IconGravityUiArrowDown,
  [FbIconName.sortDesc]: IconGravityUiArrowUp,
  [FbIconName.sortNameAsc]: IconMdiSortAlphabeticalAscending,
  [FbIconName.sortNameDesc]: IconMdiSortAlphabeticalDescending,
  [FbIconName.sortDateAsc]: IconMdiSortDateAscending,
  [FbIconName.sortDateDesc]: IconMdiSortDateDescending,
  [FbIconName.sortSizeAsc]: IconRiSortNumberAsc,
  [FbIconName.sortSizeDesc]: IconRiSortNumberDesc,
  [FbIconName.toggleOn]: IconGravityUiToggleOn,
  [FbIconName.toggleOff]: IconGravityUiToggleOff,
  [FbIconName.sort]:  IconGravityUiBarsDescending,

  // File Actions: File Views
  [FbIconName.list]: IconGravityUiListUl,
  [FbIconName.compact]: IconGravityUiLayoutList,
  [FbIconName.smallThumbnail]: IconGravityUiLayoutCells,
  [FbIconName.view]: IconGravityUiLayoutHeaderCells,
  [FbIconName.largeThumbnail]: IconGravityUiLayoutCellsLarge,
  [FbIconName.mediumThumbnail]: IconGravityUiLayoutCells,

  // File Actions: Unsorted
  [FbIconName.folder]: IconGravityUiFolder,
  [FbIconName.folderCreate]: IconGravityUiFolderPlus,
  [FbIconName.folderOpen]: IconGravityUiFolderOpen,
  [FbIconName.folderChainSeparator]: IconGravityUiChevronRight,
  [FbIconName.download]: IconGravityUiArrowDownFromLine,
  [FbIconName.upload]: IconGravityUiArrowUpFromLine,
  [FbIconName.trash]: IconGravityUiTrashBin,
  [FbIconName.fallbackIcon]: IconGravityUiTriangleExclamation,

  // File modifiers
  [FbIconName.symlink]: IconGravityUiArrowUpRightFromSquare,
  [FbIconName.hidden]: IconGravityUiEyeSlash,

  // Generic file types
  [FbIconName.file]: IconGravityUiFile,
  [FbIconName.license]: IconGravityUiScalesBalanced,
  [FbIconName.code]: IconGravityUiFileCode,
  [FbIconName.config]: IconGravityUiGear,
  [FbIconName.model]: IconGravityUiCubes3,
  [FbIconName.database]: IconGravityUiDatabase,
  [FbIconName.text]: IconGravityUiFileText,
  [FbIconName.archive]: IconGravityUiArchive,
  [FbIconName.image]: IconGravityUiPicture,
  [FbIconName.video]: IconGravityUiVideo,
  [FbIconName.info]: IconGravityUiCircleInfo,
  [FbIconName.key]: IconGravityUiKey,
  [FbIconName.lock]: IconGravityUiLock,
  [FbIconName.music]: IconGravityUiMusicNote,
  [FbIconName.terminal]: IconGravityUiTerminal,
  [FbIconName.users]: IconGravityUiPersons,

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
