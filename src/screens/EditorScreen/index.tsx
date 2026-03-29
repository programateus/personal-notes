import { useEffect, useRef } from "react";
import { EditorPanel } from "@/components/Editor/EditorPanel";
import { Sidebar, type SidebarRef } from "@/components/Sidebar";
import { TabBar } from "@/components/Tabs/TabBar";
import { useEditorHotkeys } from "@/hooks/useEditorHotkeys";
import { useTabManager } from "@/hooks/useTabManager";

export const EditorScreen = () => {
  const sidebarRef = useRef<SidebarRef>(null);
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

  useEffect(() => {
    const handleMenuOpen = (data: unknown) => {
      const { path, isDirectory } = data as { path: string; isDirectory: boolean };
      if (isDirectory) {
        sidebarRef.current?.loadFolder(path);
      } else {
        openTab(path);
      }
    };

    const handleMenuSave = () => {
      if (!activeTab?.isDirty) return;
      window.electronAPI
        .writeFile(activeTab.path, activeTab.content)
        .then(() => markSaved(activeTab.id));
    };

    const handleMenuCloseTab = () => {
      if (activeTabId) closeTab(activeTabId);
    };

    const unregisterOpen = window.electronAPI.onMenuAction("menu:open", handleMenuOpen);
    const unregisterSave = window.electronAPI.onMenuAction("menu:save", handleMenuSave);
    const unregisterCloseTab = window.electronAPI.onMenuAction(
      "menu:close-tab",
      handleMenuCloseTab,
    );

    return () => {
      unregisterOpen();
      unregisterSave();
      unregisterCloseTab();
    };
  }, [activeTab, activeTabId, closeTab, markSaved, openTab]);

  return (
    <div className="flex h-screen bg-base-100 text-base-content">
      <Sidebar ref={sidebarRef} onFileSelect={openTab} />
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
          <p className="m-auto text-sm text-base-content/35">
            Vá em Arquivo → Abrir... para começar
          </p>
        )}
      </main>
    </div>
  );
};
