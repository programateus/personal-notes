import { useContext } from "react";
import { ContextMenuContext } from "./ContextMenuContext";

export function useContextMenu() {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) throw new Error("useContextMenu must be used inside ContextMenuProvider");
  return ctx;
}
