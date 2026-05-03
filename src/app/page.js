'use client';

import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Minimize2, Maximize2, X, Search, Power } from 'lucide-react';
import TextEditor from './components/TextEditor';
import Settings from './components/Settings';
import FileExplorer from './components/FileExplorer';
import Camera from './components/Camera';
import Calculator from './components/Calculator';
import NexTerminal from './components/NexTerminal';
import Browser from './components/Browser';
import { FaFolder, FaGlobe, FaGamepad, FaTerminal, FaCamera, FaCalculator, FaFileAlt, FaCog, } from "react-icons/fa";
import SnakeGame from './components/SnakeGame';

export default function WebOS() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [openWindows, setOpenWindows] = useState([]);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [wallpaper, setWallpaper] = useState("/wallpapers/wallpaper7.jpg");
  const [activeWindow, setActiveWindow] = useState(null);
  const [minimizedWindows, setMinimizedWindows] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  if (!isAuthenticated) {
    return (
      <div
        className={`h-screen w-screen relative flex items-center justify-center text-white overflow-hidden 
  transition-all duration-700 ease-in-out
  ${isTransitioning ? "opacity-0 scale-110 blur-sm" : "opacity-100 scale-100 blur-0"}`}
        style={{ backgroundImage: "url('wallpapers/wallpaper7.jpg')" }}
      >
        <div className="absolute inset-0 backdrop-blur-xl bg-black/40"></div>
        <div className="relative z-10 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl px-8 py-6 w-80 text-center">

          <h1 className="text-2xl font-semibold mb-4">NexOS</h1>
          <p className="text-sm text-zinc-300 mb-5">Enter Password, Default: admin</p>

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 outline-none text-center placeholder-zinc-400 focus:ring-2 focus:ring-white/30"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (e.target.value === "admin") {
                  setIsTransitioning(true);

                  setTimeout(() => {
                    setIsAuthenticated(true);
                    setIsTransitioning(false);
                  }, 600);
                } else {
                  alert("Wrong password");
                }
              }
            }}
          />

        </div>
      </div>
    );
  }

  const openApp = (appType) => {
    const newWindow = {
      id: Date.now(),
      type: appType,
      title:
        appType === 'editor' ? 'Text Editor' :
          appType === 'settings' ? 'Settings' :
            appType === 'camera' ? 'Camera' :
              appType === 'calculator' ? 'Calculator' :
                appType === 'files' ? 'File Explorer' :
                  appType === 'browser' ? 'Browser' :
                    appType === 'terminal' ? 'Terminal' : 'App',
      x: 150 + openWindows.length * 40,
      y: 100 + openWindows.length * 30,
    };

    setOpenWindows([...openWindows, newWindow]);
    setActiveWindow(newWindow.id);
  };

  const closeWindow = (id) => {
    setOpenWindows(openWindows.filter(win => win.id !== id));
    setMinimizedWindows(minimizedWindows.filter(win => win !== id));
  };

  const minimizeWindow = (id) => {
    if (!minimizedWindows.includes(id)) {
      setMinimizedWindows([...minimizedWindows, id]);
    }
    setActiveWindow(null);
  };

  const restoreWindow = (id) => {
    setMinimizedWindows(minimizedWindows.filter(w => w !== id));
    setActiveWindow(id);
  };

  const toggleApp = (type) => {
    const existing = openWindows.find(w => w.type === type);

    if (!existing) {
      openApp(type);
      return;
    }

    if (minimizedWindows.includes(existing.id)) {
      restoreWindow(existing.id);
    } else {
      minimizeWindow(existing.id);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-white flex flex-col relative">

      {/*nav*/}
      <nav className="h-12 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-700 flex items-center px-4 z-50">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-6 h-6 rounded flex items-center justify-center text-s font-bold">

              <img src="./logo.png" alt="" />
            </div>
            <span className="font-semibold text-lg">NexOS</span>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <span className='hover:bg-slate-800 cursor-pointer p-2 rounded-2xl'>{currentTime}</span>
            <span className='hover:bg-slate-800 cursor-pointer p-2 rounded-2xl'>{currentDate}</span>
          </div>
        </div>
      </nav>

      {/*Desktop*/}
      <div
        className="flex-1 relative bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url('${wallpaper}')` }}
      >
        {/*Desktop Icons*/}
        <div className="p-15 rounded-2xl bg-linear-to-br from-white/10 to-white/5 backdrop-blur-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 flex-col gap-4 absolute top-8 left-8 h-[80vh] grid grid-flow-col grid-rows-[repeat(auto-fill,minmax(90px,1fr))] gap-x-10 gap-y-8]">
          <DesktopIcon
            icon={
              <div className="p-4 rounded-2xl bg-linear-to-br from-blue-500/20 to-blue-700/20">
                <FaFolder size={40} className="text-blue-400" />
              </div>
            }
            label="Files"
            onClick={() => openApp('files')}
          />

          <DesktopIcon
            icon={
              <div className="p-4 rounded-2xl bg-linear-to-br from-black-500/20 to-black/20">
                <FaTerminal size={40} className="text-green-400" />
              </div>
            }
            label="Terminal"
            onClick={() => openApp('terminal')}
          />

          <DesktopIcon
            icon={
              <div className="p-4 rounded-2xl bg-linear-to-br from-purple-500/20 to-purple-700/20">
                <FaFileAlt size={40} className="text-purple-400" />
              </div>
            }
            label="Editor"
            onClick={() => openApp('editor')}
          />

          <DesktopIcon
            icon={
              <div className="p-4 rounded-2xl bg-linear-to-br from-gray-500/20 to-gray-700/20">
                <FaCog size={40} className="text-slate-500" />
              </div>
            }
            label="Settings"
            onClick={() => openApp('settings')}
          />

          <DesktopIcon
            icon={
              <div className="p-4 rounded-2xl bg-linear-to-br from-pink-500/20 to-pink-700/20">
                <FaCamera size={40} className="text-white" />
              </div>
            }
            label="Camera"
            onClick={() => openApp('camera')}
          />

          <DesktopIcon
            icon={
              <div className="p-4 rounded-2xl bg-linear-to-br from-yellow-500/20 to-red-700/20">
                <FaCalculator size={40} className="text-red-400" />
              </div>
            }
            label="Calculator"
            onClick={() => openApp('calculator')}
          />

          <DesktopIcon
            icon={
              <div className="p-4 rounded-2xl bg-linear-to-br from-blue-500/20 to-black-700/20">
                <FaGlobe size={40} className="text-blue-400" />
              </div>
            }
            label="Browser"
            onClick={() => openApp('browser')}
          />

          <DesktopIcon
            icon={
              <div className="p-4 rounded-2xl bg-linear-to-br from-green-500/20 to-green-700/20">
                <FaGamepad size={40} className="text-green-400" />
              </div>
            }
            label="Snake"
            onClick={() => openApp('snake')}
          />
        </div>

        {/* Start menu*/}
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

              <div onClick={() => openApp('files')} className="p-3 rounded-xl hover:bg-white/10 cursor-pointer flex flex-col items-center gap-2 transition-all">
                <div className="p-2 rounded-xl bg-blue-500/20">
                  <FaFolder size={20} className="text-blue-400" />
                </div>
                <span className="text-xs">Files</span>
              </div>

              <div onClick={() => openApp('editor')} className="p-3 rounded-xl hover:bg-white/10 cursor-pointer flex flex-col items-center gap-2 transition-all">
                <div className="p-2 rounded-xl bg-purple-500/20">
                  <FaFileAlt size={20} className="text-purple-400" />
                </div>
                <span className="text-xs">Editor</span>
              </div>

              <div onClick={() => openApp('settings')} className="p-3 rounded-xl hover:bg-white/10 cursor-pointer flex flex-col items-center gap-2 transition-all">
                <div className="p-2 rounded-xl bg-gray-500/20">
                  <FaCog size={20} className="text-slate-500" />
                </div>
                <span className="text-xs">Settings</span>
              </div>

              <div onClick={() => openApp('camera')} className="p-3 rounded-xl hover:bg-white/10 cursor-pointer flex flex-col items-center gap-2 transition-all">
                <div className="p-2 rounded-xl bg-pink-500/20">
                  <FaCamera size={20} className="text-white" />
                </div>
                <span className="text-xs">Camera</span>
              </div>

              <div onClick={() => openApp('calculator')} className="p-3 rounded-xl hover:bg-white/10 cursor-pointer flex flex-col items-center gap-2 transition-all">
                <div className="p-2 rounded-xl bg-yellow-500/20">
                  <FaCalculator size={20} className="text-red-400" />
                </div>
                <span className="text-xs">Calculator</span>
              </div>

              <div onClick={() => openApp('terminal')} className="p-3 rounded-xl hover:bg-white/10 cursor-pointer flex flex-col items-center gap-2 transition-all">
                <div className="p-2 rounded-xl bg-emerald-500/20">
                  <FaTerminal size={20} className="text-green-400" />
                </div>
                <span className="text-xs">Terminal</span>
              </div>

            </div>

            <div className="flex justify-between items-center border-t border-white/10 pt-3">
              <div onClick={() => openApp('settings')} className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-2 py-1 rounded-lg">
                <SettingsIcon size={16} />
                <span className="text-sm">Settings</span>
              </div>

              <div onClick={() => openApp('snake')} className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-2 py-1 rounded-lg">
                <FaGamepad size={16} className="text-green-400" />
                <span className="text-sm">Snake</span>
              </div>

              

              <div className="p-2 hover:bg-red-500 rounded-xl cursor-pointer">
                <Power size={16} />
              </div>
            </div>

          </div>
        )}

        {/*Open Windows*/}
        {openWindows.map((win, index) => {

          if (minimizedWindows.includes(win.id)) return null;

          return (
            <DraggableWindow
              key={win.id}
              win={win}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              zIndex={100 + index}
            >
              {win.type === 'editor' && <TextEditor onClose={() => closeWindow(win.id)} />}
              {win.type === 'settings' && (<Settings onClose={() => closeWindow(win.id)} onWallpaperChange={(wp) => setWallpaper(wp)} />
              )}
              {win.type === 'files' && <FileExplorer onClose={() => closeWindow(win.id)} />}
              {win.type === 'camera' && <Camera onClose={() => closeWindow(win.id)} />}
              {win.type === 'calculator' && <Calculator onClose={() => closeWindow(win.id)} />}
              {win.type === 'terminal' && <NexTerminal onClose={() => closeWindow(win.id)} />}
              {win.type === 'browser' && <Browser onClose={() => closeWindow(win.id)} />}
              {win.type === 'snake' && <SnakeGame onClose={() => closeWindow(win.id)} />}
            </DraggableWindow>
          )
        })}
      </div>

      {/*Taskbar*/}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl px-4 py-3 flex items-center gap-2 shadow-2xl shadow-black/50 z-50">
        <div
          onClick={() => setShowStartMenu(prev => !prev)}
          className="w-9 h-9 bg-white/90 text-black rounded-2xl flex items-center justify-center font-bold text-2xl mr-2 cursor-pointer hover:w-12 hover:h-12 hover:text-3xl transition-all"
        >
          <img src="./logo.png" alt="" />
        </div>
        <div className="w-px h-9 bg-white/20 mx-2" />
        <div className="flex items-center gap-2">
          <TaskbarApp
            icon={<FaFolder size={22} className="text-blue-400" />}
            onClick={() => openApp('files')}
          />

          <TaskbarApp
            icon={<FaTerminal size={22} className="text-green-400" />}
            onClick={() => openApp('terminal')}
          />

          <TaskbarApp
            icon={<FaFileAlt size={22} className="text-purple-400" />}
            onClick={() => openApp('editor')}
          />

          <TaskbarApp
            icon={<FaCog size={22} className="text-slate-500" />}
            onClick={() => openApp('settings')}
          />

          <TaskbarApp
            icon={<FaCamera size={22} className="text-white-400" />}
            onClick={() => openApp('camera')}
          />

          <TaskbarApp
            icon={<FaCalculator size={22} className="text-red-400" />}
            onClick={() => openApp('calculator')}
          />

          <TaskbarApp
            icon={<FaGlobe size={22} className="text-blue-400" />}
            onClick={() => openApp('browser')}
          />

          <TaskbarApp
            icon={<FaGamepad size={22} className="text-green-400" />}
            onClick={() => openApp('snake')}
          />
        </div>
      </div>
    </div>
  );
}

