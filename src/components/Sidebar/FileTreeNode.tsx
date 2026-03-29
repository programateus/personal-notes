import { useRef, useState } from "react";
import { useContextMenu } from "@/providers/ContextMenu/useContextMenu";
import type { ContextMenuOption } from "@/providers/ContextMenu/types";
import {
  IconCopy,
  IconCut,
  IconRename,
  IconDelete,
} from "@/components/ContextMenu/ContextMenuIcons";
import { stripExtension } from "@/config/fileConfig";
import type { FileNodeState } from "./types";

interface FileTreeNodeProps {
  node: FileNodeState;
  onFileSelect: (path: string) => void;
  onExpand: (path: string) => void;
  onStartRenaming: (node: FileNodeState) => void;
  onFinishRenaming: (node: FileNodeState, newName: string) => void;
  onCancelRenaming: (node: FileNodeState) => void;
  loadingPaths: Set<string>;
  onRefresh: () => void;
  depth?: number;
}

export const FileTreeNode = ({
  node,
  onFileSelect,
  onExpand,
  onStartRenaming,
  onFinishRenaming,
  onCancelRenaming,
  loadingPaths,
  onRefresh,
  depth = 0,
}: FileTreeNodeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { open: openContextMenu } = useContextMenu();
  const cancelledRef = useRef(false);
  const paddingLeft = depth * 12 + 8;
  const isLoading = loadingPaths.has(node.path);

  const buildOptions = (): ContextMenuOption[] => [
    {
      label: "Copiar",
      icon: IconCopy,
      action: () => navigator.clipboard.writeText(node.path),
    },
    {
      label: "Cortar",
      icon: IconCut,
      action: () => navigator.clipboard.writeText(node.path),
    },
    {
      label: "Renomear",
      icon: IconRename,
      action: () => onStartRenaming(node),
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (cancelledRef.current) {
      cancelledRef.current = false;
      onCancelRenaming(node);
      return;
    }
    onFinishRenaming(node, e.currentTarget.value.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      cancelledRef.current = true;
      e.currentTarget.blur();
    }
  };

  const renameInput = (indentLeft: number) => (
    <input
      autoFocus
      type="text"
      className="w-full rounded bg-base-100 px-2 py-1 text-sm text-base-content ring-1 ring-primary outline-none"
      style={{ paddingLeft: indentLeft }}
      defaultValue={stripExtension(node.name)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );

  if (node.type === "directory") {
    const handleToggle = () => {
      const opening = !isOpen;
      setIsOpen(opening);
      if (opening && node.children === undefined) onExpand(node.path);
    };

    return (
      <div>
        {node.isRenaming ? (
          renameInput(paddingLeft + 16)
        ) : (
          <button
            onClick={handleToggle}
            onContextMenu={(e) => {
              e.preventDefault();
              openContextMenu(buildOptions(), e.clientX, e.clientY);
            }}
            style={{ paddingLeft }}
            className="flex w-full items-center gap-1 rounded px-2 py-1
             text-left text-sm text-base-content/55
             hover:bg-base-content/10 hover:text-base-content"
          >
            <span className="w-3 text-center text-xs">{isLoading ? "·" : isOpen ? "▾" : "▸"}</span>
            <span className="truncate">{stripExtension(node.name)}</span>
          </button>
        )}
        {isOpen &&
          node.children?.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child as FileNodeState}
              onFileSelect={onFileSelect}
              onExpand={onExpand}
              onStartRenaming={onStartRenaming}
              onFinishRenaming={onFinishRenaming}
              onCancelRenaming={onCancelRenaming}
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
      {node.isRenaming ? (
        renameInput(paddingLeft + 16)
      ) : (
        <button
          onClick={() => onFileSelect(node.path)}
          onContextMenu={(e) => {
            e.preventDefault();
            openContextMenu(buildOptions(), e.clientX, e.clientY);
          }}
          style={{ paddingLeft: paddingLeft + 16 }}
          className="flex w-full items-center gap-1 rounded px-2 py-1
           text-left text-sm text-base-content/80
           hover:bg-base-content/10 hover:text-base-content"
        >
          <span className="truncate">{stripExtension(node.name)}</span>
        </button>
      )}
    </div>
  );
};
