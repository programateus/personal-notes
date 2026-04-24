import { useResizable } from "@/hooks/useResizable";
import { SidebarFileTree } from "./SidebarFileTree";
import { SidebarHeader } from "./SidebarHeader";
import type { SidebarProps } from "./types";

export function Sidebar({ controller }: SidebarProps) {
  const { width: sidebarWidth, handleResizeStart } = useResizable(240);
  const { state, actions } = controller;
  const { files, rootName, loadingPaths } = state;

  return (
    <aside
      className={`relative flex h-full shrink-0 flex-col border-r border-neutral/25 bg-base-200${files.length === 0 ? " hidden" : " min-w-40"}`}
      style={{ width: sidebarWidth }}
    >
      <SidebarHeader rootName={rootName} onAddNew={actions.addNewFileFromSelection} />
      <SidebarFileTree controller={controller} />

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
}
