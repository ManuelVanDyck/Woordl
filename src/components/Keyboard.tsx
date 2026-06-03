/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Delete } from 'lucide-react';
import { LetterState } from '../types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStatuses: { [key: string]: LetterState };
}

export default function Keyboard({ onKeyPress, letterStatuses }: KeyboardProps) {
  // Standard Belgian/French AZERTY keyboard rows
  const rows = [
    ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
    ['ENTER', 'W', 'X', 'C', 'V', 'B', 'N', 'BACKSPACE'],
  ];

  const getKeyColor = (key: string) => {
    const status = letterStatuses[key];
    if (status === 'correct') return 'bg-emerald-600 text-white border-emerald-500';
    if (status === 'present') return 'bg-amber-500 text-slate-950 font-extrabold border-amber-400';
    if (status === 'absent') return 'bg-slate-800 text-slate-500 border-slate-900 opacity-60';
    return 'bg-slate-700 hover:bg-slate-600 border-slate-650 active:bg-slate-500 text-slate-100';
  };

  return (
    <div
      className="w-full max-w-md mx-auto px-2 pb-safe select-none mt-auto flex flex-col gap-1.5 md:gap-2 justify-end mb-4"
      id="onscreen-keyboard"
    >
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center w-full gap-1 md:gap-1.5">
          {row.map((key) => {
            const isSpecial = key === 'ENTER' || key === 'BACKSPACE';
            const keyColor = getKeyColor(key);

            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`
                  flex-1 h-12 md:h-14 flex items-center justify-center rounded-lg 
                  text-sm md:text-base font-bold uppercase transition duration-150 border
                  active:scale-95 cursor-pointer tap-highlight-transparent
                  ${isSpecial ? 'px-1 text-[11px] md:text-xs font-semibold bg-slate-650 text-slate-100 border-slate-700 hover:bg-slate-600 active:bg-slate-500' : keyColor}
                  ${key === 'ENTER' ? 'flex-[1.5]' : ''}
                  ${key === 'BACKSPACE' ? 'flex-[1.5]' : ''}
                `}
                id={`key-${key}`}
                aria-label={key === 'BACKSPACE' ? 'Terug' : key}
              >
                {key === 'BACKSPACE' ? (
                  <Delete className="w-5 h-5" />
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
