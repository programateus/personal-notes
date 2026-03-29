import { createContext } from "react";
import { type ContextMenuContextType } from "./types";

export const ContextMenuContext = createContext<ContextMenuContextType | null>(null);
