'use client';

import React, { useState, useEffect } from 'react';
import { Monitor, FolderOpen, Terminal as TerminalIcon, CameraIcon, Settings as SettingsIcon, CalculatorIcon, Minimize2, X, Search, Power } from 'lucide-react';
import TextEditor from './components/TextEditor';
import Settings from './components/Settings';
import FileExplorer from './components/FileExplorer';
import Camera from './components/Camera';
import Calculator from './components/Calculator';

export default function WebOS() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [openWindows, setOpenWindows] = useState([]);
  const [showStartMenu, setShowStartMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }));
      setCurrentDate(now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        weekday: 'short'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const openApp = (appType) => {
    const newWindow = {
      id: Date.now(),
      type: appType,
      title: appType === 'editor' ? 'Untitled - Text Editor' :
        appType === 'settings' ? 'Settings' :
          appType === 'camera' ? 'Camera' :
          appType === 'calculator' ? 'Calculator' :
            appType === 'files' ? 'File Explorer' : 'App',
      x: 150 + openWindows.length * 40,
      y: 100 + openWindows.length * 30,
    };
      setOpenWindows([...openWindows, newWindow]);
    setShowStartMenu(false);
  };

  const closeWindow = (id) => {
    setOpenWindows(openWindows.filter(win => win.id !== id));
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-white flex flex-col relative">

      {/*NAVBAR*/}
      <nav className="h-12 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-700 flex items-center px-4 z-50">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-s font-bold">@</div>
            <span className="font-semibold text-lg">NexOS</span>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <span className='hover:bg-slate-800 cursor-pointer p-2 rounded-2xl'>📶</span>
            <span className='hover:bg-slate-800 cursor-pointer p-2 rounded-2xl'>🔋</span>
            <span className='hover:bg-slate-800 cursor-pointer p-2 rounded-2xl'>{currentTime}</span>
            <span className='hover:bg-slate-800 cursor-pointer p-2 rounded-2xl'>{currentDate}</span>
          </div>
        </div>
      </nav>

      {/*DESKTOP*/}
      <div
        className="flex-1 relative bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/wallpaper2.jpg')" }}
      >
        {/*Desktop Icons*/}
        <div className="absolute top-8 left-8 h-[80vh] grid grid-flow-col grid-rows-[repeat(auto-fill,minmax(90px,1fr))] gap-x-8 gap-y-4">
          <DesktopIcon icon={<FolderOpen size={48} />} label="Files" onClick={() => openApp('files')} />
          <DesktopIcon icon={<TerminalIcon size={48} />} label="Terminal" onClick={() => alert("Coming Soon")} />
          <DesktopIcon icon={<Monitor size={48} />} label="Editor" onClick={() => openApp('editor')} />
          <DesktopIcon icon={<SettingsIcon size={48} />} label="Settings" onClick={() => openApp('settings')} />
          <DesktopIcon icon={<CameraIcon size={48} />} label="Camera" onClick={() => openApp('camera')} />
          <DesktopIcon icon={<CalculatorIcon size={48} />} label="Calculator" onClick={() => openApp('calculator')} />
        </div>

        {/* START MENU*/}
        {showStartMenu && (
          <div id="start-menu" className="absolute bottom-24 left-1/2 -translate-x-1/2 w-150 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-4 z-50">
            
            <div className="flex items-center bg-zinc-800 px-3 py-2 rounded-xl mb-4">
              <Search size={16} className="mr-2 text-zinc-400" />
              <input
                placeholder="Search apps..."
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div onClick={() => openApp('files')} className="p-3 rounded-xl hover:bg-white/10 cursor-pointer flex flex-col items-center gap-2">
                <FolderOpen size={20} />
                <span className="text-xs">Files</span>
              </div>
              <div onClick={() => openApp('editor')} className="p-3 rounded-xl hover:bg-white/10 cursor-pointer flex flex-col items-center gap-2">
                <Monitor size={20} />
                <span className="text-xs">Editor</span>
              </div>
              <div onClick={() => openApp('settings')} className="p-3 rounded-xl hover:bg-white/10 cursor-pointer flex flex-col items-center gap-2">
                <SettingsIcon size={20} />
                <span className="text-xs">Settings</span>
              </div>
              <div onClick={() => openApp('camera')} className="p-3 rounded-xl hover:bg-white/10 cursor-pointer flex flex-col items-center gap-2">
                <CameraIcon size={20} />
                <span className="text-xs">Camera</span>
              </div>
              <div onClick={() => openApp('calculator')} className="p-3 rounded-xl hover:bg-white/10 cursor-pointer flex flex-col items-center gap-2">
                <CalculatorIcon size={20} />
                <span className="text-xs">Calculator</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-white/10 pt-3">
              <div onClick={() => openApp('settings')} className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-2 py-1 rounded-lg">
                <SettingsIcon size={16} />
                <span className="text-sm">Settings</span>
              </div>

              <div className="p-2 hover:bg-red-500 rounded-xl cursor-pointer">
                <Power size={16} />
              </div>
            </div>

          </div>
        )}

        {/* Open Windows */}
        {openWindows.map((win, index) => (
          <DraggableWindow
            key={win.id}
            win={win}
            onClose={closeWindow}
            zIndex={100 + index}
          >
            {win.type === 'editor' && <TextEditor onClose={() => closeWindow(win.id)} />}
            {win.type === 'settings' && <Settings onClose={() => closeWindow(win.id)} />}
            {win.type === 'files' && <FileExplorer onClose={() => closeWindow(win.id)} />}
            {win.type === 'camera' && <Camera onClose={() => closeWindow(win.id)} />}
            {win.type === 'calculator' && <Calculator onClose={() => closeWindow(win.id)} />}
          </DraggableWindow>
        ))}
      </div>

      {/* FLOATING TASKBAR */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl px-4 py-3 flex items-center gap-2 shadow-2xl shadow-black/50 z-50">
        <div 
          onClick={() => setShowStartMenu(prev => !prev)}
          className="w-9 h-9 bg-white/90 text-black rounded-2xl flex items-center justify-center font-bold text-2xl mr-2 cursor-pointer hover:w-12 hover:h-12 hover:text-3xl transition-all"
        >
          @
        </div>
        <div className="w-px h-9 bg-white/20 mx-2" />
        <div className="flex items-center gap-2">
          <TaskbarApp icon={<FolderOpen size={24} />} label="Files" onClick={() => openApp('files')} />
          <TaskbarApp icon={<TerminalIcon size={24} />} label="Terminal" />
          <TaskbarApp icon={<Monitor size={24} />} label="Editor" onClick={() => openApp('editor')} />
          <TaskbarApp icon={<SettingsIcon size={24} />} label="Settings" onClick={() => openApp('settings')} />
          <TaskbarApp icon={<CameraIcon size={24} />} label="Camera" onClick={() => openApp('camera')} />
          <TaskbarApp icon={<CalculatorIcon size={24} />} label="Calculator" onClick={() => openApp('calculator')} />
        </div>
      </div>
    </div>
  );
}

