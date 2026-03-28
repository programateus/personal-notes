import { useEffect, useRef } from "react";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";

interface EditorProps {
  defaultValue: string;
  onChange: (markdown: string) => void;
}

export const Editor = ({ defaultValue, onChange }: EditorProps) => {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEditor((root) => {
    return new Crepe({ root, defaultValue }).on((api) => {
      api.markdownUpdated((_ctx, markdown) => {
        if (markdown !== defaultValue) {
          onChangeRef.current(markdown);
        }
      });
    });
  }, []);

  return <Milkdown />;
};
