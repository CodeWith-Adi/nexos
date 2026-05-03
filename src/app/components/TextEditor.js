'use client';
import React, {useState, useEffect} from 'react';

export default function TextEditor({file, folder = "documents"}) {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState(file?.name || "untitled");
  const [showSaveBar, setShowSaveBar] = useState(false);

  useEffect(() => {
    if (file) {
      setText(file.content || "");
      setFileName(file.name?.replace(".txt", "") || "untitled");
    }
  }, [file]);

  const doSave = async (name) => {
    const finalName =
      name && name.trim() !== "" ? name.trim() : "untitled";

    const res = await fetch('/api/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: "create_file",
        name: finalName.endsWith(".txt") ? finalName : finalName + ".txt",
        content: text,
        folder: folder,
        type: "text"
      })
    });

    const data = await res.json();

    if (data.success) {
      setShowSaveBar(false);
    } else {
      alert("Save failed");
    }
  };

  const saveFile = async () => {
    let name = fileName;

    if (!name || name.trim() === "" || name === "untitled") {
      setShowSaveBar(true);
      return;
    }

    await doSave(name);
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-900 text-white relative">
      <div className="h-10 bg-zinc-800 flex items-center justify-between px-3 border-b border-zinc-700">
        <div className="flex items-center gap-1">
          <input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="bg-transparent outline-none text-sm w-40"
          />
          <span className="text-zinc-400 text-sm">.txt</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={saveFile}
            className="bg-green-600 px-3 py-1 rounded text-sm hover:bg-green-500 transition"
          >
            Save
          </button>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 p-3 bg-black outline-none resize-none font-mono text-sm"
        placeholder="Start typing..."
      />
      {showSaveBar && (
        <div className="absolute bottom-0 left-0 w-full bg-zinc-950 border-t border-zinc-700 p-3 flex items-center gap-3">

          <input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
            className="bg-zinc-800 px-3 py-2 rounded-lg outline-none text-sm flex-1"
          />
          <span className="text-zinc-400 text-sm">
            .txt
          </span>
          <button
            onClick={() => doSave(fileName)}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition"
          >
            Confirm
          </button>

        </div>
      )}

    </div>
  );
}