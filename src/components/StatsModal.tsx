/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2, Award, Calendar, RefreshCcw, Check } from 'lucide-react';
import { GameStats } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  gameStatus: 'IN_PROGRESS' | 'WON' | 'LOST';
  guessesCount: number;
  evaluations: ('empty' | 'tbd' | 'absent' | 'present' | 'correct')[][];
  solution: string;
  isDaily: boolean;
  onResetPractice?: () => void; // only for non-daily, but we are daily-first. Let's support reset if ever needed.
}

export default function StatsModal({
  isOpen,
  onClose,
  stats,
  gameStatus,
  guessesCount,
  evaluations,
  solution,
  isDaily,
  onResetPractice
}: StatsModalProps) {
  const [timeToNext, setTimeToNext] = useState('');
  const [copied, setCopied] = useState(false);

  // Countdown timer to midnight local time
  useEffect(() => {
    if (gameStatus === 'IN_PROGRESS') return;

    function updateCountdown() {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffMs = tomorrow.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeToNext('00:00:00');
        return;
      }

      const hrs = String(Math.floor((diffMs / (1000 * 60 * 60)) % 24)).padStart(2, '0');
      const mins = String(Math.floor((diffMs / (1000 * 60)) % 60)).padStart(2, '0');
      const secs = String(Math.floor((diffMs / 1000) % 60)).padStart(2, '0');

      setTimeToNext(`${hrs}:${mins}:${secs}`);
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [gameStatus]);

  // Generate share text for Wordle.nl clone
  const handleShare = async () => {
    // Determine guess label
    const scoreLabel = gameStatus === 'WON' ? guessesCount : 'X';
    
    // Create emoji grid
    const emojiGrid = evaluations
      .filter((row) => row && row.length > 0 && row.some(state => state !== 'empty'))
      .map((row) => {
        return row
          .map((state) => {
            if (state === 'correct') return '🟩';
            if (state === 'present') return '🟨';
            return '⬛';
          })
          .join('');
      })
      .join('\n');

    const shareText = `Woordle NL (Daily) - ${new Date().toLocaleDateString('nl-NL')} ${scoreLabel}/5\n\n${emojiGrid}\n\nSpeel hier: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nederlandse Woordle',
          text: shareText,
        });
        return;
      } catch (err) {
        // Fallback if sharing is cancelled or fails
        console.log('Share failed or cancelled, falling back to clipboard copy:', err);
      }
    }

    // Fallback copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Could not copy text: ', err);
    }
  };

  const winPercentage = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;

  // Find max value in guess distribution for scaling the chart
  const maxDistribution = Math.max(...Object.values(stats.guesses), 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            id="stats-modal-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 p-6 shadow-2xl flex flex-col"
            id="stats-modal-content"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
              id="close-stats-btn"
              aria-label="Sluiten"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Game Result Header (if done) */}
            {gameStatus !== 'IN_PROGRESS' && (
              <div className="text-center mb-5 mt-2">
                {gameStatus === 'WON' ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.8, 1.1, 1] }}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2"
                  >
                    <Award className="w-6 h-6 animate-pulse" />
                  </motion.div>
                ) : null}
                <h3 className="text-xl font-bold tracking-tight text-white">
                  {gameStatus === 'WON' ? 'Gefeliciteerd!' : 'Helaas! Volgende keer beter.'}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Het woord was: <span className="font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-md bg-slate-950/40 border border-slate-800">{solution}</span>
                </p>
              </div>
            )}

            {/* General Stats Title */}
            <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Statistieken
            </h2>

            {/* Stats Metrics Grid */}
            <div className="grid grid-cols-4 gap-2 mb-6 text-center bg-slate-950/40 border border-slate-800/80 rounded-xl p-3">
              <div>
                <div className="text-2xl font-bold text-white font-mono">{stats.played}</div>
                <div className="text-[10px] text-slate-400 font-medium">Gespeeld</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-mono">{winPercentage}%</div>
                <div className="text-[10px] text-slate-400 font-medium">Winst</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-mono">{stats.currentStreak}</div>
                <div className="text-[10px] text-slate-400 font-medium font-sans leading-tight">Huidige Reeks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-mono">{stats.maxStreak}</div>
                <div className="text-[10px] text-slate-400 font-medium font-sans leading-tight">Max Reeks</div>
              </div>
            </div>

            {/* Guess Distribution */}
            <h3 className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Verdeling van gokken
            </h3>
            <div className="space-y-1.5 mb-6 text-xs px-1">
              {[1, 2, 3, 4, 5].map((guessNum) => {
                const count = stats.guesses[guessNum] || 0;
                // calculate percentage of current row with respect to max row count
                const percentage = count > 0 ? (count / maxDistribution) * 100 : 8;
                // is this row equal to the score of current guess?
                const isCurrentScoreRow = gameStatus === 'WON' && guessesCount === guessNum;

                return (
                  <div key={guessNum} className="flex items-center gap-2">
                    <span className="w-2.5 text-right font-mono font-bold text-slate-400">{guessNum}</span>
                    <div className="flex-1 bg-slate-950/30 rounded-xs h-5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ damping: 15, stiffness: 100, type: 'spring' }}
                        className={`h-full flex items-center justify-end pr-2 font-mono font-bold rounded-xs ${
                          isCurrentScoreRow
                            ? 'bg-emerald-500 text-slate-950'
                            : count > 0
                            ? 'bg-slate-700 text-slate-100'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                        style={{ minWidth: count > 0 ? '20px' : '20px' }}
                      >
                        {count}
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Timer and Share */}
            {gameStatus !== 'IN_PROGRESS' ? (
              <div className="border-t border-slate-800 pt-4 mt-auto grid grid-cols-2 gap-4 items-center">
                {/* Countdown to next day */}
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    Volgend Woord In
                  </div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5 tracking-wider">{timeToNext || '--:--:--'}</div>
                </div>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className={`w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition shadow-md ${
                    copied
                      ? 'bg-emerald-500 text-slate-950 shadow-emerald-900/10'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/20 active:scale-98'
                  }`}
                  id="share-results-btn"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                      Gekopieerd!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-white" />
                      Deel Score
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center text-xs text-slate-500 mt-auto border-t border-slate-800/65 pt-3">
                Raad het woord om vandaag je statistieken bij te werken!
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
