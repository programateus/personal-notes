import { createPortal } from "react-dom";
import type { ContextMenuOption } from "@/providers/ContextMenu/types";

interface ContextMenuProps {
  options: ContextMenuOption[];
  x: number;
  y: number;
  onClose: () => void;
}

const ITEM_HEIGHT = 32;
const MENU_PADDING = 12;

export function ContextMenu({ options, x, y, onClose }: ContextMenuProps) {
  const estimatedHeight = options.length * ITEM_HEIGHT + MENU_PADDING;
  const adjustedX = Math.min(x, window.innerWidth - 180);
  const adjustedY = Math.min(y, window.innerHeight - estimatedHeight - 8);

  return createPortal(
    <div
      className="context-menu"
      style={{ top: adjustedY, left: adjustedX }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <ul>
        {options.map((opt, i) => (
          <li
            key={i}
            className={`context-menu-item${opt.danger ? " danger" : ""}`}
            onClick={() => {
              opt.action();
              onClose();
            }}
          >
            <span className="context-menu-item-icon">
              <opt.icon />
            </span>
            <span>{opt.label}</span>
          </li>
        ))}
      </ul>
    </div>,
    document.body,
  );
}
