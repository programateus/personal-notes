import type { Editor, Range } from "@tiptap/core";

const icons = {
  text: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 5.5C5 6.33 5.67 7 6.5 7H10.5V17.5C10.5 18.33 11.17 19 12 19C12.83 19 13.5 18.33 13.5 17.5V7H17.5C18.33 7 19 6.33 19 5.5C19 4.67 18.33 4 17.5 4H6.5C5.67 4 5 4.67 5 5.5Z"/></svg>`,
  h1: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM12 17H14V7H10V9H12V17Z"/></svg>`,
  h2: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM15 15H11V13H13C14.1 13 15 12.11 15 11V9C15 7.89 14.1 7 13 7H9V9H13V11H11C9.9 11 9 11.89 9 13V17H15V15Z"/></svg>`,
  h3: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM15 15V13.5C15 12.67 14.33 12 13.5 12C14.33 12 15 11.33 15 10.5V9C15 7.89 14.1 7 13 7H9V9H13V11H11V13H13V15H9V17H13C14.1 17 15 16.11 15 15Z"/></svg>`,
  h4: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.04 3H5.04C3.94 3 3.04 3.9 3.04 5V19C3.04 20.1 3.94 21 5.04 21H19.04C20.14 21 21.04 20.1 21.04 19V5C21.04 3.9 20.14 3 19.04 3ZM19.04 19H5.04V5H19.04V19ZM13.04 17H15.04V7H13.04V11H11.04V7H9.04V13H13.04V17Z"/></svg>`,
  h5: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM15 15V13C15 11.89 14.1 11 13 11H11V9H15V7H9V13H13V15H9V17H13C14.1 17 15 16.11 15 15Z"/></svg>`,
  h6: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11 17H13C14.1 17 15 16.11 15 15V13C15 11.89 14.1 11 13 11H11V9H15V7H11C9.9 7 9 7.89 9 9V15C9 16.11 9.9 17 11 17ZM11 13H13V15H11V13ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/></svg>`,
  quote: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7.17 17C7.68 17 8.15 16.71 8.37 16.26L9.79 13.42C9.93 13.14 10 12.84 10 12.53V8C10 7.45 9.55 7 9 7H5C4.45 7 4 7.45 4 8V12C4 12.55 4.45 13 5 13H7L5.97 15.06C5.52 15.95 6.17 17 7.17 17ZM17.17 17C17.68 17 18.15 16.71 18.37 16.26L19.79 13.42C19.93 13.14 20 12.84 20 12.53V8C20 7.45 19.55 7 19 7H15C14.45 7 14 7.45 14 8V12C14 12.55 14.45 13 15 13H17L15.97 15.06C15.52 15.95 16.17 17 17.17 17Z"/></svg>`,
  divider: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 13H5C4.45 13 4 12.55 4 12C4 11.45 4.45 11 5 11H19C19.55 11 20 11.45 20 12C20 12.55 19.55 13 19 13Z"/></svg>`,
  bulletList: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.5C3.17 10.5 2.5 11.17 2.5 12C2.5 12.83 3.17 13.5 4 13.5C4.83 13.5 5.5 12.83 5.5 12C5.5 11.17 4.83 10.5 4 10.5ZM4 4.5C3.17 4.5 2.5 5.17 2.5 6C2.5 6.83 3.17 7.5 4 7.5C4.83 7.5 5.5 6.83 5.5 6C5.5 5.17 4.83 4.5 4 4.5ZM4 16.5C3.17 16.5 2.5 17.18 2.5 18C2.5 18.82 3.18 19.5 4 19.5C4.82 19.5 5.5 18.82 5.5 18C5.5 17.18 4.83 16.5 4 16.5ZM8 19H20C20.55 19 21 18.55 21 18C21 17.45 20.55 17 20 17H8C7.45 17 7 17.45 7 18C7 18.55 7.45 19 8 19ZM8 13H20C20.55 13 21 12.55 21 12C21 11.45 20.55 11 20 11H8C7.45 11 7 11.45 7 12C7 12.55 7.45 13 8 13ZM7 6C7 6.55 7.45 7 8 7H20C20.55 7 21 6.55 21 6C21 5.45 20.55 5 20 5H8C7.45 5 7 5.45 7 6Z"/></svg>`,
  orderedList: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 7H20C20.55 7 21 6.55 21 6C21 5.45 20.55 5 20 5H8C7.45 5 7 5.45 7 6C7 6.55 7.45 7 8 7ZM20 17H8C7.45 17 7 17.45 7 18C7 18.55 7.45 19 8 19H20C20.55 19 21 18.55 21 18C21 17.45 20.55 17 20 17ZM20 11H8C7.45 11 7 11.45 7 12C7 12.55 7.45 13 8 13H20C20.55 13 21 12.55 21 12C21 11.45 20.55 11 20 11Z"/></svg>`,
  taskList: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5.67 16.34L9.39 12.62C9.54 12.47 9.72 12.39 9.92 12.40C10.12 12.40 10.30 12.48 10.45 12.63C10.58 12.78 10.65 12.96 10.65 13.16C10.65 13.36 10.58 13.54 10.45 13.69L6.33 17.82C6.15 18.00 5.94 18.09 5.69 18.09C5.45 18.09 5.24 18.00 5.06 17.82L3.02 15.78C2.88 15.64 2.81 15.46 2.81 15.25C2.82 15.04 2.89 14.87 3.03 14.73C3.17 14.59 3.34 14.52 3.55 14.52C3.76 14.52 3.93 14.59 4.07 14.73L5.67 16.34ZM13.76 16.56C13.55 16.56 13.37 16.49 13.23 16.34C13.08 16.20 13.01 16.02 13.01 15.81C13.01 15.60 13.08 15.42 13.23 15.27C13.37 15.13 13.55 15.06 13.76 15.06H20.76C20.97 15.06 21.15 15.13 21.29 15.27C21.44 15.42 21.51 15.60 21.51 15.81C21.51 16.02 21.44 16.20 21.29 16.34C21.15 16.49 20.97 16.56 20.76 16.56H13.76ZM5.67 8.72L9.39 5.00C9.54 4.85 9.72 4.78 9.92 4.78C10.12 4.78 10.30 4.86 10.45 5.02C10.58 5.17 10.65 5.34 10.65 5.54C10.65 5.75 10.58 5.92 10.45 6.07L6.33 10.20C6.15 10.39 5.94 10.48 5.69 10.48C5.45 10.48 5.24 10.39 5.06 10.20L3.02 8.16C2.88 8.02 2.81 7.85 2.81 7.64C2.82 7.43 2.89 7.25 3.03 7.12C3.17 6.98 3.34 6.91 3.55 6.91C3.76 6.91 3.93 6.98 4.07 7.12L5.67 8.72ZM13.76 8.94C13.55 8.94 13.37 8.87 13.23 8.73C13.08 8.58 13.01 8.40 13.01 8.19C13.01 7.98 13.08 7.80 13.23 7.66C13.37 7.51 13.55 7.44 13.76 7.44H20.76C20.97 7.44 21.15 7.51 21.29 7.66C21.44 7.80 21.51 7.98 21.51 8.19C21.51 8.40 21.44 8.58 21.29 8.73C21.15 8.87 20.97 8.94 20.76 8.94H13.76Z"/></svg>`,
  code: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12L9.4 7.4L8 6L2 12L8 18L9.4 16.6ZM14.6 16.6L19.2 12L14.6 7.4L16 6L22 12L16 18L14.6 16.6Z"/></svg>`,
  table: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3ZM20 5V8H5V5H20ZM15 19H10V10H15V19ZM5 10H8V19H5V10ZM17 19V10H20V19H17Z"/></svg>`,
};

