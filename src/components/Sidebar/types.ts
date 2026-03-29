import type { FileNode, FileType } from "@/electron";

export type FileNodeState = FileNode & { isRenaming?: boolean; isNewFile?: boolean };

export interface SidebarProps {
  onFileSelect: (path: string) => void;
  onFileRename: (oldPath: string, newPath: string) => void;
}

export interface SidebarRef {
  loadFolder: (path: string) => Promise<void>;
  addNewFileNode: (type: FileType, path: string) => void;
}
