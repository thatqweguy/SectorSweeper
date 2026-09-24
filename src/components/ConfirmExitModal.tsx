/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AlertTriangle, LogOut, ArrowRight, X } from 'lucide-react';
import { DisguiseMode } from '../types/game';

interface ConfirmExitModalProps {
  sector: number;
  disguiseMode: DisguiseMode;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmExitModal: React.FC<ConfirmExitModalProps> = ({
  sector,
  disguiseMode,
  onConfirm,
  onCancel
}) => {
  const isClassic = disguiseMode === 'classic';

  // Handle ESC key to cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  if (isClassic) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
        <div className="w-full max-w-sm bg-[#c0c0c0] border-3 border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-2xl">
          {/* Win95 Header */}
          <div className="bg-[#000080] px-2 py-1 flex items-center justify-between text-white font-bold text-xs">
            <span className="flex items-center gap-1.5">
              <span>⚠️</span>
              <span>Confirm Exit - Sector Sweeper</span>
            </span>
            <button
              type="button"
              onClick={onCancel}
              className="w-4 h-4 bg-[#c0c0c0] border border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black font-mono text-[10px] flex items-center justify-center font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-4 space-y-4 text-black text-xs">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="font-bold text-sm mb-1">Abort Mission in Sector {sector}?</div>
                <p className="text-slate-700 leading-relaxed">
                  Returning to the Main Menu will forfeit your current sector progress and active run inventory.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#808080]">
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-1.5 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Abort Mission
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-1.5 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 font-mono">
      <div className="w-full max-w-md bg-black/95 border border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.2)] rounded-2xl p-6 text-zinc-100 relative">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4 text-rose-400">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
              Abort Mission?
            </h2>
            <span className="text-xs text-zinc-400">Sector {sector} Infiltration Active</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed mb-6">
          Are you sure you want to retreat to HQ? Your active sector sweep, equipped relics, and tactical gadget charges will be forfeited.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
          >
            Resume Sweep
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Abort & Exit to Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
