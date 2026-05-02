'use client';

import React, { useState } from 'react';
import { Folder, FileText, Image, Music, Video, Search } from 'lucide-react';

export default function Files() {
  const [selected, setSelected] = useState(null);

  const files = [
    { id: 1, name: 'Documents', type: 'folder' },
    { id: 2, name: 'Images', type: 'folder' },
    { id: 3, name: 'Music', type: 'folder' },
    { id: 4, name: 'Resume.pdf', type: 'file' },
    { id: 5, name: 'Photo.png', type: 'image' },
    { id: 6, name: 'Song.mp3', type: 'audio' },
    { id: 7, name: 'Video.mp4', type: 'video' },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'folder': return <Folder size={28} />;
      case 'image': return <Image size={28} />;
      case 'audio': return <Music size={28} />;
      case 'video': return <Video size={28} />;
      default: return <FileText size={28} />;
    }
  };

  return (
    <div className="w-full h-140 bg-zinc-900 border border-zinc-700 shadow-2xl flex overflow-hidden">

      {/*Sidebar*/}
      <div className="w-60 bg-zinc-800 p-4 space-y-6">
        <div>
          <p className="text-xs text-zinc-400 mb-2">Quick Access</p>
          <div className="space-y-2 text-sm">
            <div className="hover:bg-zinc-700 p-2 rounded-lg cursor-pointer">Desktop</div>
            <div className="hover:bg-zinc-700 p-2 rounded-lg cursor-pointer">Downloads</div>
            <div className="hover:bg-zinc-700 p-2 rounded-lg cursor-pointer">Documents</div>
            <div className="hover:bg-zinc-700 p-2 rounded-lg cursor-pointer">Pictures</div>
          </div>
        </div>

        <div>
          <p className="text-xs text-zinc-400 mb-2">Drives</p>
          <div className="space-y-2 text-sm">
            <div className="hover:bg-zinc-700 p-2 rounded-lg cursor-pointer">Local Disk (C:)</div>
            <div className="hover:bg-zinc-700 p-2 rounded-lg cursor-pointer">Data (D:)</div>
          </div>
        </div>
      </div>

      {/*Main Area*/}
      <div className="flex-1 flex flex-col">

        {/*Top Bar*/}
        <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">File Explorer</h2>

          <div className="flex items-center bg-zinc-800 px-3 py-2 rounded-xl">
            <Search size={16} className="mr-2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search files..."
              className="bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/*File Grid*/}
        <div className="p-6 grid grid-cols-4 gap-6 overflow-auto">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => setSelected(file.id)}
              className={`p-4 rounded-2xl cursor-pointer border transition-all flex flex-col items-center text-center
              ${selected === file.id 
                ? 'border-blue-500 bg-zinc-800' 
                : 'border-zinc-700 hover:border-zinc-600'}`}
            >
              <div className="mb-3 text-blue-400">
                {getIcon(file.type)}
              </div>
              <p className="text-sm wrap-break-words">{file.name}</p> 
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}