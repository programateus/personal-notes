import { IconFileAdd, IconFolderAdd } from "@/components/ContextMenu/ContextMenuIcons";
import { useContextMenu } from "@/providers/ContextMenu/useContextMenu";
import { FileTreeContext } from "./FileTreeContext";
import { FileTreeNode } from "./FileTreeNode";
import { joinDirectoryPath } from "./pathUtils";
import type { SidebarController } from "./types";

interface SidebarFileTreeProps {
  controller: SidebarController;
}

export function SidebarFileTree({ controller }: SidebarFileTreeProps) {
  const { state, actions } = controller;
  const { files, rootPath, loadingPaths, openPaths, selectedNode } = state;
  const { open: openContextMenu } = useContextMenu();

  const handleSidebarContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!rootPath) return;

    openContextMenu(
      [
        {
          label: "Novo arquivo",
          icon: IconFileAdd,
          action: () => actions.addNewFileNode("file", joinDirectoryPath(rootPath)),
        },
        {
          label: "Nova pasta",
          icon: IconFolderAdd,
          action: () => actions.addNewFileNode("directory", joinDirectoryPath(rootPath)),
        },
      ],
      event.clientX,
      event.clientY,
    );
  };

  return (
    <FileTreeContext.Provider
      value={{
        onFileSelect: actions.openFile,
        onNodeSelect: actions.selectNode,
        onExpand: actions.expandFolder,
        onToggleFolder: actions.toggleFolder,
        onAddNew: actions.addNewFileNode,
        onStartRenaming: actions.startRenaming,
        onFinishRenaming: actions.finishRenaming,
        onCancelRenaming: actions.cancelRenaming,
        loadingPaths,
        openPaths,
        selectedPath: selectedNode?.path,
      }}
    >
      <div className="flex-1 overflow-auto py-1" onContextMenu={handleSidebarContextMenu}>
        {files.map((node) => (
          <FileTreeNode
            key={node.path}
            node={node}
            onRefresh={() => {
              if (rootPath) void actions.loadFolder(rootPath);
            }}
          />
        ))}
      </div>
    </FileTreeContext.Provider>
  );
}
