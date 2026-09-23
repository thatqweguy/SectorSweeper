/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlayerStats, Item, DisguiseMode, Cell } from '../types/game';
import { isDailySeed, formatDailyDate } from '../utils/seed';
import {
  Trophy,
  Skull,
  RotateCcw,
  Award,
  Key,
  Copy,
  Check,
  Calendar,
  Share2,
  Play,
  Grid,
  BarChart3,
  Clock,
  Shield,
  Zap,
  Crosshair,
  Flame,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface EndGameModalProps {
  isVictory: boolean;
  stats: PlayerStats;
  board: Cell[][];
  equippedRelics: Item[];
  disguiseMode: DisguiseMode;
  seed: string;
  onRestart: () => void;
  onReplaySeed: (seed: string) => void;
}

export const EndGameModal: React.FC<EndGameModalProps> = ({
  isVictory,
  stats,
  board,
  equippedRelics,
  disguiseMode,
  seed,
  onRestart,
  onReplaySeed
}) => {
  const isClassic = disguiseMode === 'classic';
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'map'>('overview');
  const [copied, setCopied] = useState<boolean>(false);
  const isDaily = isDailySeed(seed);

  // Time formatting
  const minutes = Math.floor(stats.runDurationSeconds / 60);
  const seconds = stats.runDurationSeconds % 60;
  const timeFormatted = `${minutes}m ${seconds.toString().padStart(2, '0')}s`;

  // Efficiency & Logic Ratings
  const totalMinesDefused = stats.minesDefusedTotal;
  const totalTilesCleared = stats.tilesClearedTotal;
  const totalCascades = stats.cascadesTriggered;
  const totalDamage = stats.damageTakenTotal;
  const totalCredits = stats.totalCreditsEarned;

  // Calculate Logic Mastery Rating
  let clearanceRank = 'NOVICE OPERATIVE';
  let rankColor = 'text-slate-400';
  let rankGrade = 'C';

  if (isVictory) {
    if (totalDamage === 0) {
      clearanceRank = 'FLAWLESS ARCHITECT';
      rankColor = 'text-amber-300';
      rankGrade = 'S+';
    } else if (totalDamage <= 2) {
      clearanceRank = 'MASTER DEMOLITIONIST';
      rankColor = 'text-emerald-400';
      rankGrade = 'S';
    } else {
      clearanceRank = 'VETERAN SUB-COMMANDER';
      rankColor = 'text-sky-400';
      rankGrade = 'A';
    }
  } else {
    if (stats.sector >= 7) {
      clearanceRank = 'DEEP TRENCH SPECIALIST';
      rankColor = 'text-indigo-400';
      rankGrade = 'B';
    } else if (stats.sector >= 4) {
      clearanceRank = 'FIELD SURVEYOR';
      rankColor = 'text-yellow-400';
      rankGrade = 'C+';
    } else {
      clearanceRank = 'CADET DEFUSER';
      rankColor = 'text-rose-400';
      rankGrade = 'D';
    }
  }

  // Summary share text
  const handleShare = () => {
    const outcome = isVictory ? '🏆 VICTORY (Sector 10 Conquered)' : `💥 FALLEN in Sector ${stats.sector}`;
    const text = [
      `Sector Sweeper Post-Run Telemetry:`,
      `${outcome}`,
      `Grade: [${rankGrade}] ${clearanceRank}`,
      `Score: ${stats.score.toLocaleString()} PTS`,
      `Survival Time: ${timeFormatted}`,
      `Mines Disarmed: ${totalMinesDefused}`,
      `Safe Cells Cleared: ${totalTilesCleared}`,
      `Cascades: ${totalCascades}`,
      `Shield Damage Absorbed: ${totalDamage}`,
      `Relics Discovered: ${equippedRelics.length}`,
      `Mission Seed: ${seed}${isDaily ? ` (Daily: ${formatDailyDate(seed)})` : ''}`,
      `Play now: https://ais-pre-ttcq7xzgtutksudq4hq45z-785623348170.europe-west2.run.app`
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div
        className={`w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl transition-all ${
          isClassic
            ? 'bg-[#c0c0c0] border-4 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black p-3 sm:p-4'
            : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-5 sm:p-7'
        }`}
      >
        {/* Win95 Header */}
        {isClassic && (
          <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-2 py-1 text-white flex items-center justify-between font-bold text-xs mb-3 select-none">
            <div className="flex items-center gap-1.5">
              <span>{isVictory ? '🏆' : '💣'}</span>
              <span>{isVictory ? 'Mission Accomplished - Core Purged' : 'Critical Failure - Hull Breached'}</span>
            </div>
            <div className="w-4 h-3.5 bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-[#808080] border-b-[#808080] flex items-center justify-center text-[9px] font-bold font-mono">
              ✕
            </div>
          </div>
        )}

        {/* Top Banner & Outcome Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div
              className={`p-3 rounded-2xl shrink-0 ${
                isClassic
                  ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080]'
                  : isVictory
                  ? 'bg-amber-500/10 border border-amber-500/30'
                  : 'bg-rose-500/10 border border-rose-500/30'
              }`}
            >
              {isVictory ? (
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 animate-bounce" />
              ) : (
                <Skull className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500" />
              )}
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span
                  className={`text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded ${
                    isClassic
                      ? 'bg-blue-900 text-white'
                      : isVictory
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  Grade {rankGrade}
                </span>
                <span className={`text-xs font-semibold ${isClassic ? 'text-slate-800' : rankColor}`}>
                  {clearanceRank}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                {isVictory ? 'Singularity Core Conquered' : `Defeated in Sector ${stats.sector}`}
              </h2>
            </div>
          </div>

          {/* Quick Seed badge & share */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              type="button"
              onClick={handleShare}
              className={`flex-1 sm:flex-none px-3 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isClassic
                  ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-black'
                  : copied
                  ? 'bg-emerald-600 text-white rounded-xl'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-sm'
              }`}
              title="Copy formatted run telemetry to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Telemetry Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Telemetry</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation: Overview, Sector History, Field Heatmap */}
        <div className="flex items-center gap-1.5 mb-4 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? isClassic
                  ? 'bg-[#000080] text-white'
                  : 'bg-slate-800 text-white shadow'
                : isClassic
                ? 'bg-transparent text-black hover:bg-slate-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Telemetry Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'audit'
                ? isClassic
                  ? 'bg-[#000080] text-white'
                  : 'bg-slate-800 text-white shadow'
                : isClassic
                ? 'bg-transparent text-black hover:bg-slate-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sector Audit Log</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'map'
                ? isClassic
                  ? 'bg-[#000080] text-white'
                  : 'bg-slate-800 text-white shadow'
                : isClassic
                ? 'bg-transparent text-black hover:bg-slate-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Final Field Heatmap</span>
          </button>
        </div>

        {/* TAB CONTENTS (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Primary Score Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div
                  className={`p-3 ${
                    isClassic
                      ? 'bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white'
                      : 'rounded-xl bg-slate-950/60 border border-slate-800'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Final Score</span>
                  </div>
                  <div className={`text-lg sm:text-xl font-black tabular-nums mt-0.5 ${isClassic ? 'text-blue-900 font-mono' : 'text-amber-300'}`}>
                    {stats.score.toLocaleString()}
                  </div>
                </div>

                <div
                  className={`p-3 ${
                    isClassic
                      ? 'bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white'
                      : 'rounded-xl bg-slate-950/60 border border-slate-800'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-sky-400" />
                    <span>Run Time</span>
                  </div>
                  <div className={`text-lg sm:text-xl font-black tabular-nums mt-0.5 ${isClassic ? 'text-black font-mono' : 'text-sky-300'}`}>
                    {timeFormatted}
                  </div>
                </div>

                <div
                  className={`p-3 ${
                    isClassic
                      ? 'bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white'
                      : 'rounded-xl bg-slate-950/60 border border-slate-800'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                    <Crosshair className="w-3 h-3 text-emerald-400" />
                    <span>Deepest Sector</span>
                  </div>
                  <div className={`text-lg sm:text-xl font-black tabular-nums mt-0.5 ${isClassic ? 'text-emerald-900 font-mono' : 'text-emerald-400'}`}>
                    {stats.sector} / 10
                  </div>
                </div>

                <div
                  className={`p-3 ${
                    isClassic
                      ? 'bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white'
                      : 'rounded-xl bg-slate-950/60 border border-slate-800'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-rose-400" />
                    <span>Damage Taken</span>
                  </div>
                  <div className={`text-lg sm:text-xl font-black tabular-nums mt-0.5 ${isClassic ? 'text-rose-900 font-mono' : 'text-rose-400'}`}>
                    {totalDamage} HP
                  </div>
                </div>
              </div>

              {/* Detailed Operational Statistics */}
              <div
                className={`p-3.5 ${
                  isClassic
                    ? 'bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white'
                    : 'rounded-xl bg-slate-950/40 border border-slate-800'
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Tactical Deduction Telemetry</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Mines Defused / Disarmed</span>
                    <span className="font-mono font-bold text-white text-sm">{totalMinesDefused}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Safe Cells Cleared</span>
                    <span className="font-mono font-bold text-white text-sm">{totalTilesCleared}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Cascades Triggered</span>
                    <span className="font-mono font-bold text-white text-sm">{totalCascades}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Total Credits Harvested</span>
                    <span className="font-mono font-bold text-amber-300 text-sm">+{totalCredits} CR</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Chord Quick-Solves</span>
                    <span className="font-mono font-bold text-sky-300 text-sm">{stats.chordsExecutedTotal}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Active Gadgets Fired</span>
                    <span className="font-mono font-bold text-purple-300 text-sm">{stats.gadgetsUsedTotal}</span>
                  </div>
                </div>
              </div>

              {/* Seed Callout Card */}
              <div
                className={`p-3 flex items-center justify-between gap-3 ${
                  isClassic
                    ? 'bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white'
                    : 'rounded-xl bg-slate-950/70 border border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Key className={`w-4 h-4 shrink-0 ${isClassic ? 'text-blue-800' : 'text-indigo-400'}`} />
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold uppercase ${isClassic ? 'text-slate-700' : 'text-slate-400'}`}>
                        Replay Seed Code:
                      </span>
                      {isDaily && (
                        <span className={`text-[9px] px-1.5 py-0.2 font-bold uppercase rounded flex items-center gap-0.5 ${
                          isClassic ? 'bg-blue-800 text-white' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          <Calendar className="w-2.5 h-2.5" />
                          <span>Daily ({formatDailyDate(seed)})</span>
                        </span>
                      )}
                    </div>
                    <div className={`font-mono text-xs font-bold tracking-wider truncate ${isClassic ? 'text-black' : 'text-indigo-300'}`}>
                      {seed}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 text-right shrink-0">
                  <span>Guaranteed Deterministic</span>
                </div>
              </div>

              {/* Technology Loadout */}
              <div>
                <div className={`text-[11px] uppercase tracking-wider font-semibold mb-2 flex items-center justify-between ${
                  isClassic ? 'text-slate-800' : 'text-slate-400'
                }`}>
                  <span>Relic Loadout ({equippedRelics.length})</span>
                  {equippedRelics.length === 0 && <span className="text-[10px] italic">No relics acquired</span>}
                </div>
                {equippedRelics.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {equippedRelics.map(r => (
                      <div
                        key={r.id}
                        className={`p-2.5 text-xs flex items-start gap-2.5 ${
                          isClassic
                            ? 'bg-[#c0c0c0] border border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black'
                            : 'rounded-xl bg-slate-950/50 border border-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="p-1 rounded bg-slate-800 text-indigo-400 shrink-0">
                          <Award className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold">{r.name}</div>
                          <div className="text-[11px] text-slate-400 leading-snug">{r.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* TAB 2: SECTOR AUDIT LOG */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
                <span>Sector-by-sector breach timeline and survival records:</span>
                <span className="font-mono">{stats.sectorHistory.length} Recorded</span>
              </div>

              {stats.sectorHistory.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 rounded-xl bg-slate-950/40 border border-slate-800">
                  No sector audits available for this session.
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.sectorHistory.map((entry, idx) => (
                    <div
                      key={idx}
                      className={`p-3 flex items-center justify-between text-xs ${
                        isClassic
                          ? 'bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white'
                          : 'rounded-xl bg-slate-950/60 border border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                            entry.cleared
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          }`}
                        >
                          S{entry.sector}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{entry.sectorName}</span>
                            {entry.cleared ? (
                              <span className="text-[10px] text-emerald-400 font-semibold">CLEARED</span>
                            ) : (
                              <span className="text-[10px] text-rose-400 font-semibold">BREACHED</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-0.5">
                            <span>⏱️ {entry.timeSpentSeconds}s</span>
                            <span>💥 {entry.damageTaken} Dmg</span>
                            <span className="text-amber-300">💰 +{entry.creditsEarned} CR</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FINAL FIELD HEATMAP */}
          {activeTab === 'map' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-sky-400" />
                  <span>Final Sector Board State (All hidden cells & lethal mines exposed)</span>
                </span>
                <span className="font-mono text-[11px]">
                  Sector {stats.sector} ({board.length}x{board[0]?.length || 0})
                </span>
              </div>

              {/* Board Visual Map */}
              <div
                className={`p-3 overflow-x-auto flex justify-center ${
                  isClassic
                    ? 'bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white'
                    : 'bg-slate-950/80 rounded-xl border border-slate-800'
                }`}
              >
                <div
                  className="grid gap-[2px] select-none"
                  style={{
                    gridTemplateColumns: `repeat(${board[0]?.length || 1}, minmax(0, 1fr))`
                  }}
                >
                  {board.map((row, r) =>
                    row.map((cell, c) => {
                      let bgClass = 'bg-slate-800 text-slate-300';
                      let content = '';

                      if (cell.isDetonated) {
                        bgClass = 'bg-rose-600 text-white font-black animate-pulse';
                        content = '💥';
                      } else if (cell.isDefused) {
                        bgClass = 'bg-emerald-900/60 text-emerald-300 font-bold border border-emerald-500/40';
                        content = '🛡️';
                      } else if (cell.isMine) {
                        bgClass = 'bg-slate-900 text-rose-400 font-bold border border-rose-900/40';
                        content = cell.isClusterMine ? '☢️' : '💣';
                      } else if (cell.isRevealed) {
                        bgClass = 'bg-slate-900/50 text-slate-400';
                        content = cell.adjacentMines > 0 ? String(cell.adjacentMines) : '';
                      } else if (cell.isGolden) {
                        bgClass = 'bg-amber-950/50 text-amber-300 border border-amber-500/30';
                        content = '⭐';
                      } else {
                        bgClass = 'bg-slate-800/40 text-slate-500 border border-slate-800';
                        content = cell.adjacentMines > 0 ? String(cell.adjacentMines) : '';
                      }

                      return (
                        <div
                          key={`${r}-${c}`}
                          className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[10px] sm:text-xs font-mono rounded-[3px] transition-colors ${bgClass}`}
                          title={`R${r},C${c} - ${cell.isMine ? (cell.isClusterMine ? 'Cluster Mine' : 'Mine') : `Clue ${cell.adjacentMines}`}`}
                        >
                          {content}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <span>💥</span>
                  <span>Lethal Hit</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🛡️</span>
                  <span>Disarmed Mine</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>💣</span>
                  <span>Standard Mine</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>☢️</span>
                  <span>Cluster Mine (x2)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span>Golden Cache</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => onReplaySeed(seed)}
            className={`flex-1 py-3 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isClassic
                ? 'bg-[#c0c0c0] border-3 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-blue-900 font-bold'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg'
            }`}
            title="Retry the exact same seed layout"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay This Seed</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className={`flex-1 py-3 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isClassic
                ? 'bg-[#c0c0c0] border-3 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-black font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>New Random Mission</span>
          </button>
        </div>
      </div>
    </div>
  );
};
