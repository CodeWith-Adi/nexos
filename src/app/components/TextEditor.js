'use client';

import React, { useState } from 'react';
import { X, Minimize2, Save } from 'lucide-react';

export default function TextEditor({ onClose }) {
  const [text, setText] = useState(`Welcome to WebOs Text Editor!`);

  React.useEffect(() => {
    const words = text.trim().split(/\s+/).length;
  }, [text]);

  const handleSave = () => {
    alert("File saved successfully! (Demo)");
  };

  return (
    <div className="w-180 h-120 bg-zinc-900 border border-zinc-700 overflow-hidden shadow-2xl flex flex-col">


      {/* Text Area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 bg-zinc-800/30 p-5 text-white font-mono text-[15px] leading-relaxed resize-none focus:outline-none"
        spellCheck={false}
        placeholder="Start typing..."
      />
      {/* Toolbar */}
      <div className="h-10 bg-zinc-800/80 border-b border-zinc-700 flex items-center px-4 gap-4 text-sm">
        <button 
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Save size={16} />
          Save
        </button>
      </div>
    </div>
  );
}