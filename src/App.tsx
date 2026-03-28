import { Sidebar } from "./components/Sidebar";
import { TabBar } from "./components/Tabs/TabBar";
import { EditorPanel } from "./components/Editor/EditorPanel";
import { useTabManager } from "./hooks/useTabManager";

function App() {
  const { tabs, activeTabId, openTab, closeTab, updateContent, setActiveTabId } = useTabManager();

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
            <EditorPanel
              tabs={tabs}
              activeTabId={activeTabId}
              onContentChange={updateContent}
            />
          </>
        ) : (
          <p className="m-auto text-sm text-base-content/35">Selecione um arquivo para começar</p>
        )}
      </main>
    </div>
  );
}

export default App;
