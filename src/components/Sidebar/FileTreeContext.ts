import { createContext, useContext } from "react";
import type { FileType } from "@/electron";
import type { FileNodeState } from "./types";

interface FileTreeContextValue {
  onFileSelect: (path: string) => void;
  onNodeSelect: (node: FileNodeState) => void;
  onExpand: (path: string) => void;
  onToggleFolder: (path: string) => void;
  onAddNew: (type: FileType, path: string) => void;
  onStartRenaming: (node: FileNodeState) => void;
  onFinishRenaming: (node: FileNodeState, newName: string) => void;
  onCancelRenaming: (node: FileNodeState) => void;
  loadingPaths: Set<string>;
  openPaths: Set<string>;
  selectedPath: string | undefined;
}

export const FileTreeContext = createContext<FileTreeContextValue | null>(null);

export function useFileTree() {
  const ctx = useContext(FileTreeContext);
  if (!ctx) throw new Error("useFileTree must be used within FileTreeContext.Provider");
  return ctx;
}
