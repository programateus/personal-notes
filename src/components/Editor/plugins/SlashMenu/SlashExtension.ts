import { Extension } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import type { Instance as TippyInstance } from "tippy.js";
import tippy, { type GetReferenceClientRect } from "tippy.js";
import { SlashMenu } from "./SlashMenu";
import { buildGroups, type MenuItem } from "./menuItems";

function filterItems(query: string): MenuItem[] {
  const allItems = buildGroups().flatMap((g) => g.items);
  if (!query) return allItems;
  return allItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
}

export const SlashExtension = Extension.create({
  name: "slash",

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: "/",
        command: ({ editor, range, props }) => {
          (props as MenuItem).onRun(editor, range);
        },
        items: ({ query }) => filterItems(query),
        render: () => {
          let component: ReactRenderer;
          let popup: TippyInstance;

          return {
            onStart: (props) => {
              component = new ReactRenderer(SlashMenu, {
                props,
                editor: props.editor,
              });
              const body = document.body;
              const getRect: GetReferenceClientRect = () =>
                props.clientRect?.() ?? body.getBoundingClientRect();

              popup = tippy(body, {
                getReferenceClientRect: getRect,
                appendTo: () => body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
                popperOptions: { strategy: "fixed" },
              });
            },
            onUpdate: (props) => {
              component.updateProps(props);
              const getRect: GetReferenceClientRect = () =>
                props.clientRect?.() ?? document.body.getBoundingClientRect();
              popup.setProps({ getReferenceClientRect: getRect });
            },
            onKeyDown: (props) => {
              if (props.event.key === "Escape") {
                popup.hide();
                return true;
              }
              return (
                (
                  component.ref as { onKeyDown?: (p: { event: KeyboardEvent }) => boolean } | null
                )?.onKeyDown?.(props) ?? false
              );
            },
            onExit: () => {
              popup.destroy();
              component.destroy();
            },
          };
        },
      }),
    ];
  },
});
