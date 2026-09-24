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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`w-full max-w-md shadow-2xl transition-all ${
          isClassic
            ? 'bg-[#c0c0c0] border-4 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black p-4 font-sans'
            : 'bg-black/95 border border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.2)] text-emerald-300 rounded-2xl p-5 sm:p-6 font-mono'
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
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-900/60">
            <div className="flex items-center gap-2 text-emerald-400">
              <Key className="w-5 h-5" />
              <h2 className="text-base font-bold text-white tracking-wide uppercase">
                Mission Seed Dispatcher
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-emerald-500/70 hover:text-white hover:bg-emerald-950/60 transition-colors cursor-pointer"
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
              : 'bg-zinc-950 border border-emerald-900/70 rounded-xl'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isClassic ? 'text-slate-700' : 'text-emerald-500/80'
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
                  : 'text-emerald-300 font-black'
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
                  ? 'bg-emerald-600 text-black font-bold rounded-lg'
                  : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 rounded-lg shadow-sm'
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
                isClassic ? 'text-black' : 'text-zinc-300'
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
                    : 'bg-black border border-emerald-900 text-emerald-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400'
                }`}
              />
              <button
                type="button"
                onClick={handleRandomize}
                className={`p-2 transition-colors cursor-pointer ${
                  isClassic
                    ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-black'
                    : 'bg-zinc-950 hover:bg-zinc-900 text-emerald-400 border border-emerald-800/60 rounded-lg'
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
                  : 'bg-zinc-950 hover:bg-zinc-900 text-amber-300 border border-amber-500/40 rounded-lg'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Load Daily ({formatDailyDate(todayDailySeed)})</span>
            </button>

            <button
              type="button"
              onClick={handleRandomize}
              className={`px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isClassic
                  ? 'bg-[#c0c0c0] border border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black active:border-t-[#808080] active:border-l-[#808080]'
                  : 'bg-zinc-950 hover:bg-zinc-900 text-emerald-400 border border-emerald-800/60 rounded-lg'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Random Seed</span>
            </button>
          </div>
        </div>

        {/* Explanatory text */}
        <p
          className={`text-[11px] leading-relaxed mb-5 ${
            isClassic ? 'text-slate-700' : 'text-zinc-400'
          }`}
        >
          <strong>Deterministic Guarantee:</strong> The Seed locks all mine placements, golden caches, anomaly clusters, and shop inventories across all sectors. Identical seeds yield identical layouts.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleStartWithSeed}
            className={`flex-1 py-2.5 px-4 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isClassic
                ? 'bg-[#c0c0c0] border-3 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-black font-bold'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.35)]'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Run with Seed</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`py-2.5 px-4 font-semibold text-xs sm:text-sm transition-colors cursor-pointer ${
              isClassic
                ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl border border-zinc-700'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
