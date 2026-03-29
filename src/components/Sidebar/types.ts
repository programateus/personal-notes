import type { FileNode, FileType } from "@/electron";

export type FileNodeState = Omit<FileNode, "children"> & {
  isRenaming?: boolean;
  isNewFile?: boolean;
  children?: FileNodeState[];
};

export interface SidebarProps {
  onFileSelect: (path: string) => void;
  onFileRename: (oldPath: string, newPath: string) => void;
}

export interface SidebarRef {
  loadFolder: (path: string) => Promise<void>;
  addNewFileNode: (type: FileType, path: string) => void;
}
