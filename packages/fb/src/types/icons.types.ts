import type { FbIconName } from "@/util/enums";
import type { ReactNode } from "react";
export interface FileIconData {
  icon: FbIconName | string;
  colorCode: number;
}

export interface FbIconProps {
  icon: FbIconName | string | React.ComponentType;
  className?: string;
  fixedWidth?: boolean;
  style?: React.CSSProperties;
}
