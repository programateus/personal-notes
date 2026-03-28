import { MilkdownProvider } from "@milkdown/react";
import { Editor } from "./Editor";

interface EditorWrapperProps {
  content: string;
  onChange: (markdown: string) => void;
}

export const EditorWrapper = ({ content, onChange }: EditorWrapperProps) => {
  return (
    <MilkdownProvider>
      <div className="h-full w-full overflow-y-auto">
        <Editor defaultValue={content} onChange={onChange} />
      </div>
    </MilkdownProvider>
  );
};
