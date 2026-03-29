import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { buildGroups, type MenuGroup, type MenuItem } from "./menuItems";
import cn from "@/utils/cn";

type SlashMenuProps = {
  items: MenuItem[];
  command: (item: MenuItem) => void;
};

type SlashMenuRef = {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
};

export const SlashMenu = forwardRef<SlashMenuRef, SlashMenuProps>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedItemRef = useRef<HTMLLIElement>(null);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowDown") {
        setSelectedIndex((i) => Math.min(i + 1, items.length - 1));
        return true;
      }
      if (event.key === "ArrowUp") {
        setSelectedIndex((i) => Math.max(i - 1, 0));
        return true;
      }
      if (event.key === "Enter") {
        const item = items[selectedIndex];
        if (item) command(item);
        return true;
      }
      return false;
    },
  }));

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  useEffect(() => {
    selectedItemRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedIndex]);

  const itemKeys = new Set(items.map((i) => i.key));
  const groups: MenuGroup[] = buildGroups()
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => itemKeys.has(item.key)),
    }))
    .filter((group) => group.items.length > 0);

  if (items.length === 0) return null;

  return (
    <div
      className="bg-base-200 border border-[color-mix(in_oklch,var(--color-base-content)_15%,transparent)] rounded-lg p-[6px] w-[200px] max-h-80 overflow-y-auto font-ui text-sm"
      style={{
        boxShadow:
          "0px 4px 6px -1px color-mix(in oklch, var(--color-base-content) 10%, transparent), 0px 2px 4px -2px color-mix(in oklch, var(--color-base-content) 6%, transparent)",
      }}
      onPointerDown={(e) => e.preventDefault()}
    >
      {groups.map((group, groupIndex) => (
        <div
          key={group.key}
          className={cn(
            groupIndex > 0 &&
              "mt-1 pt-1 border-t border-[color-mix(in_oklch,var(--color-base-content)_10%,transparent)]",
          )}
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.05em] text-[color-mix(in_oklch,var(--color-base-content)_45%,transparent)] pt-[2px] px-2 pb-1 m-0">
            {group.label}
          </p>
          <ul className="list-none m-0 p-0">
            {group.items.map((item) => {
              const globalIndex = items.findIndex((i) => i.key === item.key);
              const isActive = globalIndex === selectedIndex;
              return (
                <li
                  key={item.key}
                  ref={isActive ? selectedItemRef : null}
                  className={cn(
                    "flex items-center gap-2 px-2 py-[6px] rounded-[5px] cursor-pointer text-base-content transition-[background] duration-100 select-none hover:bg-[color-mix(in_oklch,var(--color-primary)_15%,var(--color-base-200))]",
                    isActive && "bg-[color-mix(in_oklch,var(--color-primary)_15%,var(--color-base-200))]",
                  )}
                  onPointerEnter={() => setSelectedIndex(globalIndex)}
                  onPointerUp={() => command(item)}
                >
                  <span
                    className={cn(
                      "flex items-center justify-center w-5 h-5 shrink-0",
                      isActive
                        ? "text-primary"
                        : "text-[color-mix(in_oklch,var(--color-base-content)_70%,transparent)]",
                    )}
                  >
                    <item.icon />
                  </span>
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
});

SlashMenu.displayName = "SlashMenu";