export type MenuItem = {
  key: string;
  label: string;
  icon: string;
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
          icon: icons.text,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setParagraph().run();
          },
        },
        {
          key: "h1",
          label: "Heading 1",
          icon: icons.h1,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
          },
        },
        {
          key: "h2",
          label: "Heading 2",
          icon: icons.h2,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
          },
        },
        {
          key: "h3",
          label: "Heading 3",
          icon: icons.h3,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
          },
        },
        {
          key: "h4",
          label: "Heading 4",
          icon: icons.h4,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 4 }).run();
          },
        },
        {
          key: "h5",
          label: "Heading 5",
          icon: icons.h5,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 5 }).run();
          },
        },
        {
          key: "h6",
          label: "Heading 6",
          icon: icons.h6,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 6 }).run();
          },
        },
        {
          key: "quote",
          label: "Quote",
          icon: icons.quote,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setBlockquote().run();
          },
        },
        {
          key: "divider",
          label: "Divider",
          icon: icons.divider,
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
          icon: icons.bulletList,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
          },
        },
        {
          key: "ordered-list",
          label: "Ordered List",
          icon: icons.orderedList,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
          },
        },
        {
          key: "task-list",
          label: "Task List",
          icon: icons.taskList,
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
          icon: icons.code,
          onRun: (editor, range) => {
            editor.chain().focus().deleteRange(range).setCodeBlock().run();
          },
        },
        {
          key: "table",
          label: "Table",
          icon: icons.table,
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
