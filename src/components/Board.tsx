/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Cell, DisguiseMode, ActiveGadgetTool } from '../types/game';
import { Flag, Shield, Sparkles, AlertTriangle, Crosshair, Zap } from 'lucide-react';

interface BoardProps {
  board: Cell[][];
  disguiseMode: DisguiseMode;
  activeTool: ActiveGadgetTool;
  isShaking?: boolean;
  isEmpActive?: boolean;
  radarPulseCell?: { r: number; c: number } | null;
  onCellClick: (row: number, col: number) => void;
  onCellContextMenu: (e: React.MouseEvent, row: number, col: number) => void;
  onChordClick: (row: number, col: number) => void;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
}

const MINIMAL_NUMBER_COLORS: Record<number, string> = {
  1: 'text-sky-400 font-extrabold drop-shadow-[0_0_6px_rgba(56,189,248,0.25)]',
  2: 'text-emerald-400 font-extrabold drop-shadow-[0_0_6px_rgba(52,211,153,0.25)]',
  3: 'text-rose-400 font-extrabold drop-shadow-[0_0_6px_rgba(251,113,133,0.25)]',
  4: 'text-indigo-400 font-extrabold drop-shadow-[0_0_6px_rgba(129,140,248,0.25)]',
  5: 'text-amber-400 font-extrabold drop-shadow-[0_0_6px_rgba(251,191,36,0.25)]',
  6: 'text-teal-300 font-extrabold drop-shadow-[0_0_6px_rgba(94,234,212,0.25)]',
  7: 'text-fuchsia-400 font-extrabold drop-shadow-[0_0_6px_rgba(232,121,249,0.25)]',
  8: 'text-slate-300 font-extrabold'
};

const CLASSIC_NUMBER_COLORS: Record<number, string> = {
  1: 'text-[#0000ff] font-extrabold font-mono text-base',
  2: 'text-[#008000] font-extrabold font-mono text-base',
  3: 'text-[#ff0000] font-extrabold font-mono text-base',
  4: 'text-[#000080] font-extrabold font-mono text-base',
  5: 'text-[#800000] font-extrabold font-mono text-base',
  6: 'text-[#008080] font-extrabold font-mono text-base',
  7: 'text-[#000000] font-extrabold font-mono text-base',
  8: 'text-[#808080] font-extrabold font-mono text-base'
};

const ClassicFlagIcon: React.FC = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 select-none">
    <polygon points="3,2 12,5.5 3,9" fill="#ff0000" />
    <line x1="3" y1="2" x2="3" y2="14" stroke="#000000" strokeWidth="1.5" />
    <line x1="1" y1="14" x2="14" y2="14" stroke="#000000" strokeWidth="2" />
    <line x1="2.5" y1="12" x2="12.5" y2="12" stroke="#000000" strokeWidth="1.5" />
  </svg>
);

const ClassicMineIcon: React.FC = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 select-none">
    <line x1="8" y1="1" x2="8" y2="15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="1" y1="8" x2="15" y2="8" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="3" y1="3" x2="13" y2="13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="3" y1="13" x2="13" y2="3" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="8" r="4.2" fill="#000000" />
    <circle cx="6.5" cy="6.5" r="1.1" fill="#ffffff" />
  </svg>
);

