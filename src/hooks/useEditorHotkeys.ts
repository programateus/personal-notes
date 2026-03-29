import { useHotkeys } from "@tanstack/react-hotkeys";
import type { Tab } from "@/types/tab";

interface UseEditorHotkeysOptions {
  tabs: Tab[];
  activeTabId: string | null;
  activeTab: Tab | null;
  setActiveTabId: (id: string) => void;
  closeTab: (id: string) => void;
  markSaved: (id: string) => void;
}

export function useEditorHotkeys({
  tabs,
  activeTabId,
  activeTab,
  setActiveTabId,
  closeTab,
  markSaved,
}: UseEditorHotkeysOptions) {
  useHotkeys(
    [
      {
        hotkey: "Mod+S",
        callback: async () => {
          if (!activeTab?.isDirty) return;
          await window.electronAPI.writeFile(activeTab.path, activeTab.content);
          markSaved(activeTab.id);
        },
      },
      {
        hotkey: "Mod+W",
        callback: () => {
          if (activeTabId) closeTab(activeTabId);
        },
      },
      {
        hotkey: "Mod+Tab",
        callback: () => {
          if (tabs.length < 2 || !activeTabId) return;
          const idx = tabs.findIndex((t) => t.id === activeTabId);
          const next = tabs[(idx + 1) % tabs.length];
          setActiveTabId(next.id);
        },
      },
      {
        hotkey: "Mod+Shift+Tab",
        callback: () => {
          if (tabs.length < 2 || !activeTabId) return;
          const idx = tabs.findIndex((t) => t.id === activeTabId);
          const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
          setActiveTabId(prev.id);
        },
      },
    ],
    { preventDefault: true },
  );
}
