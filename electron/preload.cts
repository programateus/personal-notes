import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  openDirectory: (): Promise<string | null> => ipcRenderer.invoke("open-directory"),
  readDirectory: (dirPath: string) => ipcRenderer.invoke("read-directory", dirPath),
});
