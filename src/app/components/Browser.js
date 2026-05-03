'use client';
import React, {useState} from 'react';

export default function Browser() {
  const [url, setUrl] = useState('https://example.com');
  const [input, setInput] = useState('https://example.com');

  const loadUrl = () => {
    let finalUrl = input;

    if (!finalUrl.startsWith('http')) {
      finalUrl = 'https://' + finalUrl;
    }
    setUrl(finalUrl);
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950 text-white">
      <div className="h-10 flex items-center gap-2 px-2 bg-zinc-900 border-b border-zinc-700">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-zinc-800 px-2 py-1 rounded text-sm outline-none"
          placeholder="Enter URL..."
        />
        <button
          onClick={loadUrl}
          className="bg-blue-600 px-3 py-1 rounded text-sm"
        >
          Go
        </button>
      </div>
      <iframe
        src={url}
        className="flex-1 w-full h-full"
      />
    </div>
  );
}