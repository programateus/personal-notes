import { RiFileAddLine, RiFolderAddLine } from "react-icons/ri";
import type { FileType } from "@/electron";

interface SidebarHeaderProps {
  rootName: string | null;
  onAddNew: (type: FileType) => void;
}

export function SidebarHeader({ rootName, onAddNew }: SidebarHeaderProps) {
  return (
    <div className="flex items-center border-b border-neutral/25 px-3 py-2">
      <span className="text-xs font-semibold tracking-wider text-base-content/55 uppercase">
        {rootName ?? "Notas"}
      </span>
      <div className="ml-auto flex gap-1">
        <button
          onClick={() => onAddNew("file")}
          title="Novo arquivo"
          className="cursor-pointer rounded p-1 text-base-content/55
             hover:bg-base-content/10 hover:text-base-content"
        >
          <RiFileAddLine />
        </button>
        <button
          onClick={() => onAddNew("directory")}
          title="Nova pasta"
          className="cursor-pointer rounded p-1 text-base-content/55
             hover:bg-base-content/10 hover:text-base-content"
        >
          <RiFolderAddLine />
        </button>
      </div>
    </div>
  );
}
