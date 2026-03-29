import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { buildGroups, type MenuGroup, type MenuItem } from "./menuItems";

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
    <div className="slash-menu" onPointerDown={(e) => e.preventDefault()}>
      {groups.map((group) => (
        <div key={group.key} className="slash-menu-group">
          <p className="slash-menu-group-label">{group.label}</p>
          <ul>
            {group.items.map((item) => {
              const globalIndex = items.findIndex((i) => i.key === item.key);
              return (
                <li
                  key={item.key}
                  ref={globalIndex === selectedIndex ? selectedItemRef : null}
                  className={
                    globalIndex === selectedIndex ? "slash-menu-item active" : "slash-menu-item"
                  }
                  onPointerEnter={() => setSelectedIndex(globalIndex)}
                  onPointerUp={() => command(item)}
                >
                  <span className="slash-menu-item-icon">
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
