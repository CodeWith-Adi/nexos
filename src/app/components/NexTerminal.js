'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function NexTerminal({ fileSystem, setFileSystem }) {
  const [outputs, setOutputs] = useState([]);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const currentPath = useRef(["Desktop"]);
  const currentColor = useRef("#22c55e"); // green

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  /*HELPERS*/

  const getCurrentDir = () => {
    let dir = fileSystem;
    for (let folder of currentPath.current) {
      dir = dir[folder]?.children || dir[folder];
    }
    return dir;
  };

  const addCommand = (cmd) => {
    setOutputs(prev => [
      ...prev,
      { text: `${currentPath.current.join("\\")}> ${cmd}`, type: 'command' }
    ]);
  };

  const addOutput = (text, type = 'output') => {
    setOutputs(prev => [...prev, { text, type }]);

    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }, 0);
  };

  /*COMMANDS*/

  const commands = {

    dir: () => {
      const dir = getCurrentDir();
      const entries = Object.entries(dir || {});

      addOutput(`Directory of ${currentPath.current.join("\\")}\n`, "info");

      if (entries.length === 0) {
        addOutput("(Empty)", "info");
        return;
      }

      entries.forEach(([name, file]) => {
        if (file.type === "folder") {
          addOutput(`${name.padEnd(20)} <DIR>`);
        } else {
          addOutput(name);
        }
      });
    },

    ls() { this.dir(); },

    cd: (folder) => {
      if (!folder) return;

      if (folder === "..") {
        if (currentPath.current.length > 1) {
          currentPath.current.pop();
        }
        return;
      }

      const dir = getCurrentDir();

      if (dir[folder] && dir[folder].type === "folder") {
        currentPath.current.push(folder);
      } else {
        addOutput("Folder not found", "error");
      }
    },

    mkdir: (name) => {
      if (!name) return;

      setFileSystem(prev => {
        const updated = { ...prev };
        let dir = updated;

        for (let folder of currentPath.current) {
          dir = dir[folder].children;
        }

        if (!dir[name]) {
          dir[name] = {
            type: "folder",
            children: {}
          };
        }

        return updated;
      });
    },

    touch: (name) => {
      if (!name) return;

      setFileSystem(prev => {
        const updated = { ...prev };
        let dir = updated;

        for (let folder of currentPath.current) {
          dir = dir[folder].children;
        }

        dir[name] = {
          type: "text",
          content: "",
          createdAt: Date.now()
        };

        return updated;
      });
    },

    cat: (name) => {
      const dir = getCurrentDir();

      if (dir[name] && dir[name].type === "text") {
        addOutput(dir[name].content || "(empty)");
      } else {
        addOutput("File not found", "error");
      }
    },

    rm: (name) => {
      setFileSystem(prev => {
        const updated = { ...prev };
        let dir = updated;

        for (let folder of currentPath.current) {
          dir = dir[folder].children;
        }

        delete dir[name];
        return updated;
      });
    },

    clear: () => setOutputs([]),
    clr() { this.clear(); },

    help: () => {
      addOutput(`
Commands:
dir        - list files
cd <name>  - change directory
mkdir <n>  - create folder
touch <n>  - create file
cat <file> - read file
rm <file>  - delete file
clear      - clear screen
`, "info");
    }
  };

  /*INPUT*/

  const processCommand = (input) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    addCommand(trimmed);

    const [cmd, ...args] = trimmed.split(" ");
    const argStr = args.join(" ");

    if (commands[cmd]) {
      commands[cmd](argStr);
    } else {
      addOutput(`Command not found: ${cmd}`, "error");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const value = inputRef.current.value;
      processCommand(value);
      inputRef.current.value = '';
    }
  };

  /*UI*/

  return (
    <div className="w-full h-full bg-black text-green-400 font-mono text-sm flex flex-col">

      {/* Output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-3 space-y-1"
      >
        {outputs.map((o, i) => (
          <div key={i} className={
            o.type === 'error' ? 'text-red-400' :
            o.type === 'info' ? 'text-blue-400' :
            o.type === 'command' ? 'text-green-500' :
            'text-green-300'
          }>
            {o.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center px-3 py-2 border-t border-zinc-700">
        <span className="mr-2 text-green-500">
          {currentPath.current.join("\\")} &gt;
        </span>
        <input
          ref={inputRef}
          onKeyDown={handleKeyDown}
          className="bg-transparent outline-none flex-1 text-green-300 caret-green-400"
          autoFocus
        />
      </div>
    </div>
  );
}