/*DRAGGABLE WINDOW*/
function DraggableWindow({ win, onClose, zIndex, children }) {
  const [position, setPosition] = useState({ x: win.x, y: win.y });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return;
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: Math.max(0, e.clientX - offset.x),
      y: Math.max(0, e.clientY - offset.y),
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="absolute bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      style={{
        left: position.x,
        top: position.y,
        width: 720,
        height: 560,
        zIndex: zIndex,
      }}
    >
      <div
        className="h-10 bg-zinc-800/90 flex items-center px-4 cursor-default border-b border-zinc-700"
        onMouseDown={handleMouseDown}
      >
        <div className="flex-1 text-sm font-medium text-zinc-300 truncate">
          {win.title}
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-zinc-700 rounded-lg transition-colors">
            <Minimize2 size={15} />
          </button>
          <button
            onClick={() => onClose(win.id)}
            className="p-1 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/*Helper Components*/
function DesktopIcon({ icon, label, onClick }) {
  return (
    <div onClick={onClick} className="flex flex-col items-center gap-1.5 w-20 cursor-pointer group">
      <div className="p-3 group-hover:p-5 group-hover:translate-x-5 rounded-2xl transition-all duration-200 group-hover:bg-slate-800/20 group-active:scale-95">
        {icon}
      </div>
      <span className="text-xs text-center text-white drop-shadow-md bg-black/30 px-2 py-0.5 rounded-md">
        {label}
      </span>
    </div>
  );
}

function TaskbarApp({ icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-2 hover:bg-white/10 rounded-xl cursor-pointer transition-all active:scale-95 hover:p-3 hover:translate-y-[-5px]"
    >
      {icon}
    </div>
  );
}