import { contextBridge, ipcRenderer } from "electron";

type MenuChannel = "menu:open" | "menu:save" | "menu:close-tab";

contextBridge.exposeInMainWorld("electronAPI", {
  openDirectory: (): Promise<string | null> => ipcRenderer.invoke("open-directory"),
  readDirectory: (dirPath: string) => ipcRenderer.invoke("read-directory", dirPath),
  createDirectory: (dirPath: string) => ipcRenderer.invoke("create-directory", dirPath),
  readFile: (filePath: string): Promise<string> => ipcRenderer.invoke("read-file", filePath),
  writeFile: (filePath: string, content: string): Promise<void> =>
    ipcRenderer.invoke("write-file", filePath, content),
  renameFile: (oldPath: string, newPath: string): Promise<void> =>
    ipcRenderer.invoke("rename-file", oldPath, newPath),
  deleteFile: (filePath: string): Promise<void> => ipcRenderer.invoke("delete-file", filePath),
  onMenuAction: (channel: MenuChannel, callback: (...args: unknown[]) => void) => {
    const wrapper = (_event: Electron.IpcRendererEvent, ...args: unknown[]) => callback(...args);
    ipcRenderer.on(channel, wrapper);
    return () => ipcRenderer.off(channel, wrapper);
  },
  watchDirectory: (dirPath: string): Promise<void> =>
    ipcRenderer.invoke("watch-directory", dirPath),
  unwatchDirectory: (): Promise<void> => ipcRenderer.invoke("unwatch-directory"),
  onFsChange: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on("fs-change", handler);
    return () => ipcRenderer.off("fs-change", handler);
  },
});
