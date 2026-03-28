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
        "group flex h-full max-w-48 shrink-0 cursor-pointer select-none items-center gap-1.5 border-r border-neutral/25 px-3 text-xs",
        isActive
          ? "bg-base-100 text-base-content"
          : "bg-base-200 text-base-content/55 hover:bg-base-100/60 hover:text-base-content",
      )}
    >
      <span className="truncate">{tab.title}</span>

      <button
        onClick={handleClose}
        className={cn(
          "ml-auto shrink-0 cursor-pointer rounded px-0.5 leading-none",
          tab.isDirty
            ? "text-primary hover:bg-base-content/15 hover:text-base-content"
            : "text-base-content/40 opacity-0 hover:bg-base-content/15 hover:text-base-content group-hover:opacity-100",
        )}
        title={tab.isDirty ? "Fechar (não salvo)" : "Fechar"}
      >
        {tab.isDirty ? "●" : "×"}
      </button>
    </div>
  );
};
