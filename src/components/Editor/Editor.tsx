import { useEffect, useRef } from "react";

import { common, createLowlight } from "lowlight";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { SlashExtension } from "./plugins/SlashMenu/SlashExtension";

const lowlight = createLowlight(common);

interface EditorProps {
  defaultValue: string;
  onChange: (markdown: string) => void;
}

export const Editor = ({ defaultValue, onChange }: EditorProps) => {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    extensions: [
      CodeBlockLowlight.configure({ lowlight }),
      StarterKit.configure({
        codeBlock: false,
      }),
      Markdown,
      Placeholder.configure({ placeholder: "Escreva, digite / para abrir o menu de atalhos", showOnlyCurrent: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      SlashExtension,
    ],
    content: defaultValue,
    contentType: "markdown",
    onUpdate: ({ editor: e }) => {
      onChangeRef.current(e.getMarkdown());
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".ProseMirror")) return;
    editor?.commands.focus("end");
  };

  return <EditorContent editor={editor} className="h-full" onClick={handleClick} />;
};
