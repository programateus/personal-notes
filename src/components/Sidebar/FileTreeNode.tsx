import { useContextMenu } from "@/providers/ContextMenu/useContextMenu";
import type { ContextMenuOption } from "@/providers/ContextMenu/types";
import {
  IconCopy,
  IconCut,
  IconRename,
  IconDelete,
  IconFileAdd,
  IconFolderAdd,
} from "@/components/ContextMenu/ContextMenuIcons";
import { stripExtension } from "@/config/fileConfig";
import type { FileNodeState } from "./types";
import { RenameInput } from "./RenameInput";
import { useFileTree } from "./FileTreeContext";

interface FileTreeNodeProps {
  node: FileNodeState;
  onRefresh: () => void;
  depth?: number;
}

export const FileTreeNode = ({ node, onRefresh, depth = 0 }: FileTreeNodeProps) => {
  const {
    onFileSelect,
    onNodeSelect,
    onExpand,
    onToggleFolder,
    onAddNew,
    onStartRenaming,
    onFinishRenaming,
    onCancelRenaming,
    loadingPaths,
    openPaths,
    selectedPath,
  } = useFileTree();

  const { open: openContextMenu } = useContextMenu();
  const paddingLeft = depth * 12 + 8;
  const isSelected = node.path === selectedPath;
  const isLoading = loadingPaths.has(node.path);

  const buildOptions = (): ContextMenuOption[] => {
    const sep = node.path.includes("\\") ? "\\" : "/";
    return [
      ...(node.type === "directory"
        ? [
            {
              label: "Novo arquivo",
              icon: IconFileAdd,
              action: () => onAddNew("file", node.path + sep),
            },
            {
              label: "Nova pasta",
              icon: IconFolderAdd,
              action: () => onAddNew("directory", node.path + sep),
            },
          ]
        : []),
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
  };

  const sharedProps = {
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      openContextMenu(buildOptions(), e.clientX, e.clientY);
    },
  };

  if (node.type === "directory") {
    const isOpen = openPaths.has(node.path);

    const handleToggle = () => {
      onNodeSelect(node);
      const opening = !isOpen;
      onToggleFolder(node.path);
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
            <span className="w-3 text-center text-xs">{isLoading ? "·" : isOpen ? "▾" : "▸"}</span>
            <span className="truncate">{stripExtension(node.name)}</span>
          </button>
        )}
        {isOpen &&
          node.children?.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
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
