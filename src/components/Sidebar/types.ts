import type { FileNode, FileType } from "@/electron";

export type FileNodeState = Omit<FileNode, "children"> & {
  isRenaming?: boolean;
  isNewFile?: boolean;
  children?: FileNodeState[];
};

export interface SidebarProps {
  controller: SidebarController;
}

export interface SidebarControllerOptions {
  onFileSelect: (path: string) => void;
  onFileRename: (oldPath: string, newPath: string) => void;
}

export interface SidebarState {
  files: FileNodeState[];
  rootName: string | null;
  rootPath: string | null;
  loadingPaths: Set<string>;
  selectedNode: FileNodeState | null;
  openPaths: Set<string>;
}

export interface SidebarActions {
  loadFolder: (path: string) => Promise<void>;
  addNewFileNode: (type: FileType, path: string) => void;
  addNewFileFromSelection: (type: FileType) => void;
  selectNode: (node: FileNodeState) => void;
  toggleFolder: (path: string) => void;
  startRenaming: (node: FileNodeState) => void;
  finishRenaming: (node: FileNodeState, newName: string) => Promise<void>;
  cancelRenaming: (node: FileNodeState) => void;
  expandFolder: (path: string) => Promise<void>;
  openFile: (path: string) => void;
}

export interface SidebarController {
  state: SidebarState;
  actions: SidebarActions;
}
