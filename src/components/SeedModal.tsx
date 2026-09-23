/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DisguiseMode } from '../types/game';
import {
  generateRandomSeed,
  getDailySeed,
  isDailySeed,
  formatDailyDate
} from '../utils/seed';
import {
  Key,
  Copy,
  Check,
  Calendar,
  Sparkles,
  RefreshCw,
  Play,
  Share2,
  X
} from 'lucide-react';

interface SeedModalProps {
  currentSeed: string;
  disguiseMode: DisguiseMode;
  onClose: () => void;
  onApplySeedAndRestart: (seed: string) => void;
}

export const SeedModal: React.FC<SeedModalProps> = ({
  currentSeed,
  disguiseMode,
  onClose,
  onApplySeedAndRestart
}) => {
  const isClassic = disguiseMode === 'classic';
  const [inputSeed, setInputSeed] = useState<string>(currentSeed);
  const [copied, setCopied] = useState<boolean>(false);

  const todayDailySeed = getDailySeed();
  const isCurrentlyDaily = isDailySeed(currentSeed);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSeed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRandomize = () => {
    const newSeed = generateRandomSeed();
    setInputSeed(newSeed);
  };

  const handleSelectDaily = () => {
    setInputSeed(todayDailySeed);
  };

  const handleStartWithSeed = () => {
    const finalSeed = inputSeed.trim() || generateRandomSeed();
    onApplySeedAndRestart(finalSeed.toUpperCase());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`w-full max-w-md shadow-2xl transition-all ${
          isClassic
            ? 'bg-[#c0c0c0] border-4 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black p-4'
            : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-6 sm:p-7'
        }`}
      >
        {/* Win95 Header */}
        {isClassic ? (
          <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-2 py-1 text-white flex items-center justify-between font-bold text-xs mb-4">
            <div className="flex items-center gap-1.5">
              <span>🔑</span>
              <span>Mission Seed Dispatcher</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-4 h-3.5 bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-[#808080] border-b-[#808080] flex items-center justify-center text-[9px] font-bold font-mono active:border-t-[#808080] active:border-l-[#808080] cursor-pointer"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400">
              <Key className="w-5 h-5" />
              <h2 className="text-base font-bold text-white tracking-wide uppercase">
                Mission Seed Dispatcher
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Current Active Seed Card */}
        <div
          className={`p-3.5 mb-4 ${
            isClassic
              ? 'bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white'
              : 'bg-slate-950/70 border border-slate-800 rounded-xl'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isClassic ? 'text-slate-700' : 'text-slate-400'
              }`}
            >
              Current Active Seed:
            </span>
            {isCurrentlyDaily && (
              <span
                className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded flex items-center gap-1 ${
                  isClassic
                    ? 'bg-blue-800 text-white'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>Daily Challenge ({formatDailyDate(currentSeed)})</span>
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div
              className={`font-mono font-bold text-sm sm:text-base px-2.5 py-1 select-all tracking-wider truncate ${
                isClassic
                  ? 'bg-white text-black border border-[#808080]'
                  : 'text-indigo-300'
              }`}
            >
              {currentSeed}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                isClassic
                  ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-black'
                  : copied
                  ? 'bg-emerald-600 text-white rounded-lg'
                  : 'bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg shadow-sm'
              }`}
              title="Copy seed to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Custom Seed Input & Generation */}
        <div className="space-y-3 mb-5">
          <div>
            <label
              className={`block text-xs font-bold mb-1 ${
                isClassic ? 'text-black' : 'text-slate-300'
              }`}
            >
              Launch Custom or Challenge Seed:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputSeed}
                onChange={e => setInputSeed(e.target.value.toUpperCase())}
                placeholder="e.g. SWEEP-4920-ECHO"
                className={`flex-1 px-3 py-2 text-sm font-mono tracking-wider font-bold rounded-lg outline-none transition-all ${
                  isClassic
                    ? 'bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white text-black'
                    : 'bg-slate-950 border border-slate-700 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
              />
              <button
                type="button"
                onClick={handleRandomize}
                className={`p-2 transition-colors cursor-pointer ${
                  isClassic
                    ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-black'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg'
                }`}
                title="Generate Random Seed"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick presets: Today's Daily & Random */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={handleSelectDaily}
              className={`px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isClassic
                  ? 'bg-[#c0c0c0] border border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-blue-900 active:border-t-[#808080] active:border-l-[#808080]'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-amber-300 border border-amber-500/30 rounded-lg'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Load Today's Daily ({formatDailyDate(todayDailySeed)})</span>
            </button>

            <button
              type="button"
              onClick={handleRandomize}
              className={`px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isClassic
                  ? 'bg-[#c0c0c0] border border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black active:border-t-[#808080] active:border-l-[#808080]'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Random Code</span>
            </button>
          </div>
        </div>

        {/* Explanatory text */}
        <p
          className={`text-[11px] leading-relaxed mb-5 ${
            isClassic ? 'text-slate-700' : 'text-slate-400'
          }`}
        >
          <strong>Deterministic Guarantee:</strong> The Seed completely locks the mine placements, golden caches, anomaly clusters, and shop inventories across all 10 sectors. Two players on the same seed and first-click coordinate will face the exact same layout!
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleStartWithSeed}
            className={`flex-1 py-2.5 px-4 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isClassic
                ? 'bg-[#c0c0c0] border-3 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-black font-bold'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Launch Run with Seed</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`py-2.5 px-4 font-semibold text-xs sm:text-sm transition-colors cursor-pointer ${
              isClassic
                ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
