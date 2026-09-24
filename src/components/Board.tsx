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
  chordPulseCenter?: { r: number; c: number } | null;
  onCellClick: (row: number, col: number) => void;
  onCellContextMenu: (e: React.MouseEvent, row: number, col: number) => void;
  onChordClick: (row: number, col: number) => void;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
}

const MINIMAL_NUMBER_COLORS: Record<number, string> = {
  1: 'text-sky-400 font-black font-mono drop-shadow-[0_0_4px_rgba(56,189,248,0.5)]',
  2: 'text-emerald-400 font-black font-mono drop-shadow-[0_0_4px_rgba(52,211,153,0.5)]',
  3: 'text-rose-500 font-black font-mono drop-shadow-[0_0_4px_rgba(244,63,94,0.6)]',
  4: 'text-indigo-400 font-black font-mono drop-shadow-[0_0_4px_rgba(129,140,248,0.6)]',
  5: 'text-amber-400 font-black font-mono drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]',
  6: 'text-teal-300 font-black font-mono drop-shadow-[0_0_4px_rgba(94,234,212,0.6)]',
  7: 'text-fuchsia-400 font-black font-mono drop-shadow-[0_0_4px_rgba(232,121,249,0.6)]',
  8: 'text-white font-black font-mono drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]'
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
  chordPulseCenter = null,
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
    if (activeTool === 'sonar' || activeTool === 'cross_laser' || activeTool === 'railgun') return 'cursor-crosshair';
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
          : 'bg-black/90 border border-emerald-500/30 text-emerald-400 p-3 sm:p-4 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.15)] backdrop-blur-md'
      }`}
    >
      {/* EMP Shockwave Ripple Overlay */}
      {isEmpActive && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-64 h-64 rounded-full border-4 border-cyan-400/80 bg-cyan-500/20 animate-emp-wave shadow-[0_0_30px_#38bdf8]" />
        </div>
      )}

      {/* Hacker Mode Tactical Grid Header */}
      {!isClassic && (
        <div className="flex items-center justify-between px-1 mb-2.5 text-[10px] font-mono text-emerald-500/80 tracking-widest border-b border-emerald-950/70 pb-1.5 select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <span className="font-bold text-emerald-300">GRID_MATRIX</span>
            <span className="text-emerald-600/60 hidden sm:inline">// SECTOR_MAP</span>
          </div>
          <div className="flex items-center gap-2 text-[9px]">
            {activeTool !== 'none' && (
              <span className="text-amber-400 font-bold uppercase animate-pulse">
                [{activeTool.replace('_', ' ')}]
              </span>
            )}
            <span className="text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
              {hoveredCell ? `R${hoveredCell.r + 1}:C${hoveredCell.c + 1}` : `${rows}×${cols}`}
            </span>
          </div>
        </div>
      )}

      {/* Grid Container */}
      <div
        className={`${
          isClassic
            ? 'p-1.5 bg-[#c0c0c0] border-4 border-t-[#808080] border-l-[#808080] border-r-white border-b-white'
            : 'rounded-lg p-2 sm:p-2.5 bg-[#030704]/90 border border-emerald-950/80 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]'
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
            className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[10px] font-mono select-none ${
              isClassic
                ? 'bg-[#c0c0c0] text-slate-600 font-bold border-b border-r border-[#808080]'
                : 'text-emerald-600/70 font-semibold'
            }`}
          >
            {activeTool !== 'none' ? (
              <Crosshair className="w-3.5 h-3.5 text-amber-400 animate-pulse drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
            ) : (
              <span className="text-[10px] text-emerald-500/50">⌖</span>
            )}
          </div>

          {/* Column Headers */}
          {Array.from({ length: cols }).map((_, c) => {
            const isColHovered = hoveredCell?.c === c;
            return (
              <div
                key={`col-${c}`}
                className={`h-7 sm:h-8 flex items-center justify-center text-[11px] font-mono select-none transition-all duration-150 ${
                  isClassic
                    ? 'bg-[#c0c0c0] text-slate-700 border-b border-[#808080] font-semibold'
                    : isColHovered
                    ? 'text-emerald-300 font-extrabold drop-shadow-[0_0_6px_rgba(52,211,153,0.8)] scale-110'
                    : 'text-emerald-500/60 font-semibold hover:text-emerald-400'
                }`}
              >
                {c + 1}
              </div>
            );
          })}

          {/* Board Rows */}
          {board.map((row, r) => (
            <React.Fragment key={`row-${r}`}>
              {/* Row Header */}
              {(() => {
                const isRowHovered = hoveredCell?.r === r;
                return (
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[11px] font-mono select-none transition-all duration-150 ${
                      isClassic
                        ? 'bg-[#c0c0c0] text-slate-700 border-r border-[#808080] font-semibold'
                        : isRowHovered
                        ? 'text-emerald-300 font-extrabold pr-1 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)] scale-110'
                        : 'text-emerald-500/60 font-semibold pr-1 hover:text-emerald-400'
                    }`}
                  >
                    {r + 1}
                  </div>
                );
              })()}

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

                // Check if cell is in Orbital Railgun diagonal beam
                const isRailgunHovered =
                  activeTool === 'railgun' &&
                  hoveredCell &&
                  (hoveredCell.r - r === hoveredCell.c - c || hoveredCell.r - r === -(hoveredCell.c - c));

                // Check if this unrevealed cell is adjacent to a hovered chordable number
                const isChordingNeighbor =
                  isChordingCandidate &&
                  !cell.isRevealed &&
                  !cell.isFlagged &&
                  Math.abs(hoveredCell.r - r) <= 1 &&
                  Math.abs(hoveredCell.c - c) <= 1;

                // Transient pulse when clicking an unsatisfied number (like minesweeper.online)
                const isChordPulseNeighbor =
                  chordPulseCenter &&
                  !cell.isRevealed &&
                  !cell.isFlagged &&
                  Math.abs(chordPulseCenter.r - r) <= 1 &&
                  Math.abs(chordPulseCenter.c - c) <= 1;

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
                    onDoubleClick={() => {
                      if (cell.isRevealed) {
                        onChordClick(r, c);
                      }
                    }}
                    onAuxClick={(e) => {
                      if (e.button === 1 && cell.isRevealed) {
                        e.preventDefault();
                        onChordClick(r, c);
                      }
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      onCellContextMenu(e, r, c);
                    }}
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center text-xs sm:text-sm font-semibold relative outline-none transition-all duration-100 ${
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
                        : // Dark Green & Black Hacker Mode
                        cell.isRevealed
                        ? cell.isMine
                          ? cell.isDetonated
                            ? 'bg-rose-950 text-rose-300 border border-rose-500 rounded-[3px] shadow-[inset_0_0_10px_rgba(244,63,94,0.6)] animate-cell-reveal'
                            : 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 rounded-[3px] shadow-inner animate-cell-reveal'
                          : cell.isGolden
                          ? 'bg-amber-950/70 text-amber-200 border border-amber-400/80 rounded-[3px] shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-cell-reveal animate-pulse-gold'
                          : 'bg-[#0d2a1c] border border-emerald-800/50 rounded-[3px] shadow-[inset_0_2px_5px_rgba(0,0,0,0.7)] animate-cell-reveal'
                        : cell.isFlagged
                        ? 'bg-rose-950/60 border border-rose-500/80 rounded-[3px] shadow-[0_0_8px_rgba(244,63,94,0.4)] hover:border-rose-400 transition-all'
                        : isCellHovered
                        ? 'bg-gradient-to-b from-zinc-700 to-zinc-800 border border-emerald-400 rounded-[3px] shadow-[0_0_10px_rgba(16,185,129,0.5),0_2px_4px_rgba(0,0,0,0.6)] scale-[1.04] z-10'
                        : 'bg-gradient-to-b from-zinc-800 via-zinc-850 to-zinc-900 border-t border-l border-zinc-700/90 border-r border-b border-black rounded-[3px] shadow-[0_2px_3px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-emerald-500/70 active:scale-[0.96]'
                    } ${
                      isSonarHovered
                        ? 'ring-2 ring-emerald-400 bg-emerald-950/70 animate-pulse'
                        : ''
                    } ${
                      isCrossLaserHovered
                        ? 'ring-2 ring-lime-400 bg-lime-950/50 animate-pulse'
                        : ''
                    } ${
                      isRailgunHovered
                        ? 'ring-2 ring-cyan-400 bg-cyan-950/60 animate-pulse'
                        : ''
                    } ${
                      isChordingNeighbor
                        ? 'ring-2 ring-emerald-400/80 bg-emerald-950/50 animate-pulse'
                        : ''
                    } ${
                      isChordPulseNeighbor
                        ? 'ring-2 ring-amber-400/90 bg-amber-950/70 scale-[1.05]'
                        : ''
                    } ${
                      isRadarPulse
                        ? 'ring-2 ring-emerald-300 bg-emerald-900/50 animate-radar-ping'
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
                              : MINIMAL_NUMBER_COLORS[cell.adjacentMines] || 'text-emerald-300'
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
                        <Flag className="w-3.5 h-3.5 text-rose-500 fill-rose-500/30 drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
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
