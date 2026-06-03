/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import GameBoard from './components/GameBoard';
import Keyboard from './components/Keyboard';
import HelpModal from './components/HelpModal';
import StatsModal from './components/StatsModal';
import { getDailyWord, isValidWord } from './words';
import { LetterState, GameStats, GameState } from './types';

const STATS_KEY = 'woordle-stats';
const GAME_STATE_KEY = 'woordle-gamestate';
const VISITED_KEY = 'woordle-visited';

const DEFAULT_STATS: GameStats = {
  played: 0,
  won: 0,
  guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  currentStreak: 0,
  maxStreak: 0,
};

export default function App() {
  const [dailyWord, setDailyWord] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');
  
  // Modals Visibility
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  
  // Game Play State
  const [boardState, setBoardState] = useState<string[]>(Array(5).fill(''));
  const [evaluations, setEvaluations] = useState<(LetterState[] | null)[]>(Array(5).fill(null));
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState<'IN_PROGRESS' | 'WON' | 'LOST'>('IN_PROGRESS');
  const [isShaking, setIsShaking] = useState(false);
  
  // Toast notifications
  const [toast, setToast] = useState<string | null>(null);
  
  // Game Stats
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);

  // Helper inside App component to evaluate guesses nicely
  const evaluateGuess = useCallback((guessWord: string, targetWord: string): LetterState[] => {
    const result: LetterState[] = Array(5).fill('absent');
    const targetChars = targetWord.split('');
    const guessChars = guessWord.split('');
    
    // Frequency map of the target word characters
    const targetFreq: { [key: string]: number } = {};
    for (const char of targetChars) {
      targetFreq[char] = (targetFreq[char] || 0) + 1;
    }
    
    // Pass 1: Identities matching exactly (correct letters, Green)
    for (let i = 0; i < 5; i++) {
      if (guessChars[i] === targetChars[i]) {
        result[i] = 'correct';
        targetFreq[guessChars[i]]--;
      }
    }
    
    // Pass 2: Present but mispositioned matching (Yellow)
    for (let i = 0; i < 5; i++) {
      if (result[i] !== 'correct') {
        const char = guessChars[i];
        if (targetFreq[char] > 0) {
          result[i] = 'present';
          targetFreq[char]--;
        }
      }
    }
    
    return result;
  }, []);

  // Display a brief hover message popup
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    const timer = setTimeout(() => {
      setToast(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Load word of the day and restore previous states
  useEffect(() => {
    // 1. Calculate matching daily objective word
    const { word, dateStr } = getDailyWord();
    setDailyWord(word);
    setCurrentDateStr(dateStr);

    // 2. Load historical stats
    const rawStats = localStorage.getItem(STATS_KEY);
    let loadedStats = DEFAULT_STATS;
    if (rawStats) {
      try {
        loadedStats = JSON.parse(rawStats);
        setStats(loadedStats);
      } catch (e) {
        console.error('Error parsing stats:', e);
      }
    }

    // 3. Setup help menu visited check
    const hasVisited = localStorage.getItem(VISITED_KEY);
    if (!hasVisited) {
      setIsHelpOpen(true);
      localStorage.setItem(VISITED_KEY, 'true');
    }

    // 4. Restore ongoing daily board state
    const rawGameState = localStorage.getItem(GAME_STATE_KEY);
    if (rawGameState) {
      try {
        const loadedState: GameState = JSON.parse(rawGameState);
        if (loadedState.lastPlayedDate === dateStr) {
          setBoardState(loadedState.boardState);
          setEvaluations(loadedState.evaluations);
          setGameStatus(loadedState.gameStatus);

          // Find row index to resume typing on
          const filledRowsCount = loadedState.boardState.filter(s => s !== '').length;
          setCurrentRowIndex(filledRowsCount);
          
          // Auto-trigger stats modal if they finished already today!
          if (loadedState.gameStatus !== 'IN_PROGRESS') {
            setTimeout(() => {
              setIsStatsOpen(true);
            }, 800);
          }
          return;
        }
      } catch (e) {
        console.error('Error restoring state:', e);
      }
    }

    // Fallback: Clear daily game if standard is absent or dates don't match
    setBoardState(Array(5).fill(''));
    setEvaluations(Array(5).fill(null));
    setCurrentRowIndex(0);
    setGameStatus('IN_PROGRESS');
  }, []);

  // Process keyboard input (either physical or virtual)
  const handleInput = useCallback((key: string) => {
    if (gameStatus !== 'IN_PROGRESS' || isHelpOpen || isStatsOpen) return;

    if (key === 'BACKSPACE' || key === 'BACK') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (key === 'ENTER') {
      const formattedGuess = currentGuess.trim().toUpperCase();

      // Validation check
      if (formattedGuess.length < 5) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        showToast('Te weinig letters ⚠️');
        return;
      }

      if (!isValidWord(formattedGuess)) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        showToast('Niet in woordenlijst ❌');
        return;
      }

      // Valid Guess -> Proceed with grading
      const feedback = evaluateGuess(formattedGuess, dailyWord);
      
      const newBoardState = [...boardState];
      newBoardState[currentRowIndex] = formattedGuess;
      
      const newEvaluations = [...evaluations];
      newEvaluations[currentRowIndex] = feedback;

      // Check win/lose conditions
      let updatedStatus: 'IN_PROGRESS' | 'WON' | 'LOST' = 'IN_PROGRESS';
      let isWin = formattedGuess === dailyWord;
      let isLoss = !isWin && currentRowIndex === 4;

      if (isWin) {
        updatedStatus = 'WON';
        showToast('Geweldig! 🎉');
      } else if (isLoss) {
        updatedStatus = 'LOST';
        showToast(`Helaas! Het woord was ${dailyWord}`);
      }

      // Set new structures
      setBoardState(newBoardState);
      setEvaluations(newEvaluations);
      setGameStatus(updatedStatus);
      setCurrentRowIndex((prev) => prev + 1);
      setCurrentGuess('');

      // Auto update storage & statistics cleanly
      if (isWin || isLoss) {
        const newStats = { ...stats };
        newStats.played += 1;

        if (isWin) {
          newStats.won += 1;
          newStats.currentStreak += 1;
          if (newStats.currentStreak > newStats.maxStreak) {
            newStats.maxStreak = newStats.currentStreak;
          }
          // Record guess score distribution (1 to 6)
          const attempt = currentRowIndex + 1;
          newStats.guesses[attempt] = (newStats.guesses[attempt] || 0) + 1;
        } else {
          newStats.currentStreak = 0; // reset streak on loss
        }

        // Save structures
        setStats(newStats);
        localStorage.setItem(STATS_KEY, JSON.stringify(newStats));

        // Let standard animations complete, then open scoreboard metrics modal!
        setTimeout(() => {
          setIsStatsOpen(true);
        }, 1200);
      }

      // Sync active board state of the day
      const dailyGameState: GameState = {
        boardState: newBoardState,
        evaluations: newEvaluations,
        gameStatus: updatedStatus,
        lastPlayedDate: currentDateStr,
      };
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(dailyGameState));

    } else if (/^[A-Z]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key);
      }
    }
  }, [
    currentGuess,
    currentRowIndex,
    boardState,
    evaluations,
    gameStatus,
    dailyWord,
    currentDateStr,
    stats,
    isHelpOpen,
    isStatsOpen,
    evaluateGuess,
    showToast,
  ]);

  // Read keystrokes on desktop
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      
      const rawKey = event.key.toUpperCase();
      if (rawKey === 'BACKSPACE' || rawKey === 'DELETE') {
        handleInput('BACKSPACE');
      } else if (rawKey === 'ENTER') {
        handleInput('ENTER');
      } else if (/^[A-Z]$/.test(rawKey)) {
        handleInput(rawKey);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput]);

  // Compute on-screen keyboard coloring based on active guesses
  const getLetterStatuses = () => {
    const statuses: { [key: string]: LetterState } = {};
    for (let r = 0; r < 5; r++) {
      const rowEval = evaluations[r];
      const rowGuess = boardState[r];
      if (rowEval && rowGuess) {
        for (let c = 0; c < 5; c++) {
          const char = rowGuess[c];
          const state = rowEval[c];
          const current = statuses[char];

          if (state === 'correct') {
            statuses[char] = 'correct';
          } else if (state === 'present') {
            if (current !== 'correct') {
              statuses[char] = 'present';
            }
          } else if (state === 'absent') {
            if (current !== 'correct' && current !== 'present') {
              statuses[char] = 'absent';
            }
          }
        }
      }
    }
    return statuses;
  };

  const letterStatuses = getLetterStatuses();

  return (
    <div
      className="flex flex-col min-h-screen text-slate-100 bg-[#0d0f14] md:bg-[#0a0c10]"
      id="main-app-viewport"
    >
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col justify-between relative bg-[#0a0c10] border-x border-slate-900 shadow-2xl">
        
        {/* Navigation Bar */}
        <Navbar
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
          isDaily={true}
        />

        {/* Dynamic Game Board area */}
        <main className="flex-1 flex flex-col justify-center items-center">
          <GameBoard
            boardState={boardState}
            evaluations={evaluations}
            currentRowIndex={currentRowIndex}
            currentGuess={currentGuess}
            isShaking={isShaking}
          />
        </main>

        {/* Dynamic virtual Keyboard for touch-responsiveness (iPhone friendly) */}
        <Keyboard
          onKeyPress={handleInput}
          letterStatuses={letterStatuses}
        />

        {/* Toast Notifier Popup Alert */}
        <AnimatePresence>
          {toast && (
            <div className="absolute top-20 left-0 right-0 flex justify-center z-50 pointer-events-none px-4">
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm shadow-xl flex items-center gap-1.5 border border-emerald-400"
                id="floating-toast-alert"
              >
                {toast}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal overlays */}
        <HelpModal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
        />

        <StatsModal
          isOpen={isStatsOpen}
          onClose={() => setIsStatsOpen(false)}
          stats={stats}
          gameStatus={gameStatus}
          guessesCount={currentRowIndex}
          evaluations={evaluations as any}
          solution={dailyWord}
          isDaily={true}
        />
      </div>
    </div>
  );
}
