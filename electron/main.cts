import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import { Worker } from "worker_threads";
import fs from "fs/promises";

ipcMain.handle("open-directory", async () => {
  const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("read-file", (_event, filePath: string) => fs.readFile(filePath, "utf-8"));

ipcMain.handle("write-file", (_event, filePath: string, content: string) =>
  fs.writeFile(filePath, content, "utf-8"),
);

ipcMain.handle("rename-file", (_event, oldPath: string, newPath: string) =>
  fs.rename(oldPath, newPath),
);

ipcMain.handle("delete-file", (_event, filePath: string) =>
  fs.rm(filePath, { recursive: true }),
);

ipcMain.handle("read-directory", (_event, dirPath: string) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, "workers/readDir.worker.cjs"), {
      workerData: { dirPath },
    });
    worker.on("message", (msg: { nodes?: unknown; error?: string }) => {
      if (msg.error) reject(new Error(msg.error));
      else resolve(msg.nodes);
    });
    worker.on("error", reject);
  });
});

const isDev = !app.isPackaged;

function createWindow(): void {
  const preloadPath = path.join(__dirname, "preload.cjs");

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
