import { forwardRef, useImperativeHandle, useState } from "react";
import { RiFolder2Line, RiFileAddLine } from "react-icons/ri";
import { useResizable } from "@/hooks/useResizable";
import type { FileType } from "@/electron";

import { FileTreeNode } from "./FileTreeNode";
import { updateChildren } from "./updateChildren";
import { Dropzone } from "./Dropzone";
import type { FileNodeState, SidebarProps, SidebarRef } from "./types";

export const Sidebar = forwardRef<SidebarRef, SidebarProps>(({ onFileSelect }, ref) => {
  const [files, setFiles] = useState<FileNodeState[]>([]);
  const [rootName, setRootName] = useState<string | null>(null);
  const [rootPath, setRootPath] = useState<string | null>(null);
  const [loadingPaths, setLoadingPaths] = useState<Set<string>>(new Set());
  const { width: sidebarWidth, handleResizeStart } = useResizable(240);

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
    setRootPath(dirPath);
    setFiles(nodes as FileNodeState[]);
  };

  const addNewFileNode = (type: FileType, path: string) => {
    const newNode: FileNodeState = { name: "", path, type, isRenaming: true };
    setFiles((prev) => [newNode, ...prev]);
  };

  useImperativeHandle(ref, () => ({ loadFolder, addNewFileNode }));

  const handleOpenFolder = async () => {
    const dirPath = await window.electronAPI.openDirectory();
    if (!dirPath) return;
    await loadFolder(dirPath);
  };

  const handleAddNewFile = () => {
    if (!rootPath) return;
    const sep = rootPath.includes("\\") ? "\\" : "/";
    addNewFileNode("file", rootPath + sep);
  };

  const handleStartRenaming = (node: FileNodeState) => {
    setFiles((prev) =>
      prev.map((n) => (n.path === node.path ? { ...n, isRenaming: true } : n)),
    );
  };

  const handleCancelRenaming = (node: FileNodeState) => {
    if (!node.name) {
      setFiles((prev) => prev.filter((n) => n.path !== node.path));
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
    const sep = node.path.includes("\\") ? "\\" : "/";
    if (node.name) {
      const parentDir = node.path.substring(0, node.path.length - node.name.length - 1);
      const newPath = parentDir + sep + newName;
      await window.electronAPI.renameFile(node.path, newPath);
    } else {
      // New file: path is "rootPath/" — append name to create it
      const newPath = node.path + newName;
      await window.electronAPI.writeFile(newPath, "");
    }
    if (rootPath) await loadFolder(rootPath);
  };

  const handleExpand = async (dirPath: string) => {
    startLoading(dirPath);
    const children = await window.electronAPI.readDirectory(dirPath);
    stopLoading(dirPath);
    setFiles((prev) => updateChildren(prev, dirPath, children) as FileNodeState[]);
  };

  return (
    <aside
      className={`relative flex h-full shrink-0 flex-col border-r border-neutral/25 bg-base-200${files.length === 0 ? " hidden" : " min-w-40"}`}
      style={{ width: sidebarWidth }}
    >
      <div className="flex items-center border-b border-neutral/25 px-3 py-2">
        <span className="text-xs font-semibold tracking-wider text-base-content/55 uppercase">
          {rootName ?? "Notas"}
        </span>
        <div className="ml-auto flex gap-1">
          <button
            onClick={handleAddNewFile}
            title="Novo arquivo"
            className="cursor-pointer rounded p-1 text-base-content/55
             hover:bg-base-content/10 hover:text-base-content"
          >
            <RiFileAddLine />
          </button>
          <button
            onClick={handleOpenFolder}
            title="Abrir pasta"
            className="cursor-pointer rounded p-1 text-base-content/55
             hover:bg-base-content/10 hover:text-base-content"
          >
            <RiFolder2Line />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {files.length === 0 ? (
          <Dropzone onClick={handleOpenFolder}>Abrir pasta</Dropzone>
        ) : (
          files.map((node) => (
            <FileTreeNode
              key={node.path}
              node={node}
              onFileSelect={onFileSelect}
              onExpand={handleExpand}
              onStartRenaming={handleStartRenaming}
              onFinishRenaming={handleFinishRenaming}
              onCancelRenaming={handleCancelRenaming}
              loadingPaths={loadingPaths}
              onRefresh={() => rootPath && loadFolder(rootPath)}
            />
          ))
        )}
      </div>

      <div
        className="absolute inset-y-0 right-0 w-1 cursor-col-resize
           transition-colors duration-150 hover:bg-primary/40"
        onMouseDown={handleResizeStart}
      />

      {loadingPaths.size > 0 && (
        <div className="border-t border-base-300 px-3 py-2">
          <div className="relative h-0.5 overflow-hidden rounded-full bg-neutral">
            <div className="loading-bar absolute h-full w-2/5 rounded-full bg-primary" />
          </div>
        </div>
      )}
    </aside>
  );
});

Sidebar.displayName = "Sidebar";
