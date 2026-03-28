import { useState } from 'react'
import { Sidebar } from './components/Sidebar'

function App() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  return (
    <div className="flex h-screen bg-neutral-900 text-neutral-100">
      <Sidebar onFileSelect={setSelectedFile} />
      <main className="flex flex-1 items-center justify-center">
        {selectedFile ? (
          <p className="max-w-md break-all text-sm text-neutral-400">{selectedFile}</p>
        ) : (
          <p className="text-sm text-neutral-600">Selecione um arquivo para começar</p>
        )}
      </main>
    </div>
  )
}

export default App
