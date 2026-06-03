/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
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
            id="help-modal-backdrop"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 p-6 shadow-2xl"
            id="help-modal-content"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-semibold tracking-tight">Hoe te spelen</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
                id="close-help-btn"
                aria-label="Sluiten"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps */}
            <div className="space-y-4 text-sm leading-relaxed text-slate-300">
              <p>
                Raad de <strong>Nederlandse Woordle</strong> in 5 beurten.
                Elke gok moet een geldig Nederlands woord van 5 letters zijn.
              </p>
              <p>
                Na elke gok verandert de kleur van de tegels om te laten zien hoe dicht je bij het woord was.
              </p>

              {/* Examples */}
              <div className="border-t border-slate-800 pt-4 mt-2 space-y-4">
                <h3 className="font-semibold text-slate-200">Voorbeelden:</h3>

                {/* Example 1 */}
                <div className="space-y-1">
                  <div className="flex gap-1.5">
                    <span className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm bg-emerald-600 text-slate-50 border border-emerald-500">W</span>
                    <span className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm bg-slate-800 text-slate-200 border border-slate-700">A</span>
                    <span className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm bg-slate-800 text-slate-200 border border-slate-700">T</span>
                    <span className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm bg-slate-800 text-slate-200 border border-slate-700">E</span>
                    <span className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm bg-slate-800 text-slate-200 border border-slate-700">R</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    De letter <strong className="text-emerald-400">W</strong> zit in het woord en staat op de goede plek.
                  </p>
                </div>

                {/* Example 2 */}
                <div className="space-y-1">
                  <div className="flex gap-1.5">
                    <span className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm bg-slate-800 text-slate-200 border border-slate-700">B</span>
                    <span className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm bg-slate-800 text-slate-200 border border-slate-700">R</span>
                    <span className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm bg-amber-500 text-slate-950 border border-amber-400 font-extrabold">O</span>
                    <span className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm bg-slate-800 text-slate-200 border border-slate-700">O</span>
                    <span className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm bg-slate-800 text-slate-200 border border-slate-700">D</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    De letter <strong className="text-amber-400">O</strong> zit wel in het woord, maar staat nog op de verkeerde plek.
                  </p>
                </div>

                {/* Example 3 */}
                <div className="space-y-1">
                  <div className="flex gap-1.5">
                    <span className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm bg-slate-800 text-slate-200 border border-slate-700">S</span>
                    <span className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm bg-slate-800 text-slate-200 border border-slate-700">T</span>
                    <span className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm bg-slate-800 text-slate-200 border border-slate-700">O</span>
                    <span className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm bg-slate-750 text-slate-500 border border-slate-800 opacity-50">E</span>
                    <span className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm bg-slate-800 text-slate-200 border border-slate-700">L</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    De letter <strong className="text-slate-400">E</strong> zit helemaal niet in het woord.
                  </p>
                </div>
              </div>

              {/* Day Note */}
              <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 mt-4 text-xs text-slate-400 flex items-center gap-2">
                <span className="flex-shrink-0 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                Elke dag om middernacht (lokale tijd) verschijnt er een gloednieuw woord van 5 letters om op te lossen!
              </div>
            </div>

            {/* Action */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-200 shadow-md shadow-emerald-950/20"
                id="start-playing-btn"
              >
                Start met Spelen!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
