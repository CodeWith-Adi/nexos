'use client';

import React, {useEffect, useState} from 'react';
import {FaFolder, FaFileAlt, FaImage, FaMusic} from "react-icons/fa";

const FOLDERS = ["music", "images", "documents", "downloads"];

export default function FileExplorer() {
  const [currentFolder, setCurrentFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // Load files from db
  const loadFiles = async (folder) => {
    setLoading(true);
    setCurrentFolder(folder);
    try {
      const res = await fetch(`/api/files?folder=${folder}`);
      const data = await res.json();
      if (data.success) {
        setFiles(data.files);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getFileIcon = (file) => {
    if (file.type === "image") return <FaImage className="text-pink-400" />;
    if (file.type === "audio") return <FaMusic className="text-green-400" />;
    return <FaFileAlt className="text-purple-400" />;
  };

  return (
    <div className="w-full h-full flex bg-zinc-900 text-white">

      {/*Left*/}
      <div className="w-56 bg-zinc-800 p-4 border-r border-zinc-700">
        <h2 className="text-lg font-semibold mb-4">Folders</h2>

        <div className="space-y-2">
          {FOLDERS.map(folder => (
            <div
              key={folder}
              onClick={() => loadFiles(folder)}
              className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all
              ${currentFolder === folder ? 'bg-blue-500/20' : 'hover:bg-zinc-700'}`}
            >
              <FaFolder className="text-yellow-400" />
              <span className="capitalize">{folder}</span>
            </div>
          ))}
        </div>
      </div>

      {/*Right*/}
      <div className="flex-1 p-4 overflow-auto">
        {!currentFolder && (
          <div className="text-zinc-400 text-center mt-20">
            Select a folder to view files
          </div>
        )}

        {loading && (
          <div className="text-center mt-20">Loading...</div>
        )}
        {currentFolder && !loading && (
          <>
            <h2 className="text-xl font-semibold mb-4 capitalize">
              {currentFolder}
            </h2>

            {files.length === 0 ? (
              <p className="text-zinc-400">No files found</p>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {files.map(file => (
                  <div
                    key={file._id}
                    onClick={() => setPreviewFile(file)}
                    className="bg-zinc-800 p-4 rounded-2xl hover:bg-zinc-700 cursor-pointer transition-all"
                  >
                    <div className="text-3xl mb-2">
                      {getFileIcon(file)}
                    </div>
                    <p className="text-sm truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {previewFile && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-2xl w-125 max-h-[80vh] overflow-auto relative">
            <button
              onClick={() => setPreviewFile(null)}
              className="absolute top-3 right-3 bg-red-500 px-2 py-1 rounded"
            >
              Close
            </button>
            <h2 className="text-lg mb-4">{previewFile.name}</h2>

            {previewFile.type === "text" && (
              <pre className="whitespace-pre-wrap text-sm bg-zinc-800 p-3 rounded">
                {previewFile.content}
              </pre>
            )}

            {previewFile.type === "image" && (
              <img
                src={previewFile.content}
                alt="preview"
                className="w-full rounded-lg"
              />
            )}

            {!["text", "image"].includes(previewFile.type) && (
              <p className="text-zinc-400">Preview not supported</p>
            )}

          </div>
        </div>
      )}
    </div>
  );
}