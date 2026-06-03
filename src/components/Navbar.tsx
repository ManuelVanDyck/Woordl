/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HelpCircle, BarChart2, Calendar } from 'lucide-react';

interface NavbarProps {
  onOpenHelp: () => void;
  onOpenStats: () => void;
  isDaily: boolean;
}

export default function Navbar({ onOpenHelp, onOpenStats, isDaily }: NavbarProps) {
  return (
    <header
      className="w-full border-b border-slate-800 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40 select-none px-4 py-3"
      id="app-navigation-bar"
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left Side: Help button */}
        <button
          onClick={onOpenHelp}
          className="rounded-xl p-2 hover:bg-slate-900 border border-transparent hover:border-slate-800 text-slate-400 hover:text-emerald-400 transition"
          id="help-button-nav"
          title="Speluitleg"
        >
          <HelpCircle className="w-5 h-5 md:w-6 h-6" />
        </button>

        {/* Center: Title */}
        <div className="flex flex-col items-center">
          <h1 className="text-xl md:text-2xl font-black tracking-widest text-white flex items-center gap-1 font-mono">
            WOORDLE
          </h1>
          {isDaily && (
            <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-1 mt-0.5 font-sans">
              <Calendar className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
              Dagelijkse Uitdaging
            </span>
          )}
        </div>

        {/* Right Side: Stats */}
        <button
          onClick={onOpenStats}
          className="rounded-xl p-2 hover:bg-slate-900 border border-transparent hover:border-slate-800 text-slate-400 hover:text-emerald-400 transition"
          id="stats-button-nav"
          title="Statistieken"
        >
          <BarChart2 className="w-5 h-5 md:w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
