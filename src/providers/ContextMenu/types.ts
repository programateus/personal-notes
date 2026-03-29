import type { ComponentType } from "react";

export type ContextMenuOption = {
  label: string;
  icon: ComponentType;
  action: () => void;
  danger?: boolean;
};

export type ContextMenuContextType = {
  open: (options: ContextMenuOption[], x: number, y: number) => void;
  close: () => void;
};
