import { useState } from "react";
import { Sidebar } from "./components/Sidebar";

function App() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-base-100 text-base-content">
      <Sidebar onFileSelect={setSelectedFile} />
      <main className="flex flex-1 items-center justify-center">
        {selectedFile ? (
          <p className="max-w-md break-all text-sm text-base-content/55">{selectedFile}</p>
        ) : (
          <p className="text-sm text-base-content/35">Selecione um arquivo para começar</p>
        )}
      </main>
    </div>
  );
}

export default App;
