import { useState, useEffect, useCallback, type ReactNode } from "react";
import { ContextMenuContext } from "./ContextMenuContext";
import { ContextMenu } from "@/components/ContextMenu/ContextMenu";
import type { ContextMenuOption } from "./types";

interface ContextMenuState {
  isOpen: boolean;
  options: ContextMenuOption[];
  x: number;
  y: number;
}

export function ContextMenuProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ContextMenuState>({
    isOpen: false,
    options: [],
    x: 0,
    y: 0,
  });

  const open = useCallback((options: ContextMenuOption[], x: number, y: number) => {
    setState({ isOpen: true, options, x, y });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  useEffect(() => {
    if (!state.isOpen) return;
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [state.isOpen, close]);

  return (
    <ContextMenuContext.Provider value={{ open, close }}>
      {children}
      {state.isOpen && (
        <ContextMenu options={state.options} x={state.x} y={state.y} onClose={close} />
      )}
    </ContextMenuContext.Provider>
  );
}
