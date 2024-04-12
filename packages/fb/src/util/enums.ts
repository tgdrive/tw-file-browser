export enum FbIconName {
  // Misc
  loading = "loading",
  dropdown = "dropdown",
  placeholder = "placeholder",
  newTab = "newTab",
  plus = "plus",
  menu = "menu",
  openOptions = "openOptions",

  // File Actions: File operations
  openFiles = "openFiles",
  openParentFolder = "openParentFolder",
  copy = "copy",
  paste = "paste",
  share = "share",
  search = "search",
  rename = "rename",
  selectAllFiles = "selectAllFiles",
  clearSelection = "clearSelection",
  play = "play",
  cross = "cross",
  cut = "cut",
  select = "select",

  // File Actions: Sorting & options
  sortAsc = "sortAsc",
  sortDesc = "sortDesc",
  toggleOn = "toggleOn",
  toggleOff = "toggleOff",
  sortNameAsc = "sortNameAsc",
  sortNameDesc = "sortNameDesc",
  sortDateAsc = "sortDateAsc",
  sortDateDesc = "sortDateDesc",
  sort = "sort",

  // File Actions: File Views
  list = "list",
  compact = "compact",
  view = "view",
  smallThumbnail = "smallThumbnail",
  largeThumbnail = "largeThumbnail",
  mediumThumbnail = "mediumThumbnail",

  // File Actions: Unsorted
  folder = "folder",
  folderCreate = "folderCreate",
  folderOpen = "folderOpen",
  folderChainSeparator = "folderChainSeparator",
  download = "download",
  upload = "upload",
  trash = "trash",
  fallbackIcon = "fallbackIcon",

  // File modifiers
  symlink = "symlink",
  hidden = "hidden",

  // Generic file types
  file = "file",
  license = "license",
  code = "code",
  config = "config",
  model = "model",
  database = "database",
  text = "text",
  archive = "archive",
  image = "image",
  video = "video",
  info = "info",
  key = "key",
  lock = "lock",
  music = "music",
  terminal = "terminal",
  users = "users",

  // OS file types
  linux = "linux",
  ubuntu = "ubuntu",
  windows = "windows",

  // Programming language file types
  rust = "rust",
  python = "python",
  nodejs = "nodejs",
  php = "php",

  // Development tools file types
  git = "git",

  // Other program file types
  pdf = "pdf",
  excel = "excel",
  word = "word",
  flash = "flash",
}

export enum CustomVisibilityState {
  Hidden,
  Disabled,
  Default,
  Active,
}

export enum FileViewMode {
  List = "list",
  Grid = "grid",
  Tile = "tile",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}
