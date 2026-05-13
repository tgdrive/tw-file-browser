import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  createContext,
  createElement,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import type { StoreApi } from "zustand";
import { sort } from "fast-sort";
import FuzzySearch from "fuzzy-search";
import { Nilable, Nullable } from "@/util/ts-types";
import type {
  GenericFileActionHandler, FileActionData, FileActionState,
} from "@/types/action-handler.types";
import type { ActionGroup, FileActionGroup, FileActionMenuItem } from "@/types/action-menus.types";
import type { FileAction, FileActionMap } from "@/types/action.types";
import type { ContextMenuConfig } from "@/types/context-menu.types";
import type { FileArray, FileData, FileFilter, FileIdTrueMap, FileMap } from "@/types/file.types";
import type { FileViewConfig } from "@/types/file-view.types";
import type { OptionMap } from "@/types/options.types";
import type { FileSortKeySelector } from "@/types/sort.types";
import type { ThumbnailGenerator } from "@/types/thumbnails.types";
import { FbActions, EssentialFileActions, DefaultFileActions } from "@/action-definitions/index";
import { OptionIds } from "@/action-definitions/option-ids";
import { sanitizeInputArray } from "@/util/files-transforms";
import { FileHelper } from "@/util/file-helper";
import { Logger } from "@/util/logger";
import { FileViewMode, SortOrder } from "@/util/enums";

// ============================================================
// State (no methods)
// ============================================================
export interface FbState {
  instanceId: string;
  externalFileActionHandler: Nullable<GenericFileActionHandler<FileAction>>;
  rawFileActions: FileAction[] | any;
  fileActionsErrorMessages: string[];
  fileActionMap: FileActionMap;
  fileActionIds: string[];
  toolbarItems: FileActionMenuItem[];
  contextMenuItems: FileActionMenuItem[];
  rawFolderChain: Nullable<FileArray> | any;
  folderChainErrorMessages: string[];
  folderChain: FileArray;
  rawFiles: FileArray | any;
  filesErrorMessages: string[];
  fileMap: FileMap;
  fileIds: Nullable<string>[];
  cleanFileIds: string[];
  cutState: { source?: FileData; files: FileArray };
  fileActionGroups: Record<string, ActionGroup>;
  focusSearchInput: Nullable<() => void>;
  searchString: string;
  searchMode: "currentFolder";
  selectionMap: Record<string, true>;
  disableSelection: boolean;
  selectionMode: boolean;
  fileViewConfig: FileViewConfig;
  sortActionId: Nullable<string>;
  sortOrder: SortOrder;
  optionMap: OptionMap;
  thumbnailGenerator: Nullable<ThumbnailGenerator>;
  doubleClickDelay: number;
  clearSelectionOnOutsideClick: boolean;
  forceEnableOpenParent: boolean;
  hideToolbarInfo: boolean;
  lastClick: Nullable<{ index: number; fileId: string }>;
  contextMenuMounted: boolean;
  contextMenuConfig: Nullable<ContextMenuConfig>;
  sortedFileIds: Nullable<string>[];
  hiddenFileIdMap: FileIdTrueMap;
  displayFileIds: Nullable<string>[];
  lastClickIndex: Nullable<number>;
}

