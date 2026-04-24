import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FileType } from "@/electron";
import { ensureExtension } from "@/config/fileConfig";
import {
  insertNodeAt,
  removeNodeByPath,
  updateChildren,
  updateNodeByPath,
} from "./updateChildren";
import {
  getParentPath,
  getPathSeparator,
  joinDirectoryPath,
  trimTrailingPathSeparator,
} from "./pathUtils";
import type {
  FileNodeState,
  SidebarActions,
  SidebarController,
  SidebarControllerOptions,
  SidebarState,
} from "./types";

export function useSidebarController({
  onFileSelect,
  onFileRename,
}: SidebarControllerOptions): SidebarController {
  const [files, setFiles] = useState<FileNodeState[]>([]);
  const [rootName, setRootName] = useState<string | null>(null);
  const [rootPath, setRootPath] = useState<string | null>(null);
  const [loadingPaths, setLoadingPaths] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<FileNodeState | null>(null);
  const [openPaths, setOpenPaths] = useState<Set<string>>(new Set());

  const rootPathRef = useRef<string | null>(null);
  const selectedNodeRef = useRef<FileNodeState | null>(null);
  const openPathsRef = useRef<Set<string>>(new Set());
  const onFileSelectRef = useRef(onFileSelect);
  const onFileRenameRef = useRef(onFileRename);
  const suppressWatcherUntil = useRef(0);

  useEffect(() => {
    rootPathRef.current = rootPath;
  }, [rootPath]);

  useEffect(() => {
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  useEffect(() => {
    openPathsRef.current = openPaths;
  }, [openPaths]);

  useEffect(() => {
    onFileSelectRef.current = onFileSelect;
  }, [onFileSelect]);

  useEffect(() => {
    onFileRenameRef.current = onFileRename;
  }, [onFileRename]);

  const startLoading = useCallback((path: string) => {
    setLoadingPaths((prev) => new Set(prev).add(path));
  }, []);

  const stopLoading = useCallback((path: string) => {
    setLoadingPaths((prev) => {
      const next = new Set(prev);
      next.delete(path);
      return next;
    });
  }, []);

  const openFile = useCallback((path: string) => {
    onFileSelectRef.current(path);
  }, []);

  const renameFile = useCallback((oldPath: string, newPath: string) => {
    onFileRenameRef.current(oldPath, newPath);
  }, []);

  const reloadTree = useCallback(
    async (rootDir: string) => {
      const expanded = [...openPathsRef.current];

      startLoading(rootDir);
      const results = await Promise.allSettled([
        window.electronAPI.readDirectory(rootDir),
        ...expanded.map((path) => window.electronAPI.readDirectory(path)),
      ]);
      stopLoading(rootDir);

      const rootResult = results[0];
      if (rootResult.status === "rejected") return;

      let tree = rootResult.value as FileNodeState[];
      expanded.forEach((path, index) => {
        const result = results[index + 1];
        if (result.status === "fulfilled") {
          tree = updateChildren(tree, path, result.value as FileNodeState[]);
        } else {
          setOpenPaths((prev) => {
            const next = new Set(prev);
            next.delete(path);
            return next;
          });
        }
      });

      setFiles(tree);
    },
    [startLoading, stopLoading],
  );

  const loadFolder = useCallback(
    async (dirPath: string) => {
      const currentRootPath = rootPathRef.current;
      setRootName(dirPath.split(/[\\/]/).pop() ?? dirPath);

      if (dirPath === currentRootPath) {
        await reloadTree(dirPath);
        return;
      }

      startLoading(dirPath);

      try {
        const nodes = await window.electronAPI.readDirectory(dirPath);
        selectedNodeRef.current = null;
        setSelectedNode(null);
        openPathsRef.current = new Set();
        setOpenPaths(new Set());

        rootPathRef.current = dirPath;
        setRootPath(dirPath);
        setFiles(nodes as FileNodeState[]);
      } finally {
        stopLoading(dirPath);
      }
    },
    [reloadTree, startLoading, stopLoading],
  );

  const addNewFileNode = useCallback((type: FileType, path: string) => {
    const targetDir = trimTrailingPathSeparator(path);
    const newNode: FileNodeState = { name: "", path, type, isRenaming: true, isNewFile: true };

    if (targetDir !== rootPathRef.current) {
      setOpenPaths((prev) => new Set(prev).add(targetDir));
    }

    setFiles((prev) =>
      targetDir === rootPathRef.current
        ? [newNode, ...prev]
        : insertNodeAt(prev, targetDir, newNode),
    );
  }, []);

  useEffect(() => {
    if (!rootPath) return;

    window.electronAPI.watchDirectory(rootPath);
    const unsubscribe = window.electronAPI.onFsChange(() => {
      if (Date.now() < suppressWatcherUntil.current) return;
      reloadTree(rootPath);
    });

    return () => {
      unsubscribe();
      window.electronAPI.unwatchDirectory();
    };
  }, [reloadTree, rootPath]);

  const selectNode = useCallback((node: FileNodeState) => {
    selectedNodeRef.current = node;
    setSelectedNode(node);
  }, []);

  const addNewFileFromSelection = useCallback(
    (type: FileType) => {
      const rootDir = rootPathRef.current;
      if (!rootDir) return;

      let targetDir = rootDir;
      const selected = selectedNodeRef.current;

      if (selected) {
        targetDir = selected.type === "directory" ? selected.path : getParentPath(selected.path);
      }

      addNewFileNode(type, joinDirectoryPath(targetDir));
    },
    [addNewFileNode],
  );

  const toggleFolder = useCallback((dirPath: string) => {
    setOpenPaths((prev) => {
      const next = new Set(prev);
      if (next.has(dirPath)) next.delete(dirPath);
      else next.add(dirPath);
      return next;
    });
  }, []);

  const startRenaming = useCallback((node: FileNodeState) => {
    setFiles((prev) =>
      updateNodeByPath(prev, node.path, (current) => ({ ...current, isRenaming: true })),
    );
  }, []);

  const cancelRenaming = useCallback((node: FileNodeState) => {
    if (!node.name) {
      setFiles((prev) => removeNodeByPath(prev, node.path));
      return;
    }

    setFiles((prev) =>
      updateNodeByPath(prev, node.path, (current) => ({ ...current, isRenaming: false })),
    );
  }, []);

  const finishRenaming = useCallback(
    async (node: FileNodeState, newName: string) => {
      if (!newName.trim()) {
        cancelRenaming(node);
        return;
      }

      const finalName = node.type === "file" ? ensureExtension(newName) : newName;
      const sep = getPathSeparator(node.path);

      if (node.isNewFile) {
        const newPath = node.path + finalName;
        if (node.type === "directory") {
          await window.electronAPI.createDirectory(newPath);
        } else {
          await window.electronAPI.writeFile(newPath, "");
          openFile(newPath);
        }
      } else {
        const parentDir = node.path.substring(0, node.path.length - node.name.length - 1);
        const newPath = parentDir + sep + finalName;
        await window.electronAPI.renameFile(node.path, newPath);
        renameFile(node.path, newPath);
      }

      const currentRootPath = rootPathRef.current;
      if (currentRootPath) {
        suppressWatcherUntil.current = Date.now() + 500;
        await reloadTree(currentRootPath);
      }
    },
    [cancelRenaming, openFile, reloadTree, renameFile],
  );

  const expandFolder = useCallback(
    async (dirPath: string) => {
      startLoading(dirPath);

      try {
        const children = await window.electronAPI.readDirectory(dirPath);
        setFiles((prev) => updateChildren(prev, dirPath, children as FileNodeState[]));
      } finally {
        stopLoading(dirPath);
      }
    },
    [startLoading, stopLoading],
  );

  const state = useMemo<SidebarState>(
    () => ({
      files,
      rootName,
      rootPath,
      loadingPaths,
      selectedNode,
      openPaths,
    }),
    [files, loadingPaths, openPaths, rootName, rootPath, selectedNode],
  );

  const actions = useMemo<SidebarActions>(
    () => ({
      loadFolder,
      addNewFileNode,
      addNewFileFromSelection,
      selectNode,
      toggleFolder,
      startRenaming,
      finishRenaming,
      cancelRenaming,
      expandFolder,
      openFile,
    }),
    [
      addNewFileFromSelection,
      addNewFileNode,
      cancelRenaming,
      expandFolder,
      finishRenaming,
      loadFolder,
      openFile,
      selectNode,
      startRenaming,
      toggleFolder,
    ],
  );

  return useMemo(() => ({ state, actions }), [actions, state]);
}