export const Board: React.FC<BoardProps> = ({
  board,
  disguiseMode,
  activeTool,
  isShaking = false,
  isEmpActive = false,
  radarPulseCell = null,
  onCellClick,
  onCellContextMenu,
  onChordClick,
  onPointerDown,
  onPointerUp
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

  if (!board || board.length === 0 || board[0].length === 0) {
    return null;
  }

  const rows = board.length;
  const cols = board[0].length;
  const isClassic = disguiseMode === 'classic';

  // Tool cursor classes
  const getToolCursor = () => {
    if (activeTool === 'sonar' || activeTool === 'cross_laser') return 'cursor-crosshair';
    if (activeTool === 'defuse') return 'cursor-pointer';
    if (activeTool === 'xray') return 'cursor-help';
    return 'cursor-default';
  };

  // Compute chording preview: if hovered cell is revealed with adjacent mines > 0
  const isChordingCandidate =
    hoveredCell &&
    board[hoveredCell.r]?.[hoveredCell.c]?.isRevealed &&
    board[hoveredCell.r]?.[hoveredCell.c]?.adjacentMines > 0;

  return (
    <div
      className={`relative inline-block select-none overflow-x-auto transition-transform duration-150 ${
        isShaking ? 'animate-screen-shake' : ''
      } ${
        isClassic
          ? 'bg-[#c0c0c0] p-3 border-4 border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-[2px_2px_0px_#000000]'
          : 'bg-slate-900/90 border border-slate-800 text-slate-100 p-4 rounded-xl shadow-2xl backdrop-blur-sm'
      }`}
    >
      {/* EMP Shockwave Ripple Overlay */}
      {isEmpActive && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-64 h-64 rounded-full border-4 border-cyan-400/80 bg-cyan-500/20 animate-emp-wave shadow-[0_0_30px_#38bdf8]" />
        </div>
      )}

      {/* Grid Container */}
      <div
        className={`${
          isClassic
            ? 'p-1.5 bg-[#c0c0c0] border-4 border-t-[#808080] border-l-[#808080] border-r-white border-b-white'
            : 'rounded-lg'
        }`}
      >
        <div
          className={`grid ${isClassic ? 'gap-0' : 'gap-1'} ${getToolCursor()}`}
          style={{
            gridTemplateColumns: `auto repeat(${cols}, minmax(0, 1fr))`
          }}
        >
          {/* Top-left corner cell */}
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[10px] font-mono ${
              isClassic
                ? 'bg-[#c0c0c0] text-slate-600 font-bold border-b border-r border-[#808080]'
                : 'text-slate-600'
            }`}
          >
            {activeTool !== 'none' ? <Crosshair className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> : '•'}
          </div>

          {/* Column Headers */}
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={`col-${c}`}
              className={`h-7 sm:h-8 flex items-center justify-center text-[11px] font-semibold font-mono ${
                isClassic
                  ? 'bg-[#c0c0c0] text-slate-700 border-b border-[#808080]'
                  : 'text-slate-500'
              }`}
            >
              {c + 1}
            </div>
          ))}

          {/* Board Rows */}
          {board.map((row, r) => (
            <React.Fragment key={`row-${r}`}>
              {/* Row Header */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[11px] font-mono font-semibold ${
                  isClassic
                    ? 'bg-[#c0c0c0] text-slate-700 border-r border-[#808080]'
                    : 'text-slate-500 pr-1'
                }`}
              >
                {r + 1}
              </div>

              {/* Row Cells */}
              {row.map((cell, c) => {
                const isCellHovered = hoveredCell?.r === r && hoveredCell?.c === c;

                // Check if cell is in 3x3 Sonar tool hover zone
                const isSonarHovered =
                  activeTool === 'sonar' &&
                  hoveredCell &&
                  Math.abs(hoveredCell.r - r) <= 1 &&
                  Math.abs(hoveredCell.c - c) <= 1;

                // Check if cell is in Cross Laser tool row/column sweep
                const isCrossLaserHovered =
                  activeTool === 'cross_laser' &&
                  hoveredCell &&
                  (hoveredCell.r === r || hoveredCell.c === c);

                // Check if this unrevealed cell is adjacent to a hovered chordable number
                const isChordingNeighbor =
                  isChordingCandidate &&
                  !cell.isRevealed &&
                  !cell.isFlagged &&
                  Math.abs(hoveredCell.r - r) <= 1 &&
                  Math.abs(hoveredCell.c - c) <= 1;

                // Radar pulse effect at specific coordinates
                const isRadarPulse =
                  radarPulseCell &&
                  Math.abs(radarPulseCell.r - r) <= 1 &&
                  Math.abs(radarPulseCell.c - c) <= 1;

                return (
                  <button
                    type="button"
                    key={`cell-${r}-${c}`}
                    onMouseEnter={() => setHoveredCell({ r, c })}
                    onMouseLeave={() => setHoveredCell(null)}
                    onMouseDown={() => {
                      if (!cell.isRevealed) {
                        onPointerDown?.();
                      }
                    }}
                    onMouseUp={() => onPointerUp?.()}
                    onClick={() => {
                      if (cell.isRevealed) {
                        onChordClick(r, c);
                      } else {
                        onCellClick(r, c);
                      }
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      onCellContextMenu(e, r, c);
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center text-sm font-semibold relative outline-none transition-all duration-150 ${
                      isClassic
                        ? cell.isRevealed
                          ? cell.isMine
                            ? cell.isDetonated
                              ? 'bg-[#ff0000] border border-[#808080]'
                              : 'bg-[#bdbdbd] border border-[#808080]'
                            : cell.isGolden
                            ? 'bg-[#d8d8b0] border border-[#808080]'
                            : 'bg-[#bdbdbd] border border-[#808080]'
                          : 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white'
                        : // Minimalist Mode - Crisp, Refined, Less Rounded [4px]
                        cell.isRevealed
                        ? cell.isMine
                          ? cell.isDetonated
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-600/80 rounded-[4px] shadow-[inset_0_0_10px_rgba(244,63,94,0.4)] animate-cell-reveal'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-800/60 rounded-[4px] shadow-inner animate-cell-reveal'
                          : cell.isGolden
                          ? 'bg-amber-950/50 text-amber-200 border border-amber-500/70 rounded-[4px] shadow-[0_0_10px_rgba(245,158,11,0.3)] animate-cell-reveal animate-pulse-gold'
                          : 'bg-slate-950/75 border border-slate-800/80 rounded-[4px] shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] animate-cell-reveal'
                        : cell.isFlagged
                        ? 'bg-slate-800/90 border border-rose-500/60 rounded-[4px] shadow-[0_0_8px_rgba(244,63,94,0.25)] hover:border-rose-400 transition-all'
                        : isCellHovered
                        ? 'bg-gradient-to-b from-slate-700 to-slate-800 border-t border-t-slate-500/80 border-x border-slate-700 border-b border-b-slate-900 rounded-[4px] border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] scale-[1.03]'
                        : 'bg-gradient-to-b from-slate-800 via-slate-800/95 to-slate-850 border-t border-t-slate-600/70 border-x border-slate-700/60 border-b border-b-slate-950 rounded-[4px] shadow-[0_2px_4px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-sky-400/70 active:scale-[0.97]'
                    } ${
                      isSonarHovered
                        ? 'ring-2 ring-cyan-400 bg-cyan-950/60 animate-pulse'
                        : ''
                    } ${
                      isCrossLaserHovered
                        ? 'ring-2 ring-amber-400 bg-amber-950/40 animate-pulse'
                        : ''
                    } ${
                      isChordingNeighbor
                        ? 'ring-2 ring-sky-400/70 bg-sky-950/40 animate-pulse'
                        : ''
                    } ${
                      isRadarPulse
                        ? 'ring-2 ring-cyan-300 bg-cyan-900/40 animate-radar-ping'
                        : ''
                    } ${
                      cell.isPeeking ? 'ring-2 ring-purple-400 bg-purple-950/60' : ''
                    }`}
                  >
                    {/* CELL CONTENT */}
                    {cell.isRevealed ? (
                      cell.isMine ? (
                        isClassic ? (
                          cell.isDetonated ? (
                            <ClassicMineIcon />
                          ) : cell.isDefused ? (
                            <Shield className="w-4 h-4 text-emerald-700" />
                          ) : (
                            <ClassicMineIcon />
                          )
                        ) : cell.isDetonated ? (
                          <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                        ) : cell.isDefused ? (
                          <Shield className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <span className="text-sm font-bold text-rose-400">✹</span>
                        )
                      ) : cell.adjacentMines > 0 ? (
                        <span
                          className={
                            isClassic
                              ? CLASSIC_NUMBER_COLORS[cell.adjacentMines] || 'text-black'
                              : MINIMAL_NUMBER_COLORS[cell.adjacentMines] || 'text-slate-200'
                          }
                        >
                          {cell.isGlitch ? (
                            <span className="inline-flex items-center gap-0.5">
                              {cell.adjacentMines}
                              <span className="text-[9px] text-amber-400">*</span>
                            </span>
                          ) : (
                            cell.adjacentMines
                          )}
                        </span>
                      ) : cell.isGolden ? (
                        <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                      ) : null
                    ) : cell.isFlagged ? (
                      isClassic ? (
                        <ClassicFlagIcon />
                      ) : (
                        <Flag className="w-3.5 h-3.5 text-rose-400 fill-rose-500/25 drop-shadow-[0_0_4px_rgba(244,63,94,0.5)]" />
                      )
                    ) : cell.isPeeking ? (
                      cell.isMine ? (
                        <span className="text-[10px] text-rose-400 font-bold font-mono">MINE</span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">
                          {cell.adjacentMines === 0 ? 'SAFE' : cell.adjacentMines}
                        </span>
                      )
                    ) : null}

                    {/* Corner indicator for Golden caches */}
                    {!cell.isRevealed && cell.isGolden && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 ring-1 ring-amber-400/50 shadow-[0_0_6px_rgba(251,191,36,0.9)] animate-pulse" />
                    )}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
