import { useState } from "react";
import type { Tab } from "@/types/tab";

export function useTabManager() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  async function openTab(path: string) {
    const existing = tabs.find((t) => t.id === path);
    if (existing) {
      setActiveTabId(path);
      return;
    }

    const content = await window.electronAPI.readFile(path);
    const title = path.split(/[\\/]/).pop() ?? path;

    setTabs((prev) => [...prev, { id: path, path, title, content, isDirty: false }]);
    setActiveTabId(path);
  }

  function closeTab(id: string) {
    setTabs((prev) => {
      const idx = prev.findIndex((t) => t.id === id);
      const next = prev.filter((t) => t.id !== id);

      setActiveTabId((currentActive) => {
        if (currentActive !== id) return currentActive;
        return next[Math.max(0, idx - 1)]?.id ?? next[0]?.id ?? null;
      });

      return next;
    });
  }

  function updateContent(id: string, markdown: string) {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, content: markdown, isDirty: true } : t)),
    );
  }

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? null;

  return { tabs, activeTabId, activeTab, openTab, closeTab, updateContent, setActiveTabId };
}
