import { useState } from "react";
import type { FileType } from "@/electron";
import { ensureExtension } from "@/config/fileConfig";
import { updateChildren, insertNodeAt, removeNodeByPath } from "./updateChildren";
import type { FileNodeState } from "./types";

export function useSidebarState(
  onFileSelect: (path: string) => void,
  onFileRename: (oldPath: string, newPath: string) => void,
) {
  const [files, setFiles] = useState<FileNodeState[]>([]);
  const [rootName, setRootName] = useState<string | null>(null);
  const [rootPath, setRootPath] = useState<string | null>(null);
  const [loadingPaths, setLoadingPaths] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<FileNodeState | null>(null);

  const startLoading = (p: string) => setLoadingPaths((prev) => new Set(prev).add(p));
  const stopLoading = (p: string) =>
    setLoadingPaths((prev) => {
      const next = new Set(prev);
      next.delete(p);
      return next;
    });

  const loadFolder = async (dirPath: string) => {
    startLoading(dirPath);
    const nodes = await window.electronAPI.readDirectory(dirPath);
    stopLoading(dirPath);
    setRootName(dirPath.split(/[\\/]/).pop() ?? dirPath);
    if (dirPath !== rootPath) setSelectedNode(null);
    setRootPath(dirPath);
    setFiles(nodes as FileNodeState[]);
  };

  const addNewFileNode = (type: FileType, path: string) => {
    // path = targetDir + sep (e.g. "C:\notes\folder\")
    const sep = path.includes("\\") ? "\\" : "/";
    const targetDir = path.endsWith(sep) ? path.slice(0, -1) : path;
    const newNode: FileNodeState = { name: "", path, type, isRenaming: true, isNewFile: true };
    setFiles((prev) =>
      targetDir === rootPath
        ? [newNode, ...prev]
        : insertNodeAt(prev, targetDir, newNode),
    );
  };

  const handleNodeSelect = (node: FileNodeState) => {
    setSelectedNode(node);
  };

  const handleAddNewFile = (type: FileType) => {
    if (!rootPath) return;
    let targetDir = rootPath;
    if (selectedNode) {
      if (selectedNode.type === "directory") {
        targetDir = selectedNode.path;
      } else {
        const sep = selectedNode.path.includes("\\") ? "\\" : "/";
        targetDir = selectedNode.path.substring(0, selectedNode.path.lastIndexOf(sep));
      }
    }
    const sep = targetDir.includes("\\") ? "\\" : "/";
    addNewFileNode(type, targetDir + sep);
  };

  const handleStartRenaming = (node: FileNodeState) => {
    setFiles((prev) => prev.map((n) => (n.path === node.path ? { ...n, isRenaming: true } : n)));
  };

  const handleCancelRenaming = (node: FileNodeState) => {
    if (!node.name) {
      setFiles((prev) => removeNodeByPath(prev, node.path));
    } else {
      setFiles((prev) =>
        prev.map((n) => (n.path === node.path ? { ...n, isRenaming: false } : n)),
      );
    }
  };

  const handleFinishRenaming = async (node: FileNodeState, newName: string) => {
    if (!newName.trim()) {
      handleCancelRenaming(node);
      return;
    }
    const finalName = ensureExtension(newName);
    const sep = node.path.includes("\\") ? "\\" : "/";
    if (node.isNewFile) {
      const newPath = node.path + finalName;
      if (node.type === "directory") {
        await window.electronAPI.createDirectory(newPath);
      } else {
        await window.electronAPI.writeFile(newPath, "");
        onFileSelect(newPath);
      }
    } else {
      const parentDir = node.path.substring(0, node.path.length - node.name.length - 1);
      const newPath = parentDir + sep + finalName;
      await window.electronAPI.renameFile(node.path, newPath);
      onFileRename(node.path, newPath);
      setFiles((prev) =>
        prev.map((n) =>
          n.path === node.path ? { ...n, name: finalName, path: newPath, isNewFile: false } : n,
        ),
      );
    }
    if (rootPath) await loadFolder(rootPath);
  };

  const handleExpand = async (dirPath: string) => {
    startLoading(dirPath);
    const children = await window.electronAPI.readDirectory(dirPath);
    stopLoading(dirPath);
    setFiles((prev) => updateChildren(prev, dirPath, children as FileNodeState[])); // FileNode[] → FileNodeState[] boundary
  };

  return {
    files,
    rootName,
    rootPath,
    loadingPaths,
    selectedNode,
    loadFolder,
    addNewFileNode,
    handleNodeSelect,
    handleAddNewFile,
    handleStartRenaming,
    handleCancelRenaming,
    handleFinishRenaming,
    handleExpand,
  };
}
