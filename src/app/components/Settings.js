'use client';

import React, { useState, useEffect } from 'react';
import { X, Minimize2, Sun, Moon, Monitor, Clock } from 'lucide-react';

export default function Settings({ onClose }) {
  const [theme, setTheme] = useState('dark');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));

      setCurrentDate(now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    alert(`Theme changed to ${newTheme} mode! (Demo)`);
  };

  return (
    <div className="w-full h-140 bg-zinc-900 border border-zinc-700 py-15 px-2 my-5 overflow-hidden shadow-2xl flex flex-col">
      <div className="flex-1 p-6 overflow-auto">
        {/*Header Info*/}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">NexOS</h1>
          <p className="text-zinc-400">Version 1.0 • Build 2026</p>
          
          <div className="mt-4 flex items-center gap-3 text-sm bg-zinc-800 rounded-xl p-4">
            <Clock size={20} />
            <div>
              <p className="font-medium">{currentDate}</p>
              <p className="text-zinc-400">{currentTime}</p>
            </div>
          </div>
        </div>

        {/*Settings Sections*/}
        <div className="space-y-8">
          
          {/*Appearance*/}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sun size={20} /> Appearance
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div 
                onClick={() => changeTheme('light')}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${theme === 'light' ? 'border-blue-500 bg-zinc-800' : 'border-zinc-700 hover:border-zinc-600'}`}
              >
                <div className="h-24 bg-white rounded-xl mb-3"></div>
                <p className="font-medium text-center">Light</p>
              </div>

              <div 
                onClick={() => changeTheme('dark')}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${theme === 'dark' ? 'border-blue-500 bg-zinc-800' : 'border-zinc-700 hover:border-zinc-600'}`}
              >
                <div className="h-24 bg-zinc-900 rounded-xl mb-3"></div>
                <p className="font-medium text-center">Dark</p>
              </div>

              <div 
                onClick={() => changeTheme('system')}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${theme === 'system' ? 'border-blue-500 bg-zinc-800' : 'border-zinc-700 hover:border-zinc-600'}`}
              >
                <div className="h-24 bg-linear-to-br from-zinc-800 to-white rounded-xl mb-3"></div>
                <p className="font-medium text-center">System</p>
              </div>
            </div>
          </div>

          {/*System Info*/}
          <div>
            <h2 className="text-lg font-semibold mb-4">System Information</h2>
            <div className="bg-zinc-800/50 rounded-2xl p-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">OS Name</span>
                <span>NexOS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Version</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Built with</span>
                <span>Next.js + Tailwind</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Memory</span>
                <span>8 GB / 16 GB</span>
              </div>
            </div>
          </div>

          {/*Quick Toggles*/}
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-800 rounded-2xl p-5 flex items-center gap-4 hover:bg-zinc-700/70 cursor-pointer transition-colors">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                  📶
                </div>
                <div>
                  <p className="font-medium">Wi-Fi</p>
                  <p className="text-sm text-green-400">Connected</p>
                </div>
              </div>

              <div className="bg-zinc-800 rounded-2xl p-5 flex items-center gap-4 hover:bg-zinc-700/70 cursor-pointer transition-colors">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
                  🔋
                </div>
                <div>
                  <p className="font-medium">Battery</p>
                  <p className="text-sm text-zinc-400">• Charging</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}