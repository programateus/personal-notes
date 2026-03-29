import { useState } from "react";
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
import { RenameInput } from "./RenameInput";

interface FileTreeNodeProps {
  node: FileNodeState;
  onFileSelect: (path: string) => void;
  onNodeSelect: (node: FileNodeState) => void;
  onExpand: (path: string) => void;
  onStartRenaming: (node: FileNodeState) => void;
  onFinishRenaming: (node: FileNodeState, newName: string) => void;
  onCancelRenaming: (node: FileNodeState) => void;
  loadingPaths: Set<string>;
  onRefresh: () => void;
  selectedPath?: string;
  depth?: number;
}

export const FileTreeNode = ({
  node,
  onFileSelect,
  onNodeSelect,
  onExpand,
  onStartRenaming,
  onFinishRenaming,
  onCancelRenaming,
  loadingPaths,
  onRefresh,
  selectedPath,
  depth = 0,
}: FileTreeNodeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { open: openContextMenu } = useContextMenu();
  const paddingLeft = depth * 12 + 8;
  const isSelected = node.path === selectedPath;
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

  const sharedProps = {
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      openContextMenu(buildOptions(), e.clientX, e.clientY);
    },
  };

  if (node.type === "directory") {
    const hasRenamingChild = node.children?.some((c) => c.isRenaming) ?? false;
    const effectiveIsOpen = isOpen || hasRenamingChild;

    const handleToggle = () => {
      onNodeSelect(node);
      const opening = !isOpen;
      setIsOpen(opening);
      if (opening && node.children === undefined) onExpand(node.path);
    };

    return (
      <div>
        {node.isRenaming ? (
          <RenameInput
            paddingLeft={paddingLeft + 16}
            defaultValue={node.name}
            onFinish={(name) => onFinishRenaming(node, name)}
            onCancel={() => onCancelRenaming(node)}
          />
        ) : (
          <button
            onClick={handleToggle}
            style={{ paddingLeft }}
            className={`flex w-full items-center gap-1 rounded px-2 py-1
             text-left text-sm hover:bg-base-content/10 hover:text-base-content
             ${isSelected ? "bg-base-content/15 text-base-content" : "text-base-content/55"}`}
            {...sharedProps}
          >
            <span className="w-3 text-center text-xs">{isLoading ? "·" : effectiveIsOpen ? "▾" : "▸"}</span>
            <span className="truncate">{stripExtension(node.name)}</span>
          </button>
        )}
        {effectiveIsOpen &&
          node.children?.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              onFileSelect={onFileSelect}
              onNodeSelect={onNodeSelect}
              onExpand={onExpand}
              onStartRenaming={onStartRenaming}
              onFinishRenaming={onFinishRenaming}
              onCancelRenaming={onCancelRenaming}
              loadingPaths={loadingPaths}
              onRefresh={() => onExpand(node.path)}
              selectedPath={selectedPath}
              depth={depth + 1}
            />
          ))}
      </div>
    );
  }

  return (
    <div>
      {node.isRenaming ? (
        <RenameInput
          paddingLeft={paddingLeft + 16}
          defaultValue={node.name}
          onFinish={(name) => onFinishRenaming(node, name)}
          onCancel={() => onCancelRenaming(node)}
        />
      ) : (
        <button
          onClick={() => {
            onNodeSelect(node);
            onFileSelect(node.path);
          }}
          style={{ paddingLeft: paddingLeft + 16 }}
          className={`flex w-full items-center gap-1 rounded px-2 py-1
           text-left text-sm hover:bg-base-content/10 hover:text-base-content
           ${isSelected ? "bg-base-content/15 text-base-content" : "text-base-content/80"}`}
          {...sharedProps}
        >
          <span className="truncate">{stripExtension(node.name)}</span>
        </button>
      )}
    </div>
  );
};
