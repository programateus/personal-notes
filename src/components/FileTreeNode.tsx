import type { FileNode } from "@/electron";
import { useState } from "react";

interface FileTreeNodeProps {
  node: FileNode;
  onFileSelect: (path: string) => void;
  onExpand: (path: string) => void;
  loadingPaths: Set<string>;
  depth?: number;
}

export const FileTreeNode = ({
  node,
  onFileSelect,
  onExpand,
  loadingPaths,
  depth = 0,
}: FileTreeNodeProps) => {
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
          className="flex w-full items-center gap-1 rounded px-2 py-1
           text-left text-sm text-base-content/55
           hover:bg-base-content/10 hover:text-base-content"
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
      className="flex w-full items-center gap-1 rounded px-2 py-1
           text-left text-sm text-base-content/80
           hover:bg-base-content/10 hover:text-base-content"
    >
      <span className="truncate">{node.name}</span>
    </button>
  );
};
