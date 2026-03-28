import type { Tab } from "@/types/tab";
import { TabItem } from "./TabItem";

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string | null;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

export const TabBar = ({ tabs, activeTabId, onSelect, onClose }: TabBarProps) => {
  return (
    <div
      role="tablist"
      className="flex h-9 shrink-0 overflow-x-auto border-b border-neutral/25 bg-base-200"
    >
      {tabs.map((tab) => (
        <TabItem
          key={tab.id}
          tab={tab}
          isActive={tab.id === activeTabId}
          onSelect={() => onSelect(tab.id)}
          onClose={() => onClose(tab.id)}
        />
      ))}
    </div>
  );
};
