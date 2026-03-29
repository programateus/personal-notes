import type { FileNode } from "@/electron";
import { useState } from "react";
import { useContextMenu } from "@/providers/ContextMenu/useContextMenu";
import type { ContextMenuOption } from "@/providers/ContextMenu/types";
import {
  IconCopy,
  IconCut,
  IconRename,
  IconDelete,
} from "@/components/ContextMenu/ContextMenuIcons";

interface FileTreeNodeProps {
  node: FileNode;
  onFileSelect: (path: string) => void;
  onExpand: (path: string) => void;
  loadingPaths: Set<string>;
  onRefresh: () => void;
  depth?: number;
}

export const FileTreeNode = ({
  node,
  onFileSelect,
  onExpand,
  loadingPaths,
  onRefresh,
  depth = 0,
}: FileTreeNodeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { open: openContextMenu } = useContextMenu();
  const [isEditing, setIsEditing] = useState(false);
  const paddingLeft = depth * 12 + 8;
  const isLoading = loadingPaths.has(node.path);
  const sep = node.path.includes("\\") ? "\\" : "/";
  const parentDir = node.path.substring(0, node.path.length - node.name.length - 1);

  const buildFileOptions = (node: FileNode, onRefresh: () => void): ContextMenuOption[] => {
    return [
      {
        label: "Copiar",
        icon: IconCopy,
        action: () => {
          navigator.clipboard.writeText(node.path);
        },
      },
      {
        label: "Cortar",
        icon: IconCut,
        action: () => {
          navigator.clipboard.writeText(node.path);
        },
      },
      {
        label: "Renomear",
        icon: IconRename,
        action: async () => {
          setIsEditing(true);
        },
      },
      {
        label: "Excluir",
        icon: IconDelete,
        danger: true,
        action: async () => {
          if (!window.confirm(`Excluir "${node.name}"?`)) return;
          await window.electronAPI.deleteFile(node.path);
          onRefresh();
        },
      },
    ];
  };

  const handleToggle = () => {
    const opening = !isOpen;
    setIsOpen(opening);
    if (opening && node.children === undefined) {
      onExpand(node.path);
    }
  };

  const handleRename = async (e: React.FocusEvent<HTMLInputElement>) => {
    const newName = e.currentTarget.value;
    if (!newName || newName === node.name) {
      setIsEditing(false);
      return;
    }
    const newPath = parentDir + sep + newName;
    await window.electronAPI.renameFile(node.path, newPath);
    onRefresh();
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  if (node.type === "directory") {
    return (
      <div>
        {isEditing ? (
          <input
            autoFocus
            type="text"
            className="flex w-full items-center gap-1 rounded py-1
           text-left text-sm text-base-content/80"
            style={{ paddingLeft: paddingLeft + 16 }}
            defaultValue={node.name}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <button
            onClick={handleToggle}
            onContextMenu={(e) => {
              e.preventDefault();
              openContextMenu(buildFileOptions(node, onRefresh), e.clientX, e.clientY);
            }}
            style={{ paddingLeft }}
            className="flex w-full items-center gap-1 rounded px-2 py-1
           text-left text-sm text-base-content/55
           hover:bg-base-content/10 hover:text-base-content"
          >
            <span className="w-3 text-center text-xs">{isLoading ? "·" : isOpen ? "▾" : "▸"}</span>
            <span className="truncate">{node.name}</span>
          </button>
        )}
        {isOpen &&
          node.children?.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              onFileSelect={onFileSelect}
              onExpand={onExpand}
              loadingPaths={loadingPaths}
              onRefresh={() => onExpand(node.path)}
              depth={depth + 1}
            />
          ))}
      </div>
    );
  }

  return (
    <div>
      {isEditing ? (
        <input
          autoFocus
          type="text"
          className="flex w-full items-center gap-1 rounded py-1
           text-left text-sm text-base-content/80"
          style={{ paddingLeft: paddingLeft + 16 }}
          defaultValue={node.name}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <button
          onClick={() => onFileSelect(node.path)}
          onContextMenu={(e) => {
            e.preventDefault();
            openContextMenu(buildFileOptions(node, onRefresh), e.clientX, e.clientY);
          }}
          style={{ paddingLeft: paddingLeft + 16 }}
          className="flex w-full items-center gap-1 rounded px-2 py-1
           text-left text-sm text-base-content/80
           hover:bg-base-content/10 hover:text-base-content"
        >
          <span className="truncate">{node.name}</span>
        </button>
      )}
    </div>
  );
};
