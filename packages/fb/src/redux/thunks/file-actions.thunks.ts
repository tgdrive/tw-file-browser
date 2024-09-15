import { Nilable } from "tsdef";

import {
	FbActions,
	DefaultFileActions,
	EssentialFileActions,
} from "@/action-definitions/index";
import {
	FileActionGroup,
	FileActionMenuItem,
} from "@/types/action-menus.types";
import { FileAction } from "@/types/action.types";
import { SortOrder } from "@/util/enums";
import { FbThunk } from "@/types/redux.types";
import { sanitizeInputArray } from "@/redux/files-transforms";
import { reduxActions } from "@/redux/reducers";
import {
	selectCleanFileIds,
	selectFileMap,
	selectHiddenFileIdMap,
	selectSelectionMap,
} from "@/redux/selectors";
/**
 * Merges multiple file action arrays into one while removing duplicates
 */
const mergeFileActionsArrays = (
	...fileActionArrays: FileAction[][]
): FileAction[] => {
	const seenActionIds = new Set<string>();
	const addToSeen = (a: FileAction) => !!seenActionIds.add(a.id);
	const wasNotSeen = (a: FileAction) => !seenActionIds.has(a.id);

	const duplicateFreeArrays = fileActionArrays.map((arr) => {
		const duplicateFreeArray = arr.filter(wasNotSeen);
		duplicateFreeArray.map(addToSeen);
		return duplicateFreeArray;
	});
	return new Array<FileAction>().concat(...duplicateFreeArrays);
};

export const thunkUpdateRawFileActions =
	(
		rawFileActions: FileAction[] | any,
		breakpoint: Nilable<string>,
		disableDefaultFileActions: Nilable<boolean | string[]>,
		disableEssentailFileActions: Nilable<boolean | string[]>,
	): FbThunk =>
	(dispatch) => {
		const { sanitizedArray, errorMessages } = sanitizeInputArray(
			"fileActions",
			rawFileActions,
		);

		// Add default actions unless user disabled them
		let defaultActionsToAdd: FileAction[];
		let essentialActionsToAdd: FileAction[];
		if (Array.isArray(disableDefaultFileActions)) {
			const disabledActionIds = new Set(disableDefaultFileActions);
			defaultActionsToAdd = DefaultFileActions.filter(
				(action) => !disabledActionIds.has(action.id),
			);
		} else if (disableDefaultFileActions) {
			defaultActionsToAdd = [];
		} else {
			defaultActionsToAdd = DefaultFileActions;
		}

		if (Array.isArray(disableEssentailFileActions)) {
			const disabledActionIds = new Set(disableEssentailFileActions);
			essentialActionsToAdd = EssentialFileActions.filter(
				(action) => !disabledActionIds.has(action.id),
			);
		} else if (disableEssentailFileActions) {
			essentialActionsToAdd = [];
		} else {
			essentialActionsToAdd = EssentialFileActions;
		}

		let fileActions = mergeFileActionsArrays(
			sanitizedArray,
			essentialActionsToAdd,
			defaultActionsToAdd,
		);
		const optionDefaults: any = {};
		fileActions.map((a) =>
			a.option ? (optionDefaults[a.option.id] = a.option.defaultValue) : null,
		);

		fileActions = fileActions.map((action) => {
			if (
				action.button &&
				breakpoint &&
				action.breakPointsOverrides?.[breakpoint]
			) {
				return {
					...action,
					button: {
						...action.button,
						...action.breakPointsOverrides[breakpoint],
					},
				};
			}
			return action;
		});

		dispatch(reduxActions.setRawFileActions(rawFileActions));
		dispatch(reduxActions.setFileActionsErrorMessages(errorMessages));
		dispatch(reduxActions.setFileActions(fileActions));
		dispatch(reduxActions.setOptionDefaults(optionDefaults));
		dispatch(thunkUpdateToolbarNContextMenuItems(fileActions));
	};

