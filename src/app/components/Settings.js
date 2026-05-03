'use client';
import React, { useState } from 'react';

export default function Settings({ onClose, onWallpaperChange }) {

  const wallpapers = [
    "/wallpapers/wallpaper1.jpg",
    "/wallpapers/wallpaper2.jpg",
    "/wallpapers/wallpaper3.jpg",
    "/wallpapers/wallpaper4.jpg",
    "/wallpapers/wallpaper5.jpg",
    "/wallpapers/wallpaper6.jpg",
    "/wallpapers/wallpaper7.jpg",
  ];

  const [selected, setSelected] = useState(wallpapers[6]);

  const applyWallpaper = () => {
    if (typeof onWallpaperChange === "function") {
      onWallpaperChange(selected);
    }
  };

  return (
    <div className="w-full h-full bg-zinc-900 border border-zinc-700 p-6 overflow-auto shadow-2xl flex flex-col text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Wallpaper Settings</h1>

        <button
          onClick={onClose}
          className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-400"
        >
          Close
        </button>
      </div>

      {/* WALLPAPERS */}
      <div className="grid grid-cols-2 gap-4">

        {wallpapers.map((wp, index) => (
          <div
            key={index}
            onClick={() => setSelected(wp)}
            className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
              selected === wp ? "border-blue-500 scale-105" : "border-zinc-700"
            }`}
          >
            <img
              src={wp}
              className="w-full h-32 object-cover"
            />
            <p className="text-center text-sm py-1">
              Wallpaper {index + 1}
            </p>
          </div>
        ))}

      </div>

      {/* APPLY BUTTON */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={applyWallpaper}
          className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500 transition"
        >
          Set Wallpaper
        </button>
      </div>

    </div>
  );
}