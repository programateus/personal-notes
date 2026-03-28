import { MilkdownProvider } from "@milkdown/react";
import { Editor } from "./Editor";

export const EditorWrapper = () => {
  return (
    <MilkdownProvider>
      <div className="h-full w-full overflow-y-auto">
        <Editor />
      </div>
    </MilkdownProvider>
  );
};
