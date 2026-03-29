import { EditorPanel } from "@/components/Editor/EditorPanel";
import { Sidebar } from "@/components/Sidebar";
import { TabBar } from "@/components/Tabs/TabBar";
import { useEditorHotkeys } from "@/hooks/useEditorHotkeys";
import { useTabManager } from "@/hooks/useTabManager";

export const EditorScreen = () => {
  const {
    tabs,
    activeTabId,
    activeTab,
    openTab,
    closeTab,
    updateContent,
    markSaved,
    setActiveTabId,
  } = useTabManager();

  useEditorHotkeys({ tabs, activeTabId, activeTab, setActiveTabId, closeTab, markSaved });

  return (
    <div className="flex h-screen bg-base-100 text-base-content">
      <Sidebar onFileSelect={openTab} />
      <main className="flex flex-1 flex-col overflow-hidden">
        {tabs.length > 0 ? (
          <>
            <TabBar
              tabs={tabs}
              activeTabId={activeTabId}
              onSelect={setActiveTabId}
              onClose={closeTab}
            />
            <EditorPanel tabs={tabs} activeTabId={activeTabId} onContentChange={updateContent} />
          </>
        ) : (
          <p className="m-auto text-sm text-base-content/35">Selecione um arquivo para começar</p>
        )}
      </main>
    </div>
  );
};
