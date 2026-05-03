'use client';

import React, { useState, useRef, useEffect } from 'react';

const DEFAULT_FOLDERS = ["music", "images", "documents", "downloads"];

export default function Terminal() {
  const [history, setHistory] = useState([]);
  const [currentFolder, setCurrentFolder] = useState("documents");
  const [color, setColor] = useState("#ffffff");

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    setHistory([
      "NexOS Terminal v1.0",
      "Type 'help' to see available commands.",
      "----------------------------------------"
    ]);
  }, []);

  const addLine = (text) => {
    setHistory(prev => [...prev, text]);
    setTimeout(() => {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }, 0);
  };

  const fetchFiles = async (folder) => {
    const res = await fetch(`/api/files?folder=${folder}`);
    const data = await res.json();
    return data.files || [];
  };

  const processCommand = async (cmd) => {
    const parts = cmd.trim().split(" ");
    const command = parts[0].toLowerCase();

    addLine(`@:\\${currentFolder}> ${cmd}`);
    if (command === "ls" || command === "dir") {
      const files = await fetchFiles(currentFolder);

      if (files.length === 0) {
        addLine("No files found");
      } else {
        files.forEach(file => addLine(file.name));
      }
    }

    else if (command === "cd") {
      const folder = parts[1];

      if (!folder) {
        addLine("Usage: cd <folder>");
        return;
      }

      if (DEFAULT_FOLDERS.includes(folder)) {
        setCurrentFolder(folder);
      } else {
        addLine("Folder not found");
      }
    }

    else if (command === "clear" || command === "cls") {
      setHistory([]);
    }

    else if (command === "date") {
      const now = new Date();
      addLine(now.toDateString());
    }

    else if (command === "time") {
      const now = new Date();
      addLine(now.toLocaleTimeString());
    }

    else if (command === "color") {
      const colorInput = parts[1];

      const colorMap = {
        white: "#ffffff",
        green: "#00ff00",
        red: "#ff4d4d",
        blue: "#4da6ff",
        yellow: "#ffff66",
        cyan: "#00ffff",
        magenta: "#ff00ff"
      };

      if (!colorInput) {
        addLine("Usage: color <name>");
        addLine("Available: white, green, red, blue, yellow, cyan, magenta");
        return;
      }

      if (colorMap[colorInput]) {
        setColor(colorMap[colorInput]);
      } else {
        addLine("Invalid color");
      }
    }

    else if (command === "pwd") {
      addLine(`@:\\${currentFolder}`);
    }

    else if (command === "help") {
      addLine("Available commands:");
      addLine("ls / dir        → list files");
      addLine("cd <folder>     → change folder");
      addLine("pwd             → current folder");
      addLine("date            → show date");
      addLine("time            → show time");
      addLine("color <name>    → change text color");
      addLine("clear / cls     → clear screen");
      addLine("help            → show commands");
    }

    else {
      addLine("Command not found");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = inputRef.current.innerText;
      processCommand(value);
      inputRef.current.innerText = "";
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-black font-mono text-sm p-3 overflow-auto"
      style={{ color }}
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((line, i) => (
        <div key={i}>{line}</div>
      ))}

      <div className="flex">
        <span className="mr-2 text-green-400">
          @{`:\\${currentFolder}>`}
        </span>
        <div
          ref={inputRef}
          contentEditable
          onKeyDown={handleKeyDown}
          className="outline-none flex-1"
        />
      </div>
    </div>
  );
}