// ============================================================
// Actions (all methods)
// ============================================================
export interface FbActions {
  setExternalFileActionHandler: (h: Nilable<GenericFileActionHandler<FileAction>>) => void;
  setRawFileActions: (a: FileAction[] | any) => void;
  setFileActionsErrorMessages: (m: string[]) => void;
  setFileActions: (a: FileAction[]) => void;
  setFileActionGroup: (g: Record<string, ActionGroup>) => void;
  updateFileActionMenuItems: (i: [FileActionMenuItem[], FileActionMenuItem[]]) => void;
  setRawFolderChain: (r: FileArray | any) => void;
  setRawFiles: (r: FileArray | any) => void;
  setCutState: (c: { files: FileArray; source?: FileData }) => void;
  setFocusSearchInput: (f: Nullable<() => void>) => void;
  setSearchString: (v: string) => void;
  selectAllFiles: () => void;
  selectFiles: (arg: { fileIds: string[]; reset: boolean }) => void;
  toggleSelection: (arg: { fileId: string; exclusive: boolean }) => void;
  setSelectionMode: (v: boolean) => void;
  clearSelection: () => void;
  setSelectionDisabled: (v: boolean) => void;
  setFileViewConfig: (c: FileViewConfig) => void;
  setSort: (arg: { actionId: string; order: SortOrder }) => void;
  setOptionDefaults: (o: OptionMap) => void;
  toggleOption: (id: string) => void;
  setThumbnailGenerator: (g: Nullable<ThumbnailGenerator>) => void;
  setDoubleClickDelay: (d: number) => void;
  setForceEnableOpenParent: (v: boolean) => void;
  setHideToolbarInfo: (v: boolean) => void;
  setClearSelectionOnOutsideClick: (v: boolean) => void;
  setLastClickIndex: (v: Nullable<{ index: number; fileId: string }>) => void;
  setContextMenuMounted: (v: boolean) => void;
  showContextMenu: (c: ContextMenuConfig) => void;
  hideContextMenu: () => void;
  updateTbAndCtxMenuItems: (a: FileAction[]) => void;
  updateRawFileActions: (raw: FileAction[] | any, bp: Nilable<string>, dd: Nilable<boolean | string[]>, de: Nilable<boolean | string[]>) => void;
  updateDefaultFileViewActionId: (id: Nilable<string>) => void;
  activateSortAction: (id: Nilable<string>, order?: SortOrder) => void;
  applySelectionTransform: (a: FileAction) => void;
  requestFileAction: <A extends FileAction>(a: A, p: A["__payloadType"]) => void;
}

// ============================================================
// Combined store — state + actions
// ============================================================
export interface FbStore {
  state: FbState;
  actions: FbActions;
}

// ============================================================
// Derived data helpers
// ============================================================
function computeSortedFileIds(
  fileIds: Nullable<string>[], sortOrder: SortOrder, fileMap: FileMap,
  sortActionId: Nullable<string>, optionMap: OptionMap, fileActionMap: FileActionMap,
): Nullable<string>[] {
  const action = sortActionId ? fileActionMap[sortActionId] : null;
  if (!action) return fileIds;
  const files = fileIds.map((fid) => (fid && fileMap[fid] ? fileMap[fid] : null));
  const sf = optionMap[OptionIds.ShowFoldersFirst] ?? false;
  const p = (s: FileSortKeySelector) => (f: Nullable<FileData>) => s(f);
  const fns: any[] = [];
  if (sf) fns.push({ desc: p(FileHelper.isDirectory) });
  if (action.sortKeySelector) fns.push({ [sortOrder === SortOrder.ASC ? "asc" : "desc"]: p(action.sortKeySelector) });
  if (!fns.length) return fileIds;
  for (const fn of fns) fn.comparer = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" }).compare;
  return sort([...files]).by(fns).map((f: Nullable<FileData>) => (f ? f.id : null));
}

function computeHiddenFileIdMap(cids: string[], fm: FileMap, ss: string, om: OptionMap): FileIdTrueMap {
  const sh = om[OptionIds.ShowHiddenFiles] ?? false;
  if (ss) {
    const cf = cids.map((id) => fm[id] ?? null) as FileData[];
    const sr = new FuzzySearch(cf, ["name"], { caseSensitive: false });
    const hits = new Set(sr.search(ss).map((f: FileData) => f.id));
    const h: FileIdTrueMap = {};
    for (const id of cids) { const f = fm[id]; if (!f) continue; if (!hits.has(id)) { h[id] = true; continue; } if (!sh && FileHelper.isHidden(f)) h[id] = true; }
    return h;
  }
  if (sh) return {};
  const h: FileIdTrueMap = {};
  for (const id of cids) if (fm[id] && FileHelper.isHidden(fm[id])) h[id] = true;
  return h;
}

