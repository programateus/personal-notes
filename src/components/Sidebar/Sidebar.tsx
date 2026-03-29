import { forwardRef, useImperativeHandle } from "react";
import { RiFileAddLine, RiFolderAddLine } from "react-icons/ri";
import { useResizable } from "@/hooks/useResizable";

import { FileTreeNode } from "./FileTreeNode";
import { useSidebarState } from "./useSidebarState";
import type { SidebarProps, SidebarRef } from "./types";

export const Sidebar = forwardRef<SidebarRef, SidebarProps>(
  ({ onFileSelect, onFileRename }, ref) => {
    const {
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
    } = useSidebarState(onFileSelect, onFileRename);

    const { width: sidebarWidth, handleResizeStart } = useResizable(240);

    useImperativeHandle(ref, () => ({ loadFolder, addNewFileNode }));

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
              onClick={() => handleAddNewFile("file")}
              title="Novo arquivo"
              className="cursor-pointer rounded p-1 text-base-content/55
             hover:bg-base-content/10 hover:text-base-content"
            >
              <RiFileAddLine />
            </button>
            <button
              onClick={() => handleAddNewFile("directory")}
              title="Nova pasta"
              className="cursor-pointer rounded p-1 text-base-content/55
             hover:bg-base-content/10 hover:text-base-content"
            >
              <RiFolderAddLine />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {files.map((node) => (
            <FileTreeNode
              key={node.path}
              node={node}
              onFileSelect={onFileSelect}
              onNodeSelect={handleNodeSelect}
              onExpand={handleExpand}
              onStartRenaming={handleStartRenaming}
              onFinishRenaming={handleFinishRenaming}
              onCancelRenaming={handleCancelRenaming}
              loadingPaths={loadingPaths}
              onRefresh={() => rootPath && loadFolder(rootPath)}
              selectedPath={selectedNode?.path}
            />
          ))}
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
  },
);

Sidebar.displayName = "Sidebar";
