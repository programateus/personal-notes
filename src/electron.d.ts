export {};

export type FileNode = {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
};

type MenuChannel = "menu:open" | "menu:save" | "menu:close-tab";

declare global {
  interface Window {
    electronAPI: {
      openDirectory: () => Promise<string | null>;
      readDirectory: (dirPath: string) => Promise<FileNode[]>;
      readFile: (filePath: string) => Promise<string>;
      writeFile: (filePath: string, content: string) => Promise<void>;
      renameFile: (oldPath: string, newPath: string) => Promise<void>;
      deleteFile: (filePath: string) => Promise<void>;
      onMenuAction: (channel: MenuChannel, callback: (...args: unknown[]) => void) => () => void;
    };
  }
}