function DraggableWindow({ win, onClose, onMinimize, zIndex, children }) {
  const [position, setPosition] = React.useState({ x: win.x, y: win.y });
  const [isDragging, setIsDragging] = React.useState(false);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return;

    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isFullscreen) return;

    setPosition({
      x: Math.max(0, e.clientX - offset.x),
      y: Math.max(0, e.clientY - offset.y),
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

  const toggleFullscreen = () => {
    const elem = document.getElementById(`window-${win.id}`);

    if (!document.fullscreenElement) {
      elem?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      id={`window-${win.id}`}
      className="absolute bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      style={{
        left: isFullscreen ? 0 : position.x,
        top: isFullscreen ? 0 : position.y,
        width: isFullscreen ? "100vw" : 720,
        height: isFullscreen ? "100vh" : 560,
        zIndex: zIndex,
      }}
    >

      {/*TitleBar*/}
      <div
        className="h-10 bg-zinc-800/90 flex items-center px-4 border-b border-zinc-700"
        onMouseDown={handleMouseDown}
      >
        <div className="flex-1 text-sm text-zinc-300 truncate">
          {win.title}
        </div>

        <div className="flex items-center gap-1">

          {/*fullscreen*/}
          <button
            onClick={toggleFullscreen}
            className="p-1 hover:bg-zinc-700 rounded-lg transition"
          >
            <Maximize2 size={16} />
          </button>

          {/*minimize*/}
          <button
            onClick={() => onMinimize?.(win.id)}
            className="p-1 hover:bg-zinc-700 rounded-lg transition"
          >
            <Minimize2 size={16} />
          </button>

          {/*close*/}
          <button
            onClick={() => onClose?.(win.id)}
            className="p-1 hover:bg-red-500 rounded-lg transition"
          >
            <X size={16} />
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

function TaskbarApp({ icon, onClick, isActive }) {
  return (
    <div
      onClick={onClick}
      className={`p-2 cursor-pointer transition-all relative hover:bg-white/10 rounded-xl active:scale-95 hover:p-3 hover:translate-y-[-5px]`}>
      {icon}
      {isActive && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-blue-500 rounded-full"></div>
      )}
    </div>
  );
}

const toggleFullscreen = () => {
  const elem = document.getElementById(`window-${win.id}`);

  if (!document.fullscreenElement) {
    elem?.requestFullscreen();
    setIsFullscreen(true);
  } else {
    document.exitFullscreen();
    setIsFullscreen(false);
  }
};