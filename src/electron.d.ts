export {};

export type FileType = "file" | "directory";

export type FileNode = {
  name: string;
  path: string;
  type: FileType;
  children?: FileNode[];
};

type MenuChannel = "menu:open" | "menu:save" | "menu:close-tab";

export interface ElectronAPI {
  openDirectory: () => Promise<string | null>;
  readDirectory: (dirPath: string) => Promise<FileNode[]>;
  createDirectory: (dirPath: string) => Promise<void>;
  readFile: (filePath: string) => Promise<string>;
  writeFile: (filePath: string, content: string) => Promise<void>;
  renameFile: (oldPath: string, newPath: string) => Promise<void>;
  deleteFile: (filePath: string) => Promise<void>;
  onMenuAction: (channel: MenuChannel, callback: (...args: unknown[]) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
