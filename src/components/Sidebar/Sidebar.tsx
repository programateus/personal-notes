import { forwardRef, useImperativeHandle, useState } from "react";
import { RiFolder2Line, RiFileAddLine } from "react-icons/ri";
import { useResizable } from "@/hooks/useResizable";
import type { FileNode } from "@/electron";

import { FileTreeNode } from "./FileTreeNode";
import { updateChildren } from "./updateChildren";
import { Dropzone } from "./Dropzone";

interface SidebarProps {
  onFileSelect: (path: string) => void;
}

export interface SidebarRef {
  loadFolder: (path: string) => Promise<void>;
}

export const Sidebar = forwardRef<SidebarRef, SidebarProps>(({ onFileSelect }, ref) => {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [rootName, setRootName] = useState<string | null>(null);
  const [rootPath, setRootPath] = useState<string | null>(null);
  const [loadingPaths, setLoadingPaths] = useState<Set<string>>(new Set());
  const { width: sidebarWidth, handleResizeStart } = useResizable(240);

  function startLoading(p: string) {
    setLoadingPaths((prev) => new Set(prev).add(p));
  }

  function stopLoading(p: string) {
    setLoadingPaths((prev) => {
      const next = new Set(prev);
      next.delete(p);
      return next;
    });
  }

  async function loadFolder(dirPath: string) {
    startLoading(dirPath);
    const nodes = await window.electronAPI.readDirectory(dirPath);
    stopLoading(dirPath);
    setRootName(dirPath.split(/[\\/]/).pop() ?? dirPath);
    setRootPath(dirPath);
    setFiles(nodes);
  }

  useImperativeHandle(ref, () => ({ loadFolder }));

  async function handleOpenFolder() {
    const dirPath = await window.electronAPI.openDirectory();
    if (!dirPath) return;
    await loadFolder(dirPath);
  }

  async function handleExpand(dirPath: string) {
    startLoading(dirPath);
    const children = await window.electronAPI.readDirectory(dirPath);
    stopLoading(dirPath);
    setFiles((prev) => updateChildren(prev, dirPath, children));
  }

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
            onClick={handleOpenFolder}
            title="Abrir arquivo"
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
