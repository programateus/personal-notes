import { createPortal } from "react-dom";
import type { ContextMenuOption } from "@/providers/ContextMenu/types";
import cn from "@/utils/cn";

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
      className="fixed z-[100] bg-base-200 border border-[color-mix(in_oklch,var(--color-base-content)_15%,transparent)] rounded-lg p-[6px] min-w-[160px] font-ui text-sm"
      style={{ top: adjustedY, left: adjustedX }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <ul className="list-none m-0 p-0">
        {options.map((opt, i) => (
          <li
            key={i}
            className={cn(
              "flex items-center gap-2 px-2 py-[6px] rounded-[5px] cursor-pointer transition-[background] duration-100 select-none",
              opt.danger
                ? "text-error hover:bg-[color-mix(in_oklch,var(--color-error)_15%,var(--color-base-200))]"
                : "text-base-content hover:bg-[color-mix(in_oklch,var(--color-primary)_15%,var(--color-base-200))]",
            )}
            onClick={() => {
              opt.action();
              onClose();
            }}
          >
            <span
              className={cn(
                "flex items-center justify-center w-5 h-5 shrink-0",
                opt.danger
                  ? "text-error"
                  : "text-[color-mix(in_oklch,var(--color-base-content)_70%,transparent)]",
              )}
            >
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
