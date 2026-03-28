import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  openDirectory: (): Promise<string | null> => ipcRenderer.invoke("open-directory"),
  readDirectory: (dirPath: string) => ipcRenderer.invoke("read-directory", dirPath),
  readFile: (filePath: string): Promise<string> => ipcRenderer.invoke("read-file", filePath),
  writeFile: (filePath: string, content: string): Promise<void> =>
    ipcRenderer.invoke("write-file", filePath, content),
});
