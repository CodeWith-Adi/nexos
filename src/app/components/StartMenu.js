'use client';

import React, { useState } from 'react';
import { Search, Settings, Power, FolderOpen, Monitor } from 'lucide-react';

export default function StartMenu({ onOpenApp }) {
  const [search, setSearch] = useState('');

  const apps = [
    { name: 'Files', type: 'files', icon: <FolderOpen size={20} /> },
    { name: 'Editor', type: 'editor', icon: <Monitor size={20} /> },
    { name: 'Settings', type: 'settings', icon: <Settings size={20} /> },
  ];

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-105 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-4">

      {/* Search*/}
      <div className="flex items-center bg-zinc-800 px-3 py-2 rounded-xl mb-4">
        <Search size={16} className="mr-2 text-zinc-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search apps..."
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      {/*Apps*/}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {filteredApps.map((app, i) => (
          <div
            key={i}
            onClick={() => onOpenApp(app.type)}
            className="p-3 rounded-xl hover:bg-white/10 cursor-pointer flex flex-col items-center gap-2 transition-all"
          >
            <div className="text-blue-400">{app.icon}</div>
            <span className="text-xs">{app.name}</span>
          </div>
        ))}
      </div>

      {/*Bottom*/}
      <div className="flex justify-between items-center border-t border-white/10 pt-3">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-2 py-1 rounded-lg">
          <Settings size={16} />
          <span className="text-sm">Settings</span>
        </div>

        <div className="p-2 hover:bg-red-500 rounded-xl cursor-pointer">
          <Power size={16} />
        </div>
      </div>
    </div>
  );
}