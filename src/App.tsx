import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { EditorWrapper } from "./components/Editor/EditorWrapper";

function App() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-base-100 text-base-content">
      <Sidebar onFileSelect={setSelectedFile} />
      <main className="flex flex-1 flex-col overflow-hidden">
        {selectedFile ? (
          <EditorWrapper />
        ) : (
          <p className="text-sm text-base-content/35">Selecione um arquivo para começar</p>
        )}
      </main>
    </div>
  );
}

export default App;
