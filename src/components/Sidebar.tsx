import { useState } from "react";
import type { FileNode } from "../electron";

function updateChildren(nodes: FileNode[], targetPath: string, children: FileNode[]): FileNode[] {
  return nodes.map((node) => {
    if (node.path === targetPath) return { ...node, children };
    if (node.children !== undefined)
      return { ...node, children: updateChildren(node.children, targetPath, children) };
    return node;
  });
}

interface FileTreeNodeProps {
  node: FileNode;
  onFileSelect: (path: string) => void;
  onExpand: (path: string) => void;
  loadingPaths: Set<string>;
  depth?: number;
}

function FileTreeNode({
  node,
  onFileSelect,
  onExpand,
  loadingPaths,
  depth = 0,
}: FileTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const paddingLeft = depth * 12 + 8;

  if (node.type === "directory") {
    const isLoading = loadingPaths.has(node.path);

    function handleToggle() {
      const opening = !isOpen;
      setIsOpen(opening);
      if (opening && node.children === undefined) {
        onExpand(node.path);
      }
    }

    return (
      <div>
        <button
          onClick={handleToggle}
          style={{ paddingLeft }}
          className="flex w-full items-center gap-1 rounded px-2 py-1 text-left text-sm text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100"
        >
          <span className="w-3 text-center text-xs">{isLoading ? "·" : isOpen ? "▾" : "▸"}</span>
          <span className="truncate">{node.name}</span>
        </button>
        {isOpen &&
          node.children?.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              onFileSelect={onFileSelect}
              onExpand={onExpand}
              loadingPaths={loadingPaths}
              depth={depth + 1}
            />
          ))}
      </div>
    );
  }

  return (
    <button
      onClick={() => onFileSelect(node.path)}
      style={{ paddingLeft: paddingLeft + 16 }}
      className="flex w-full items-center gap-1 rounded px-2 py-1 text-left text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white"
    >
      <span className="truncate">{node.name}</span>
    </button>
  );
}

interface SidebarProps {
  onFileSelect: (path: string) => void;
}

export function Sidebar({ onFileSelect }: SidebarProps) {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [rootName, setRootName] = useState<string | null>(null);
  const [loadingPaths, setLoadingPaths] = useState<Set<string>>(new Set());

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

  async function handleOpenFolder() {
    const dirPath = await window.electronAPI.openDirectory();
    if (!dirPath) return;

    startLoading(dirPath);
    const nodes = await window.electronAPI.readDirectory(dirPath);
    stopLoading(dirPath);

    setRootName(dirPath.split(/[\\/]/).pop() ?? dirPath);
    setFiles(nodes);
  }

  async function handleExpand(dirPath: string) {
    startLoading(dirPath);
    const children = await window.electronAPI.readDirectory(dirPath);
    stopLoading(dirPath);
    setFiles((prev) => updateChildren(prev, dirPath, children));
  }

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-neutral-700 bg-neutral-800">
      <div className="flex items-center justify-between border-b border-neutral-700 px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {rootName ?? "Notas"}
        </span>
        <button
          onClick={handleOpenFolder}
          title="Abrir pasta"
          className="rounded p-1 text-neutral-400 hover:bg-neutral-700 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {files.length === 0 ? (
          <button
            onClick={handleOpenFolder}
            className="mx-2 mt-2 w-[calc(100%-16px)] rounded border border-dashed border-neutral-600 px-3 py-4 text-center text-xs text-neutral-500 hover:border-neutral-400 hover:text-neutral-300"
          >
            Abrir pasta
          </button>
        ) : (
          files.map((node) => (
            <FileTreeNode
              key={node.path}
              node={node}
              onFileSelect={onFileSelect}
              onExpand={handleExpand}
              loadingPaths={loadingPaths}
            />
          ))
        )}
      </div>

      {loadingPaths.size > 0 && (
        <div className="border-t border-neutral-700 px-3 py-2">
          <div className="relative h-0.5 overflow-hidden rounded-full bg-neutral-700">
            <div className="loading-bar absolute h-full w-2/5 rounded-full bg-blue-500" />
          </div>
        </div>
      )}
    </aside>
  );
}
