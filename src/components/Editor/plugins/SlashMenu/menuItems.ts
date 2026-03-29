import type { ComponentType } from "react";
import type { Editor, Range } from "@tiptap/core";
import {
  IconText, IconH1, IconH2, IconH3, IconH4, IconH5, IconH6,
  IconQuote, IconDivider, IconBulletList, IconOrderedList,
  IconTaskList, IconCode, IconTable,
} from "./SlashMenuIcons";

export type MenuItem = {
  key: string;
  label: string;
  icon: ComponentType;
  onRun: (editor: Editor, range: Range) => void;
};

export type MenuGroup = {
  key: string;
  label: string;
  items: MenuItem[];
};

export const buildGroups = (): MenuGroup[] => {
  return [
    {
      key: "text",
      label: "Text",
      items: [
        {
          key: "text",
          label: "Text",
          icon: IconText,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setParagraph().run();
          },
        },
        {
          key: "h1",
          label: "Heading 1",
          icon: IconH1,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
          },
        },
        {
          key: "h2",
          label: "Heading 2",
          icon: IconH2,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
          },
        },
        {
          key: "h3",
          label: "Heading 3",
          icon: IconH3,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
          },
        },
        {
          key: "h4",
          label: "Heading 4",
          icon: IconH4,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 4 }).run();
          },
        },
        {
          key: "h5",
          label: "Heading 5",
          icon: IconH5,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 5 }).run();
          },
        },
        {
          key: "h6",
          label: "Heading 6",
          icon: IconH6,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 6 }).run();
          },
        },
        {
          key: "quote",
          label: "Quote",
          icon: IconQuote,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setBlockquote().run();
          },
        },
        {
          key: "divider",
          label: "Divider",
          icon: IconDivider,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setHorizontalRule().run();
          },
        },
      ],
    },
    {
      key: "list",
      label: "List",
      items: [
        {
          key: "bullet-list",
          label: "Bullet List",
          icon: IconBulletList,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
          },
        },
        {
          key: "ordered-list",
          label: "Ordered List",
          icon: IconOrderedList,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
          },
        },
        {
          key: "task-list",
          label: "Task List",
          icon: IconTaskList,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).toggleTaskList().run();
          },
        },
      ],
    },
    {
      key: "advanced",
      label: "Advanced",
      items: [
        {
          key: "code",
          label: "Code Block",
          icon: IconCode,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setCodeBlock().run();
          },
        },
        {
          key: "table",
          label: "Table",
          icon: IconTable,
          onRun: (editor, range) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run();
          },
        },
      ],
    },
  ];
};