function rdc(s: FbState) {
  s.sortedFileIds = computeSortedFileIds(s.fileIds, s.sortOrder, s.fileMap, s.sortActionId, s.optionMap, s.fileActionMap);
  s.hiddenFileIdMap = computeHiddenFileIdMap(s.cleanFileIds, s.fileMap, s.searchString, s.optionMap);
  s.displayFileIds = s.sortedFileIds.filter((id) => !id || !s.hiddenFileIdMap[id]);
  s.lastClickIndex = (s.lastClick && s.lastClick.index <= s.displayFileIds.length - 1 && s.lastClick.fileId === s.displayFileIds[s.lastClick.index]) ? s.lastClick.index : null;
}

const mergeActions = (...arrays: FileAction[][]): FileAction[] => {
  const seen = new Set<string>(); const r: FileAction[] = [];
  for (const arr of arrays) for (const a of arr) if (!seen.has(a.id)) { seen.add(a.id); r.push(a); }
  return r;
};

// ============================================================
// Initial state
// ============================================================
const initState: FbState = {
  instanceId: "FB_INVALID_ID", externalFileActionHandler: null,
  rawFileActions: [], fileActionsErrorMessages: [], fileActionMap: {}, fileActionIds: [],
  toolbarItems: [], contextMenuItems: [],
  rawFolderChain: null, folderChainErrorMessages: [], folderChain: [],
  rawFiles: [], filesErrorMessages: [], fileMap: {}, fileIds: [], cleanFileIds: [],
  cutState: { files: [] }, fileActionGroups: {},
  focusSearchInput: null, searchString: "", searchMode: "currentFolder",
  selectionMap: {}, disableSelection: false, selectionMode: false,
  fileViewConfig: { mode: FileViewMode.Grid }, sortActionId: null, sortOrder: SortOrder.ASC, optionMap: {},
  thumbnailGenerator: null, doubleClickDelay: 300, clearSelectionOnOutsideClick: true,
  forceEnableOpenParent: false, hideToolbarInfo: false, lastClick: null,
  contextMenuMounted: false, contextMenuConfig: null,
  sortedFileIds: [], hiddenFileIdMap: {}, displayFileIds: [], lastClickIndex: null,
};

const initActions: FbActions = (() => {
  const s: any = {};
  const keys = [
    "setExternalFileActionHandler", "setRawFileActions", "setFileActionsErrorMessages",
    "setFileActions", "setFileActionGroup", "updateFileActionMenuItems", "setRawFolderChain",
    "setRawFiles", "setCutState", "setFocusSearchInput", "setSearchString", "selectAllFiles",
    "selectFiles", "toggleSelection", "setSelectionMode", "clearSelection", "setSelectionDisabled",
    "setFileViewConfig", "setSort", "setOptionDefaults", "toggleOption", "setThumbnailGenerator",
    "setDoubleClickDelay", "setForceEnableOpenParent", "setHideToolbarInfo",
    "setClearSelectionOnOutsideClick", "setLastClickIndex", "setContextMenuMounted",
    "showContextMenu", "hideContextMenu", "updateTbAndCtxMenuItems", "updateRawFileActions",
    "updateDefaultFileViewActionId", "activateSortAction", "applySelectionTransform", "requestFileAction",
  ];
  for (const k of keys) s[k] = () => {};
  return s as unknown as FbActions;
})();

