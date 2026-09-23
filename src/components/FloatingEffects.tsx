/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface FloatingText {
  id: string;
  text: string;
  type: 'damage' | 'credit' | 'cascade' | 'gold' | 'defuse' | 'shield' | 'victory';
}

interface FloatingEffectsProps {
  floatingTexts: FloatingText[];
  isHitFlash: boolean;
  isVictoryCelebration: boolean;
  isEmpFlash: boolean;
}

export const FloatingEffects: React.FC<FloatingEffectsProps> = ({
  floatingTexts,
  isHitFlash,
  isVictoryCelebration,
  isEmpFlash
}) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {/* 1. Mine Detonation Shield Hit Vignette Flash */}
      {isHitFlash && (
        <div className="absolute inset-0 bg-rose-600/25 ring-8 ring-inset ring-rose-600/50 backdrop-blur-[1px] transition-opacity duration-300" />
      )}

      {/* 2. EMP Pulse Wave Screen Wash */}
      {isEmpFlash && (
        <div className="absolute inset-0 bg-cyan-500/15 backdrop-blur-[1px] transition-opacity duration-400" />
      )}

      {/* 3. Victory Confetti Shower */}
      {isVictoryCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 32 }).map((_, i) => {
            const colors = ['#f59e0b', '#38bdf8', '#10b981', '#ec4899', '#8b5cf6', '#eab308'];
            const randomColor = colors[i % colors.length];
            const leftPos = (i * 3.125) + (Math.sin(i) * 2);
            const delay = (i % 8) * 0.12;
            const size = 6 + (i % 4) * 3;

            return (
              <div
                key={`confetti-${i}`}
                className="absolute top-0 rounded-xs"
                style={{
                  left: `${leftPos}%`,
                  width: `${size}px`,
                  height: `${size * 1.5}px`,
                  backgroundColor: randomColor,
                  animation: `confettiDrift 2.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite`,
                  animationDelay: `${delay}s`,
                  boxShadow: `0 0 6px ${randomColor}`
                }}
              />
            );
          })}
        </div>
      )}

      {/* 4. Floating Action/Combat Badges */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        {floatingTexts.map(item => {
          let styleClass = 'bg-slate-900/90 text-white border-slate-700';

          if (item.type === 'damage') {
            styleClass = 'bg-rose-950/95 text-rose-200 border-rose-600 shadow-[0_0_16px_rgba(225,29,72,0.6)] font-bold text-sm';
          } else if (item.type === 'gold') {
            styleClass = 'bg-amber-950/95 text-amber-300 border-amber-500 shadow-[0_0_16px_rgba(245,158,11,0.6)] font-bold text-sm';
          } else if (item.type === 'cascade') {
            styleClass = 'bg-sky-950/95 text-sky-200 border-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.5)] font-medium text-xs';
          } else if (item.type === 'defuse') {
            styleClass = 'bg-emerald-950/95 text-emerald-200 border-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.5)] font-semibold text-xs';
          } else if (item.type === 'shield') {
            styleClass = 'bg-teal-950/95 text-teal-200 border-teal-400 shadow-[0_0_14px_rgba(45,212,191,0.5)] font-semibold text-xs';
          } else if (item.type === 'victory') {
            styleClass = 'bg-gradient-to-r from-amber-600 to-emerald-600 text-white border-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.8)] font-bold text-base tracking-wide';
          }

          return (
            <div
              key={item.id}
              className={`px-3.5 py-1.5 rounded-lg border backdrop-blur-md select-none transition-all animate-float-up flex items-center gap-1.5 ${styleClass}`}
            >
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