export const thunkUpdateToolbarNContextMenuItems =
	(fileActions: FileAction[]): FbThunk =>
	(dispatch, getState) => {
		const excludedToolbarFileActionIds = new Set<string>([
			FbActions.OpenParentFolder.id,
		]);

		const fileActionGroups = getState().fileActionGroups;

		type SeenGroupMap = { [groupName: string]: FileActionGroup };

		const toolbarItems: FileActionMenuItem[] = [];
		const toolbarGroupItems: FileActionGroup[] = [];
		const seenToolbarGroups: SeenGroupMap = {};

		const contextMenuItems: FileActionMenuItem[] = [];
		const seenContextMenuGroups: SeenGroupMap = {};

		const getGroup = (
			itemArray: FileActionMenuItem[],
			seenMap: SeenGroupMap,
			groupName: string,
		): FileActionGroup => {
			if (seenMap[groupName]) return seenMap[groupName];
			const group: FileActionGroup = {
				name: groupName,
				icon: fileActionGroups[groupName]?.icon,
				sortOrder: fileActionGroups[groupName]?.sortOrder || -1,
				fileActionIds: [],
				tooltip: fileActionGroups[groupName]?.tooltip,
			};
			itemArray.push(group);
			seenMap[groupName] = group;
			return group;
		};

		for (const action of fileActions) {
			const button = action.button;
			if (!button) continue;

			if (button.toolbar && !excludedToolbarFileActionIds.has(action.id)) {
				if (button.group) {
					const group = getGroup(
						toolbarGroupItems,
						seenToolbarGroups,
						button.group,
					);
					group.fileActionIds.push(action.id);
				} else {
					toolbarItems.push(action.id);
				}
			}

			if (button.contextMenu) {
				if (button.group) {
					const group = getGroup(
						contextMenuItems,
						seenContextMenuGroups,
						button.group,
					);
					group.fileActionIds.push(action.id);
				} else {
					contextMenuItems.push(action.id);
				}
			}
		}

		toolbarGroupItems.sort((a, b) => a.sortOrder - b.sortOrder);
		dispatch(
			reduxActions.updateFileActionMenuItems([
				[...toolbarItems, ...toolbarGroupItems],
				contextMenuItems,
			]),
		);
	};

export const thunkUpdateDefaultFileViewActionId =
	(fileActionId: Nilable<string>): FbThunk =>
	(dispatch, getState) => {
		const { fileActionMap } = getState();
		const action = fileActionId ? fileActionMap[fileActionId] : null;
		if (action && action.fileViewConfig) {
			dispatch(reduxActions.setFileViewConfig(action.fileViewConfig));
		}
	};

export const thunkActivateSortAction =
	(fileActionId: Nilable<string>, defaultOrder?: SortOrder): FbThunk =>
	(dispatch, getState) => {
		if (!fileActionId) return;

		const {
			sortActionId: oldActionId,
			sortOrder: oldOrder,
			fileActionMap,
		} = getState();
		const action = fileActionMap[fileActionId];
		if (!action || !action.sortKeySelector) return;

		let order = oldOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
		if (oldActionId !== fileActionId) {
			order = SortOrder.ASC;
			if (defaultOrder) order = defaultOrder;
		}

		dispatch(reduxActions.setSort({ actionId: fileActionId, order: order }));
	};

export const thunkApplySelectionTransform =
	(action: FileAction): FbThunk =>
	(dispatch, getState) => {
		const selectionTransform = action.selectionTransform;
		if (!selectionTransform) return;

		const state = getState();
		const prevSelection = new Set<string>(
			Object.keys(selectSelectionMap(state)),
		);
		const hiddenFileIds = new Set<string>(
			Object.keys(selectHiddenFileIdMap(state)),
		);

		const newSelection = selectionTransform({
			prevSelection,
			fileIds: selectCleanFileIds(state),
			fileMap: selectFileMap(state),
			hiddenFileIds,
		});
		if (!newSelection) return;

		if (newSelection.size === 0) {
			dispatch(reduxActions.clearSelection());
		} else {
			dispatch(
				reduxActions.selectFiles({
					fileIds: Array.from(newSelection),
					reset: true,
				}),
			);
		}
	};
