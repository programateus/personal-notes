import type { FileNode, FileType } from "@/electron";

export type FileNodeState = FileNode & { isRenaming?: boolean };

export interface SidebarProps {
  onFileSelect: (path: string) => void;
}

export interface SidebarRef {
  loadFolder: (path: string) => Promise<void>;
  addNewFileNode: (type: FileType, path: string) => void;
}
