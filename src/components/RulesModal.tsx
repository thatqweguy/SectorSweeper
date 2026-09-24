/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Sparkles, EyeOff, Wrench, RefreshCw, X } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-mono">
      <div className="w-full max-w-2xl bg-black/95 border border-emerald-500/60 rounded-2xl p-5 sm:p-7 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.2)] relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-emerald-500/70 hover:text-white rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-lg sm:text-xl font-bold tracking-tight mb-4 flex items-center gap-2 text-white">
          <span className="text-emerald-400">⚡</span>
          <span>Field Manual: Sector Sweeper Protocol</span>
        </h2>

        <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
          {/* Section 1 */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-emerald-900/60">
            <h3 className="font-semibold text-sm text-emerald-400 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> 1. The Core Roguelike Deduction Loop
            </h3>
            <p className="mb-2">
              Uncover cells across escalating sectors. Numbers indicate how many mines are hiding in the 8 adjacent cells. Clear all safe cells to progress to the next sector.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 font-sans">
              <li><strong>Safe First Click:</strong> Your first click in any sector is 100% guaranteed to be safe and open up a comfortable starting zone.</li>
              <li><strong>Chording:</strong> Left-clicking an already revealed number cell will automatically reveal all remaining unflagged neighbors once you have placed the correct number of flags around it!</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-emerald-900/60">
            <h3 className="font-semibold text-sm text-emerald-400 mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4" /> 2. Armor Plates & Hazard Mitigation
            </h3>
            <p className="mb-2">
              Unlike classic Minesweeper where 1 mistake ends the entire run, you start with <strong>3 Shield Plates</strong>:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 font-sans">
              <li>Striking a mine consumes 1 Shield plate and flags that mine with a hazard indicator so you can safely continue.</li>
              <li>If you lose all shields, your next mine detonation will trigger a system quarantine (Game Over).</li>
              <li>Damaged shields can be repaired or expanded at the Inter-Sector Shop using Credits earned from safe sweeps!</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-emerald-900/60">
            <h3 className="font-semibold text-sm text-emerald-400 mb-1 flex items-center gap-2">
              <Wrench className="w-4 h-4" /> 3. Subroutines, Hardware & Terminal Economy
            </h3>
            <p className="mb-2">
              After each sector, visit the Requisition Terminal to build synergies and draft tactical supplies:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 font-sans">
              <li><strong>Relic Slots & Selling:</strong> You start with <strong>5 Subroutine Slots</strong> (expandable to 8). You can sell unwanted relics for a 50% credit refund at the depot to pivot builds!</li>
              <li><strong>Aegis Hardlight Core (Second Chance):</strong> Legendary passive that increases Max Shields by +1 and provides a one-time emergency hardlight matrix that absorbs fatal mine blasts at 0 shields!</li>
              <li><strong>Daemon Modifiers:</strong> Relics can roll rare hacker editions in the shop — <strong>Ghost Daemon</strong> (runs headless, consumes 0 slots!), <strong>Prism Thread</strong> (+50% credit yields & score), <strong>Glitched Bit</strong> (+300 score & +2 Cr), or <strong>Overclocked</strong> (+150 score).</li>
              <li><strong>Gadget Charge Caps:</strong> Gadgets are limited to a maximum capacity of <strong>4 charges</strong>, encouraging tactical execution over hoarding.</li>
              <li><strong>Quantum Cache Packs:</strong> Confidential subroutine caches in the shop grant unique enhancements: credit injections, shield expansions, or free armor overhauls.</li>
              <li><strong>Dynamic Restock & Escalation:</strong> Shop rerolls scale with usage, and armor upgrades scale with hull depth to ensure balanced tactical progression.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-emerald-900/60">
            <h3 className="font-semibold text-sm text-lime-400 mb-1 flex items-center gap-2">
              <EyeOff className="w-4 h-4" /> 4. Themes & Panic Camouflage
            </h3>
            <p className="mb-2">
              Customizable visual themes to suit your style:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 font-sans">
              <li><strong>Hacker Matrix Terminal:</strong> High-contrast dark green and black terminal aesthetic with CRT scanline texturing and cyber grid accents.</li>
              <li><strong>Classic '95:</strong> Authentic 1990s Windows 95/98 nostalgic theme featuring 3D beveled gray buttons, red digital LED displays, and the iconic yellow smiley face!</li>
              <li><strong>Panic / Boss Key [Esc]:</strong> Instantly masks your screen with a dense, realistic corporate budget spreadsheet or academic research paper. Hit <kbd className="px-1.5 py-0.5 bg-black border border-emerald-800 rounded text-[11px] font-mono text-emerald-400">Esc</kbd> anytime to toggle!</li>
            </ul>
          </div>

          {/* Section 5: Seed System & Daily Challenge */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-emerald-900/60">
            <h3 className="font-semibold text-sm text-teal-300 mb-1 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> 5. Seed Dispatcher & Daily Challenge
            </h3>
            <p className="mb-2">
              Every run is mathematically reproducible using a pseudo-random seed:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 font-sans">
              <li><strong>Share & Compare:</strong> Copy your seed code (e.g. <code>SWEEP-4921-ECHO</code>) to challenge friends to the exact same mine distribution, anomalies, and shop inventory!</li>
              <li><strong>Daily Mission:</strong> Click "Today's Daily Sweep" to play the global daily challenge seeded by today's date. Everyone worldwide tackles the exact same layout.</li>
              <li><strong>Instant Replay:</strong> On victory or defeat, click "Retry This Seed" to analyze what went wrong and test alternate deduction paths.</li>
            </ul>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-colors cursor-pointer"
          >
            Acknowledge & Return to Sector
          </button>
        </div>
      </div>
    </div>
  );
};