// ============================================================
// Store factory
// ============================================================
export const createFbStore = (instanceId: string) => {
  let storeApi: StoreApi<FbStore>;
  const store = createStore<FbStore>()(
    immer((set, get) => ({
      state: { ...initState, instanceId },
      actions: {
        setExternalFileActionHandler(h) { set((s) => { s.state.externalFileActionHandler = h ?? null; }); },
        setRawFileActions(a) { set((s) => { s.state.rawFileActions = a; }); },
        setFileActionsErrorMessages(m) { set((s) => { s.state.fileActionsErrorMessages = m; }); },

        setFileActions(actions) {
          set((s) => {
            const m: FileActionMap = {};
            for (const a of actions) m[a.id] = a;
            s.state.fileActionMap = m as any;
            s.state.fileActionIds = actions.map((a) => a.id);
          });
        },

        setFileActionGroup(g) { set((s) => { s.state.fileActionGroups = g; }); },

        updateFileActionMenuItems([tb, ctx]) { set((s) => { s.state.toolbarItems = tb; s.state.contextMenuItems = ctx; }); },

        setRawFolderChain(raw) {
          set((s) => {
            const r = sanitizeInputArray("folderChain", raw);
            s.state.rawFolderChain = raw;
            s.state.folderChain = r.sanitizedArray;
            s.state.folderChainErrorMessages = r.errorMessages;
          });
        },

        setRawFiles(raw) {
          set((s) => {
            const { sanitizedArray: files, errorMessages } = sanitizeInputArray("files", raw);
            s.state.rawFiles = raw; s.state.filesErrorMessages = errorMessages;
            const fm: FileMap = {};
            for (const f of files) if (f) fm[f.id] = f;
            s.state.fileMap = fm;
            s.state.fileIds = files.map((f) => (f ? f.id : null));
            s.state.cleanFileIds = s.state.fileIds.filter(Boolean) as string[];
            for (const sel of Object.keys(s.state.selectionMap)) if (!fm[sel]) delete s.state.selectionMap[sel];
            rdc(s.state);
          });
        },

        setCutState(c) { set((s) => { s.state.cutState = c; }); },
        setFocusSearchInput(f) { set((s) => { s.state.focusSearchInput = f; }); },

        setSearchString(v) { set((s) => { s.state.searchString = v; rdc(s.state); }); },

        selectAllFiles() { set((s) => { for (const id of s.state.fileIds) if (id && FileHelper.isSelectable(s.state.fileMap[id])) s.state.selectionMap[id] = true; }); },

        selectFiles({ fileIds, reset }) {
          set((s) => {
            if (s.state.disableSelection) return;
            if (reset) s.state.selectionMap = {};
            for (const id of fileIds) if (id && FileHelper.isSelectable(s.state.fileMap[id])) s.state.selectionMap[id] = true;
          });
        },

        toggleSelection({ fileId, exclusive }) {
          set((s) => {
            if (s.state.disableSelection) return;
            if (exclusive) s.state.selectionMap = {};
            if (s.state.selectionMap[fileId]) delete s.state.selectionMap[fileId];
            else if (FileHelper.isSelectable(s.state.fileMap[fileId])) s.state.selectionMap[fileId] = true;
          });
        },

        setSelectionMode(v) { set((s) => { s.state.selectionMode = v; }); },

        clearSelection() {
          set((s) => {
            if (s.state.disableSelection) return;
            if (Object.keys(s.state.selectionMap).length) s.state.selectionMap = {};
            s.state.selectionMode = false;
          });
        },

        setSelectionDisabled(v) { set((s) => { s.state.disableSelection = v; if (Object.keys(s.state.selectionMap).length) s.state.selectionMap = {}; }); },
        setFileViewConfig(c) { set((s) => { s.state.fileViewConfig = c; }); },

        setSort({ actionId, order }) { set((s) => { s.state.sortActionId = actionId; s.state.sortOrder = order; rdc(s.state); }); },

        setOptionDefaults(o) { set((s) => { for (const id of Object.keys(o)) if (!(id in s.state.optionMap)) s.state.optionMap[id] = o[id]; }); },

        toggleOption(id) { set((s) => { s.state.optionMap[id] = !s.state.optionMap[id]; rdc(s.state); }); },

        setThumbnailGenerator(g) { set((s) => { s.state.thumbnailGenerator = g; }); },
        setDoubleClickDelay(d) { set((s) => { s.state.doubleClickDelay = d; }); },
        setForceEnableOpenParent(v) { set((s) => { s.state.forceEnableOpenParent = v; }); },
        setHideToolbarInfo(v) { set((s) => { s.state.hideToolbarInfo = v; }); },
        setClearSelectionOnOutsideClick(v) { set((s) => { s.state.clearSelectionOnOutsideClick = v; }); },

        setLastClickIndex(v) { set((s) => { s.state.lastClick = v; rdc(s.state); }); },
        setContextMenuMounted(v) { set((s) => { s.state.contextMenuMounted = v; }); },
        showContextMenu(c) { set((s) => { s.state.contextMenuConfig = c; }); },
        hideContextMenu() { set((s) => { if (s.state.contextMenuConfig) s.state.contextMenuConfig = null; }); },

        // Complex operations

        updateTbAndCtxMenuItems(fileActions) {
          const excluded = new Set<string>([FbActions.OpenParentFolder.id as string]);
          const groups = get().state.fileActionGroups;
          const seenTb: Record<string, FileActionGroup> = {};
          const seenCtx: Record<string, FileActionGroup> = {};
          const tb: FileActionMenuItem[] = [];
          const tbG: FileActionGroup[] = [];
          const ctx: FileActionMenuItem[] = [];
          const getGroup = (items: FileActionMenuItem[], seen: Record<string, FileActionGroup>, name: string) => {
            if (seen[name]) return seen[name];
            const g: FileActionGroup = { name, icon: groups[name]?.icon, sortOrder: groups[name]?.sortOrder || -1, fileActionIds: [], tooltip: groups[name]?.tooltip };
            items.push(g); seen[name] = g; return g;
          };
          for (const a of fileActions) {
            const btn = a.button; if (!btn) continue;
            if (btn.toolbar && !excluded.has(a.id)) { if (btn.group) getGroup(tbG, seenTb, btn.group).fileActionIds.push(a.id); else tb.push(a.id); }
            if (btn.contextMenu) { if (btn.group) getGroup(ctx, seenCtx, btn.group).fileActionIds.push(a.id); else ctx.push(a.id); }
          }
          tbG.sort((a, b) => a.sortOrder - b.sortOrder);
          set((s) => { s.state.toolbarItems = [...tb, ...tbG]; s.state.contextMenuItems = ctx; });
        },

        updateRawFileActions(raw, breakpoint, disableDefault, disableEssential) {
          const { sanitizedArray, errorMessages } = sanitizeInputArray("fileActions", raw);
          let defaults: FileAction[];
          if (Array.isArray(disableDefault)) { const d = new Set(disableDefault); defaults = DefaultFileActions.filter((a) => !d.has(a.id)); }
          else if (disableDefault) defaults = []; else defaults = [...DefaultFileActions];
          let essentials: FileAction[];
          if (Array.isArray(disableEssential)) { const d = new Set(disableEssential); essentials = EssentialFileActions.filter((a) => !d.has(a.id)); }
          else if (disableEssential) essentials = []; else essentials = [...EssentialFileActions];
          let fas = mergeActions(sanitizedArray, essentials, defaults);
          const opts: OptionMap = {};
          for (const a of fas) if (a.option) opts[a.option.id] = a.option.defaultValue;
          if (breakpoint) {
            fas = fas.map((a) => a.button && a.breakPointsOverrides?.[breakpoint] ? { ...a, button: { ...a.button, ...a.breakPointsOverrides[breakpoint] } } : a);
          }
          const store = get().actions;
          store.setRawFileActions(raw); store.setFileActionsErrorMessages(errorMessages);
          store.setFileActions(fas); store.setOptionDefaults(opts); store.updateTbAndCtxMenuItems(fas);
        },

        updateDefaultFileViewActionId(id) {
          const action = id ? get().state.fileActionMap[id] : null;
          if (action?.fileViewConfig) get().actions.setFileViewConfig(action.fileViewConfig);
        },

        activateSortAction(id, defaultOrder) {
          if (!id) return; const s = get().state; const a = s.fileActionMap[id];
          if (!a?.sortKeySelector) return;
          get().actions.setSort({ actionId: id, order: s.sortActionId === id ? (s.sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC) : defaultOrder ?? SortOrder.ASC });
        },

        applySelectionTransform(action) {
          if (!action.selectionTransform) return;
          const s = get().state;
          const result = action.selectionTransform({
            prevSelection: new Set(Object.keys(s.selectionMap)),
            fileIds: s.cleanFileIds, fileMap: s.fileMap,
            hiddenFileIds: new Set(Object.keys(s.hiddenFileIdMap)),
          });
          if (!result) return;
          if (result.size === 0) get().actions.clearSelection();
          else get().actions.selectFiles({ fileIds: Array.from(result), reset: true });
        },

        requestFileAction(action, payload) {
          const s = get().state;
          const a = get().actions;
          if (!s.fileActionMap[action.id]) Logger.warn(`Action "${action.id}" requested but not registered.`);

          const selectedFiles = Object.keys(s.selectionMap).map((id) => s.fileMap[id]);
          const tfId = s.contextMenuConfig?.triggerFileId ?? null;
          const triggerFile = tfId ? s.fileMap[tfId] ?? null : null;
          const fallbackSelection = triggerFile ? [triggerFile] : [];
          const effectiveSelection = selectedFiles.length === 0 ? fallbackSelection : selectedFiles;
          const sfa = action.fileFilter ? effectiveSelection.filter(action.fileFilter) : effectiveSelection;
          if (action.requiresSelection && sfa.length === 0) { Logger.warn(`Action "${action.id}" requires selection but none found.`); return; }

          const actionState: FileActionState<{}> = {
            instanceId: s.instanceId, selectedFiles, selectedFilesForAction: sfa,
            contextMenuTriggerFile: triggerFile,
          };

          if (action.sortKeySelector) a.activateSortAction(action.id);
          if (action.fileViewConfig) a.setFileViewConfig(action.fileViewConfig);
          if (action.option) a.toggleOption(action.option.id);
          if (action.selectionTransform) a.applySelectionTransform(action);

          const effect = action.effect;
          const promise: any = effect
            ? effect({ action, payload, state: actionState, getState: () => ({ ...get().state }), getStore: () => storeApi })
            : undefined;

          const dispatch = (prevented?: boolean) => {
            if (prevented) return;
            const handler = get().state.externalFileActionHandler;
            if (handler) {
              Promise.resolve(handler({ id: action.id, action, payload, state: actionState }))
                .catch((err: Error) => Logger.error(`External handler threw: ${err.message}`));
            }
          };
          if (promise?.then) promise.then((r: boolean | undefined) => dispatch(r)).catch(() => dispatch());
          else dispatch(promise);
        },
      } as FbActions,
    })),
  );
  storeApi = store;
  return store;
};

// ============================================================
// React context + provider + hooks
// ============================================================
const FbStoreContext = createContext<StoreApi<FbStore> | null>(null);

export const FbStoreProvider = ({ instanceId, children }: { instanceId: string; children: ReactNode }) => {
  const ref = useRef<StoreApi<FbStore> | null>(null);
  if (!ref.current) ref.current = createFbStore(instanceId);
  return createElement(FbStoreContext.Provider, { value: ref.current, children });
};

export function useFbStore<T>(selector: (state: FbStore) => T): T {
  const store = useContext(FbStoreContext);
  if (!store) throw new Error("useFbStore must be used inside FbStoreProvider");
  return useStore(store, selector);
}

export function useFbStoreApi(): StoreApi<FbStore> {
  const store = useContext(FbStoreContext);
  if (!store) throw new Error("useFbStoreApi must be used inside FbStoreProvider");
  return store;
}

export { useShallow };
