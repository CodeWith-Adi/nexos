'use client';

import React, {useState} from 'react';

export default function Calculator() {
  const [input, setInput] = useState('');

  const handleClick = (value) => {
    setInput(prev => prev + value);
  };

  const clear = () => setInput('');

  const calculate = () => {
    try {
      setInput(eval(input).toString());
    } catch {
      setInput('Error');
    }
  };

  return (
    <div className="w-full h-full bg-zinc-900 flex flex-col p-4">
      <div className="bg-black text-white text-right text-3xl p-4 rounded-xl mb-4 overflow-x-auto">
        {input || '0'}
      </div>
      <div className="grid grid-cols-4 gap-3 flex-1">
        {[
          '7','8','9','/',
          '4','5','6','*',
          '1','2','3','-',
          '0','.','=','+'
        ].map((btn, i) => (
          <button
            key={i}
            onClick={() => btn === '=' ? calculate() : handleClick(btn)}
            className="bg-zinc-800 hover:bg-zinc-700 rounded-xl text-lg font-semibold"
          >
            {btn}
          </button>
        ))}
        <button
          onClick={clear}
          className="col-span-4 bg-red-500 hover:bg-red-600 rounded-xl font-semibold"
        >
          Clear
        </button>
      </div>
    </div>
  );
}