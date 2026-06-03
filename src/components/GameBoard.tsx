/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { LetterState } from '../types';

interface GameBoardProps {
  boardState: string[];
  evaluations: (LetterState[] | null)[];
  currentRowIndex: number;
  currentGuess: string;
  isShaking: boolean;
}

export default function GameBoard({
  boardState,
  evaluations,
  currentRowIndex,
  currentGuess,
  isShaking,
}: GameBoardProps) {
  return (
    <div
      className="flex flex-col items-center justify-center flex-grow w-full max-w-sm px-4 gap-1.5 py-3 md:py-6 select-none"
      id="game-board-container"
    >
      {Array.from({ length: 5 }).map((_, rowIndex) => {
        const isCurrent = rowIndex === currentRowIndex;
        const guess = isCurrent ? currentGuess : boardState[rowIndex] || '';
        const evaluation = evaluations[rowIndex];
        
        return (
          <BoardRow
            key={rowIndex}
            guess={guess}
            evaluation={evaluation}
            isCurrent={isCurrent}
            isShaking={isCurrent && isShaking}
          />
        );
      })}
    </div>
  );
}

interface BoardRowProps {
  key?: any;
  guess: string;
  evaluation: LetterState[] | null;
  isCurrent: boolean;
  isShaking: boolean;
}

function BoardRow({ guess, evaluation, isCurrent, isShaking }: BoardRowProps) {
  // Always render exactly 5 cells
  const cells = Array.from({ length: 5 }).map((_, cellIndex) => {
    const char = guess[cellIndex] || '';
    const state: LetterState = evaluation ? evaluation[cellIndex] : char ? 'tbd' : 'empty';
    
    return { char, state };
  });

  return (
    <motion.div
      animate={isShaking ? { x: [-8, 8, -6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="grid grid-cols-5 gap-1.5 w-full aspect-[5/1]"
    >
      {cells.map((cell, cellIndex) => (
        <BoardCell
          key={cellIndex}
          char={cell.char}
          state={cell.state}
          index={cellIndex}
          isCurrentRow={isCurrent}
        />
      ))}
    </motion.div>
  );
}

interface BoardCellProps {
  key?: any;
  char: string;
  state: LetterState;
  index: number;
  isCurrentRow: boolean;
}

function BoardCell({ char, state, index, isCurrentRow }: BoardCellProps) {
  // Flip animation for submitted letters (staggered by cell index)
  const isSubmitted = state === 'correct' || state === 'present' || state === 'absent';
  
  // Decide classes depending on letter feedback state
  let bgClass = 'bg-transparent border-slate-700';
  let textClass = 'text-white';
  
  if (state === 'tbd') {
    bgClass = 'bg-transparent border-slate-500 scale-102';
  } else if (state === 'correct') {
    bgClass = 'bg-emerald-600 border-emerald-500 text-shadow';
  } else if (state === 'present') {
    bgClass = 'bg-amber-500 border-amber-400 text-slate-950 font-extrabold';
    textClass = 'text-slate-950';
  } else if (state === 'absent') {
    bgClass = 'bg-slate-800 border-slate-800 opacity-80';
    textClass = 'text-slate-400';
  }

  // Animation variants
  const cellVariants = {
    // Normal entry for typed characters (pop effect)
    pop: {
      scale: [1, 1.12, 1],
      transition: { duration: 0.12, ease: 'easeOut' },
    },
    // Reveal letters with a flipping card animation
    flip: (i: number) => ({
      rotateX: [0, 90, 0],
      transition: {
        duration: 0.5,
        delay: i * 0.15,
        ease: 'easeInOut',
      },
    }),
  };

  return (
    <motion.div
      custom={index}
      variants={cellVariants}
      animate={isSubmitted ? 'flip' : char ? 'pop' : 'initial'}
      className={`
        w-full h-full flex items-center justify-center 
        rounded-xl border-2 font-bold text-lg md:text-2xl uppercase font-mono
        transition-colors duration-300
        ${bgClass} ${textClass}
      `}
      id={`cell-${index}`}
    >
      {char}
    </motion.div>
  );
}
