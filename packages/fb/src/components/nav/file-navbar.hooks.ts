import { useMemo } from "react";
import type { Nullable } from "@/util/utils";

import { FbActions } from "@/action-definitions/index";
import { useFbStore, useFbStoreApi } from "@/store/store";
import type { FileData } from "@/types/file.types";
import { FileHelper } from "@/util/file-helper";

export interface FolderChainItem {
	file: Nullable<FileData>;
	disabled: boolean;
	onClick?: () => void;
}

export const useFolderChainItems = (): FolderChainItem[] => {
	const storeApi = useFbStoreApi();
	const folderChain = useFbStore((s) => s.state.folderChain);

	const folderChainItems = useMemo(() => {
		const items: FolderChainItem[] = [];
		if (!folderChain) return items;

		for (let i = 0; i < folderChain.length; ++i) {
			const file = folderChain[i];
			items.push({
				file,
				disabled: !file,
				onClick:
					!FileHelper.isOpenable(file) || i === folderChain.length - 1
						? undefined
						: () =>
            storeApi.getState().actions.requestFileAction(
                FbActions.OpenFiles,
                {
                    targetFile: file,
                    files: [file],
                },
            ),
			});
		}
		return items;
	}, [storeApi, folderChain]);
	return folderChainItems;
};
