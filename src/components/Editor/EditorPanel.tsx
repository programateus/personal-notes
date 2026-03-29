import type { Tab } from "@/types/tab";
import { EditorWrapper } from "./EditorWrapper";

interface EditorPanelProps {
  tabs: Tab[];
  activeTabId: string | null;
  onContentChange: (id: string, markdown: string) => void;
}

export const EditorPanel = ({ tabs, activeTabId, onContentChange }: EditorPanelProps) => {
  return (
    <div className="relative flex-1 overflow-hidden">
      {tabs.map((tab) => (
        <div key={tab.id} className={tab.id === activeTabId ? "flex h-full w-full" : "hidden"}>
          <EditorWrapper content={tab.content} onChange={(md) => onContentChange(tab.id, md)} />
        </div>
      ))}
    </div>
  );
};
