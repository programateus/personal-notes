import { HotkeysProvider } from "@tanstack/react-hotkeys";
import { ContextMenuProvider } from "./providers/ContextMenu/ContextMenuProvider";
import { EditorScreen } from "./screens/EditorScreen";

function App() {
  return (
    <HotkeysProvider>
      <ContextMenuProvider>
        <EditorScreen />
      </ContextMenuProvider>
    </HotkeysProvider>
  );
}

export default App;
