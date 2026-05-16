import { MaybePromise, Nullable } from "../util/utils";

import { FileActionState } from "./action-handler.types";
import { FileViewConfig } from "./file-view.types";
import { FileFilter, FileMap } from "./file.types";
import { FileSortKeySelector } from "./sort.types";
import type { FbIconName, CustomVisibilityState } from "../util/enums";
import type { StoreApi } from "zustand";
import type { FbState, FbStore } from "../store/store";
export interface FileAction {
  /**
   * Unique file action ID. If you set the action ID to one of the built-in Fb
   * action action IDs, you custom action definition will override the built-in
   * definition.
   */
  id: string;
  /**
   * List of hotkeys that should trigger this action, defined using `hotkey-js`
   * notation.
   * @see https://www.npmjs.com/package/hotkeys-js
   */
  hotkeys?: string[] | readonly string[];
  /** Preferred UI metadata for toolbar/context-menu rendering. */
  ui?: FileActionUi;
  /**
   * Preferred target resolution rules for this action.
   */
  target?: FileActionTarget;
  /**
   * Preferred internal pipeline executed before effect/dispatch.
   */
  steps?: FileActionStep[];
  /**
   * Controls whether the external action handler is called.
   */
  dispatch?: "external" | "internal-only" | "after-steps";
  /**
   * When `breakPointsOverirdes` is specified, the action will override the button
   * settings. The breakpoints will be applied only when the
   * action is active.
   */
  breakPointsOverrides?: Record<string, Partial<FileActionUi>>;
  /**
   * When effect is defined, it will be called right before dispatching the action to
   * the user defined action handler. If the effect function returns a promise, Fb
   * will wait for the promise to resolve or fail before dispatching the action to the
   * handler. If this function returns `true`, the file action will NOT be dispatched
   * the the handler.
   */
  effect?: FileActionEffect;
  /**
   * When customVisibility is defined, it will change the display state of the file action
   * The function must return the visibility as one of the CustomVisibilityState values:
   *  - Hidden
   *  - Disabled
   *  - Default
   *  - Active
   */
  customVisibility?: () => CustomVisibilityState;
  /**
   * Field used to infer the type of action payload. It is used solely for Typescript
   * type inference and action validation.
   */
  __payloadType?: any;
  /**
   * Field used to infer the type of extra state for this action. It is used solely
   * for Typescript type inference and action validation.
   */
  __extraStateType?: any;
}

export interface FileActionButton {
  name: string; // Button name
  toolbar?: boolean; // Whether to show the button in the toolbar
  contextMenu?: boolean; // Whether to show the button in the context menu
  group?: string; // Button group (dropdown in toolbar or section in context menu)
  tooltip?: string; // Help tooltip text
  toolbarSortOrder?: number; // Sort order within the toolbar or context menu
  toolbarDropdownOrder?: number; // Sort order within the dropdown
  icon?: FbIconName | string | any; // Icon name
  iconOnly?: boolean; // Whether to only display the icon
  ascIcon?: FbIconName | string | any; // Asc Order Icon name
  descIcon?: FbIconName | string | any; // Asc Order Icon name
}

export interface FileActionUi extends FileActionButton {}

export interface FileActionTarget {
  source: "none" | "selection" | "context-item" | "selection-or-context-item";
  filter?: FileFilter;
  min?: number;
  max?: number;
}

export type FileActionStep =
  | { type: "set-view"; config: FileViewConfig }
  | { type: "toggle-option"; optionId: string; defaultValue?: boolean }
  | { type: "sort"; keySelector: FileSortKeySelector; actionId?: string; defaultOrder?: "ASC" | "DESC" }
  | { type: "transform-selection"; transform: FileSelectionTransform };

export interface FileActionInvocationContext {
  triggerFileId?: Nullable<string>;
}

export type FileSelectionTransform = (data: {
  prevSelection: Set<string>;
  fileIds: ReadonlyArray<string>;
  fileMap: Readonly<FileMap>;
  hiddenFileIds: Set<string>;
}) => Nullable<Set<string>>;

export type FileActionEffect<Action extends FileAction = any> = (data: {
  action: Action;
  payload: Action["__payloadType"];
  state: FileActionState<{}>;
  getState: () => FbState;
  getStore: () => StoreApi<FbStore>;
}) => MaybePromise<undefined | boolean | void>;

export type FileActionMap = { [actonId: string]: FileAction };
