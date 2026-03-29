import { RiCloseLine, RiCircleFill } from "react-icons/ri";

import type { Tab } from "@/types/tab";
import cn from "@/utils/cn";

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
}

export const TabItem = ({ tab, isActive, onSelect, onClose }: TabItemProps) => {
  function handleClose(e: React.MouseEvent) {
    e.stopPropagation();
    onClose();
  }

  return (
    <div
      role="tab"
      aria-selected={isActive}
      onClick={onSelect}
      className={cn(
        "flex h-full max-w-48 shrink-0 cursor-pointer items-center gap-1.5 border-r border-neutral/25 px-2 text-xs select-none",
        isActive
          ? "bg-base-100 text-base-content"
          : "bg-base-200 text-base-content/55 hover:bg-base-100/60 hover:text-base-content",
      )}
    >
      <span className="truncate">{tab.title}</span>

      <button
        onClick={handleClose}
        className={cn(
          "ml-auto shrink-0 cursor-pointer rounded p-0.5 leading-none text-base-content/40",
          tab.isDirty
            ? "hover:bg-base-content/15 hover:text-base-content "
            : "hover:bg-base-content/15 hover:text-base-content",
        )}
        title={tab.isDirty ? "Fechar (não salvo)" : "Fechar"}
      >
        {tab.isDirty ? <RiCircleFill /> : <RiCloseLine />}
      </button>
    </div>
  );
};
