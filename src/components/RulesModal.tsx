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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-slate-100 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
          <span>Field Manual: Sector Sweeper Protocol</span>
        </h2>

        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          {/* Section 1 */}
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <h3 className="font-semibold text-sm text-indigo-300 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> 1. The Core Roguelike Deduction Loop
            </h3>
            <p className="mb-2">
              Uncover cells across escalating sectors. Numbers indicate how many mines are hiding in the 8 adjacent cells. Clear all safe cells to progress to the next sector.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li><strong>Safe First Click:</strong> Your first click in any sector is 100% guaranteed to be safe and open up a comfortable starting zone.</li>
              <li><strong>Chording:</strong> Left-clicking an already revealed number cell will automatically reveal all remaining unflagged neighbors once you have placed the correct number of flags around it!</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <h3 className="font-semibold text-sm text-emerald-400 mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4" /> 2. Armor Plates & Hazard Mitigation
            </h3>
            <p className="mb-2">
              Unlike classic Minesweeper where 1 mistake ends the entire run, you start with <strong>3 Shield Plates</strong>:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li>Striking a mine consumes 1 Shield plate and flags that mine with a hazard indicator so you can safely continue.</li>
              <li>If you lose all shields, your next mine detonation will trigger a system quarantine (Game Over).</li>
              <li>Damaged shields can be repaired or expanded at the Inter-Sector Shop using Credits earned from safe sweeps!</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <h3 className="font-semibold text-sm text-cyan-400 mb-1 flex items-center gap-2">
              <Wrench className="w-4 h-4" /> 3. Procedural Relics & Active Gadgets
            </h3>
            <p className="mb-2">
              After each sector, visit the Requisition Terminal to draft procedural items:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li><strong>Passive Relics:</strong> Grant permanent rule-bending synergies (e.g. Corner Compass reveals corners; Cascade Capacitor awards credits; Quantum Buffer protects you from 50/50 guesses!).</li>
              <li><strong>Active Gadgets:</strong> Consumable tools with charges. Sonar Scanners reveal 3x3 areas; Disarm Chisels permanently defuse target mines; EMPs uncover safe sectors.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <h3 className="font-semibold text-sm text-amber-400 mb-1 flex items-center gap-2">
              <EyeOff className="w-4 h-4" /> 4. Themes & Panic Camouflage
            </h3>
            <p className="mb-2">
              Customizable visual themes to suit your style:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li><strong>Standard Minimalist:</strong> Clean, sleek, contemporary dark design with soft borders and crisp high-contrast numbers.</li>
              <li><strong>Old Classical Minesweeper:</strong> Authentic 1990s Windows 95/98 nostalgic theme featuring classic 3D beveled gray buttons, red digital LED displays, and the iconic yellow smiley face!</li>
              <li><strong>Panic / Boss Key [Esc]:</strong> Instantly masks your screen with a dense, realistic corporate budget spreadsheet or academic research paper. Hit <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] font-mono">Esc</kbd> anytime to toggle!</li>
            </ul>
          </div>

          {/* Section 5: Seed System & Daily Challenge */}
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <h3 className="font-semibold text-sm text-sky-400 mb-1 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> 5. Seed Dispatcher & Daily Challenge
            </h3>
            <p className="mb-2">
              Every run is mathematically reproducible using a pseudo-random seed:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li><strong>Share & Compare:</strong> Copy your seed code (e.g. <code>SWEEP-4921-ECHO</code>) to challenge friends to the exact same mine distribution, anomalies, and shop inventory!</li>
              <li><strong>Daily Mission:</strong> Click "Today's Daily Sweep" to play the global daily challenge seeded by today's date. Everyone worldwide tackles the exact same layout.</li>
              <li><strong>Instant Replay:</strong> On victory or defeat, click "Retry This Seed" to analyze what went wrong and test alternate deduction paths.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Acknowledge & Return to Sector
          </button>
        </div>
      </div>
    </div>
  );
};
