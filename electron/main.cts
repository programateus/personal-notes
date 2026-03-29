import { app, BrowserWindow, ipcMain, dialog, Menu } from "electron";
import path from "path";
import { Worker } from "worker_threads";
import fs from "fs/promises";
import { watch as fsWatch } from "fs";

let mainWindow: BrowserWindow | null = null;

let fsWatcher: ReturnType<typeof fsWatch> | null = null;
let fsWatchDebounce: ReturnType<typeof setTimeout> | null = null;

ipcMain.handle("watch-directory", (_event, dirPath: string) => {
  fsWatcher?.close();
  fsWatcher = fsWatch(dirPath, { recursive: true }, () => {
    if (fsWatchDebounce) clearTimeout(fsWatchDebounce);
    fsWatchDebounce = setTimeout(() => {
      BrowserWindow.getAllWindows().forEach((w) => w.webContents.send("fs-change"));
    }, 200);
  });
});

ipcMain.handle("unwatch-directory", () => {
  fsWatcher?.close();
  fsWatcher = null;
  if (fsWatchDebounce) {
    clearTimeout(fsWatchDebounce);
    fsWatchDebounce = null;
  }
});

ipcMain.handle("open-directory", async () => {
  const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("read-file", (_event, filePath: string) => fs.readFile(filePath, "utf-8"));

ipcMain.handle("write-file", (_event, filePath: string, content: string) =>
  fs.writeFile(filePath, content, "utf-8"),
);

ipcMain.handle("open-file-or-directory", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile", "openDirectory"],
    filters: [{ name: "Markdown", extensions: ["md"] }],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  const selectedPath = result.filePaths[0];
  const stat = await fs.stat(selectedPath);
  return { path: selectedPath, isDirectory: stat.isDirectory() };
});

ipcMain.handle("rename-file", (_event, oldPath: string, newPath: string) =>
  fs.rename(oldPath, newPath),
);

ipcMain.handle("delete-file", (_event, filePath: string) => fs.rm(filePath, { recursive: true }));

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

ipcMain.handle("create-directory", (_event, dirPath: string) =>
  fs.mkdir(dirPath, { recursive: true }),
);

function buildMenu() {
  return Menu.buildFromTemplate([
    {
      label: "Arquivo",
      submenu: [
        {
          label: "Abrir arquivo...",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            if (!mainWindow) return;
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ["openFile"],
              filters: [{ name: "Markdown", extensions: ["md"] }],
            });
            if (result.canceled || result.filePaths.length === 0) return;
            mainWindow.webContents.send("menu:open", {
              path: result.filePaths[0],
              isDirectory: false,
            });
          },
        },
        {
          label: "Abrir pasta...",
          accelerator: "CmdOrCtrl+Shift+O",
          click: async () => {
            if (!mainWindow) return;
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ["openDirectory"],
            });
            if (result.canceled || result.filePaths.length === 0) return;
            mainWindow.webContents.send("menu:open", {
              path: result.filePaths[0],
              isDirectory: true,
            });
          },
        },
        { type: "separator" },
        {
          label: "Salvar",
          click: () => mainWindow?.webContents.send("menu:save"),
        },
        { type: "separator" },
        {
          label: "Fechar aba",
          click: () => mainWindow?.webContents.send("menu:close-tab"),
        },
        { type: "separator" },
        { role: "quit", label: "Sair" },
      ],
    },
    {
      label: "Editar",
      submenu: [
        { role: "undo", label: "Desfazer" },
        { role: "redo", label: "Refazer" },
        { type: "separator" },
        { role: "cut", label: "Recortar" },
        { role: "copy", label: "Copiar" },
        { role: "paste", label: "Colar" },
        { type: "separator" },
        { role: "selectAll", label: "Selecionar tudo" },
      ],
    },
    {
      label: "Ajuda",
      submenu: [
        {
          label: "Atalhos de teclado",
          click: () => {
            if (!mainWindow) return;
            dialog.showMessageBox(mainWindow, {
              title: "Atalhos de teclado",
              type: "info",
              message: "Atalhos de teclado",
              detail:
                "Ctrl+O              Abrir arquivo .md\n" +
                "Ctrl+Shift+O        Abrir pasta\n" +
                "Ctrl+S              Salvar\n" +
                "Ctrl+W              Fechar aba\n" +
                "Ctrl+Tab            Próxima aba\n" +
                "Ctrl+Shift+Tab      Aba anterior",
            });
          },
        },
        { type: "separator" },
        {
          label: "Sobre Personal Notes",
          click: () => {
            if (!mainWindow) return;
            dialog.showMessageBox(mainWindow, {
              title: "Personal Notes",
              type: "info",
              message: "Personal Notes",
              detail: "Editor de notas em Markdown",
            });
          },
        },
      ],
    },
  ]);
}

const isDev = !app.isPackaged;

function createWindow(): void {
  const preloadPath = path.join(__dirname, "preload.cjs");

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  Menu.setApplicationMenu(buildMenu());

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
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
