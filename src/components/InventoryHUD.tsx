/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Item, DisguiseMode, ActiveGadgetTool } from '../types/game';
import {
  Shield,
  Coins,
  Flag,
  Volume2,
  VolumeX,
  Keyboard,
  EyeOff,
  Compass,
  Zap,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Activity,
  Eye,
  Cpu,
  RefreshCw,
  Percent,
  ShieldAlert,
  Radar,
  Wrench,
  Radio,
  Scan,
  HeartPulse,
  HelpCircle,
  Sliders,
  Monitor,
  Key,
  Calendar,
  Crosshair,
  Target,
  ShoppingBag,
  Flame,
  Dna,
  ShieldPlus,
  BatteryCharging,
  Layers,
  Award,
  Clock,
  Snowflake,
  LogOut,
  Terminal,
  Crown
} from 'lucide-react';
import { isDailySeed } from '../utils/seed';
import { soundManager } from '../utils/audio';

interface InventoryHUDProps {
  sector: number;
  shields: number;
  maxShields: number;
  credits: number;
  totalMines: number;
  flagsPlaced: number;
  equippedRelics: Item[];
  gadgets: Item[];
  activeTool: ActiveGadgetTool;
  disguiseMode: DisguiseMode;
  smileyState?: 'normal' | 'anxious' | 'hit' | 'dead' | 'win';
  isMuted: boolean;
  isStealthAudio: boolean;
  currentSeed: string;
  maxRelicSlots?: number;
  aegisUsed?: boolean;
  onSelectTool: (tool: ActiveGadgetTool) => void;
  onUseInstantGadget: (gadgetId: string) => void;
  onChangeDisguise: (mode: DisguiseMode) => void;
  onToggleSound: () => void;
  onToggleStealthAudio: () => void;
  onTriggerBossKey: () => void;
  onOpenRules: () => void;
  onOpenSeedModal: () => void;
  onExitToMenu?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Compass,
  Zap,
  TrendingUp,
  Coins,
  Sparkles,
  ShieldCheck,
  Activity,
  Eye,
  Cpu,
  RefreshCw,
  Percent,
  ShieldAlert,
  Radar,
  Wrench,
  Radio,
  Scan,
  HeartPulse,
  Crosshair,
  Target,
  ShoppingBag,
  Flame,
  Dna,
  ShieldPlus,
  BatteryCharging,
  Layers,
  Award,
  Clock,
  Snowflake
};

// Retro 7-segment digital display formatter (3 digits, e.g. 010, -05)
const formatDigitalLED = (num: number): string => {
  if (num < 0) {
    return '-' + Math.abs(num).toString().padStart(2, '0');
  }
  return Math.min(999, Math.max(0, num)).toString().padStart(3, '0');
};

export const InventoryHUD: React.FC<InventoryHUDProps> = ({
  sector,
  shields,
  maxShields,
  credits,
  totalMines,
  flagsPlaced,
  equippedRelics,
  gadgets,
  activeTool,
  disguiseMode,
  smileyState = 'normal',
  isMuted,
  isStealthAudio,
  currentSeed,
  maxRelicSlots = 5,
  aegisUsed = false,
  onSelectTool,
  onUseInstantGadget,
  onChangeDisguise,
  onToggleSound,
  onToggleStealthAudio,
  onTriggerBossKey,
  onOpenRules,
  onOpenSeedModal,
  onExitToMenu
}) => {
  const [hoveredRelic, setHoveredRelic] = useState<Item | null>(null);
  const isClassic = disguiseMode === 'classic';

  const threatsRemaining = totalMines - flagsPlaced;

  // Classic Win95 smiley status
  const getSmileyFace = () => {
    if (smileyState === 'dead' || shields <= 0) return '😵';
    if (smileyState === 'hit') return '💥';
    if (smileyState === 'anxious') return '😮';
    if (smileyState === 'win' || threatsRemaining === 0) return '😎';
    if (shields === 1) return '😬';
    return '🙂';
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-1.5 select-none mb-1">
      {/* CLASSIC WINDOWS 95 TITLE BAR & MENU */}
      {isClassic && (
        <div className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-sm">
          <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-2 py-0.5 text-white flex items-center justify-between font-bold text-xs">
            <div className="flex items-center gap-1.5">
              <span>💣</span>
              <span>Minesweeper Roguelike — Sector {sector}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onTriggerBossKey}
                className="w-4 h-3.5 bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-[#808080] border-b-[#808080] flex items-center justify-center text-[9px] font-bold font-mono active:border-t-[#808080] active:border-l-[#808080]"
                title="Minimize (Panic Key)"
              >
                _
              </button>
              <button
                type="button"
                onClick={onOpenRules}
                className="w-4 h-3.5 bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-[#808080] border-b-[#808080] flex items-center justify-center text-[9px] font-bold font-mono active:border-t-[#808080] active:border-l-[#808080]"
                title="Help Manual"
              >
                ?
              </button>
              <button
                type="button"
                onClick={onTriggerBossKey}
                className="w-4 h-3.5 bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-[#808080] border-b-[#808080] flex items-center justify-center text-[9px] font-bold font-mono active:border-t-[#808080] active:border-l-[#808080]"
                title="Panic Exit"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 py-0.5 text-xs text-black border-b border-[#808080] bg-[#c0c0c0]">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                type="button"
                onClick={onOpenRules}
                className="px-1 hover:bg-[#000080] hover:text-white rounded-none cursor-pointer"
              >
                <u>H</u>elp
              </button>
              {onExitToMenu && (
                <>
                  <span className="text-slate-500">|</span>
                  <button
                    type="button"
                    onClick={onExitToMenu}
                    className="px-1 hover:bg-[#000080] hover:text-white rounded-none cursor-pointer font-bold text-red-900"
                    title="Exit current sweep to Main Menu"
                  >
                    <u>E</u>xit to HQ
                  </button>
                </>
              )}
              <span className="text-slate-500">|</span>
              <button
                type="button"
                onClick={onOpenSeedModal}
                className="px-1 hover:bg-[#000080] hover:text-white rounded-none cursor-pointer font-mono flex items-center gap-1"
                title="View / Copy / Configure Run Seed"
              >
                <u>S</u>eed: <span className="font-bold">{currentSeed}</span>
                {isDailySeed(currentSeed) && <span className="text-[10px] text-blue-900 font-sans font-bold">(Daily)</span>}
              </button>
              <span className="text-slate-500 hidden sm:inline">|</span>
              <span className="text-[11px] text-slate-700 hidden sm:inline">Sector Tier: {Math.min(4, Math.ceil(sector / 2))}</span>
            </div>

            {/* Quick theme & sound toggle in classic bar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChangeDisguise('minimal')}
                className="px-1.5 py-0.5 text-[10px] bg-[#c0c0c0] border border-t-white border-l-white border-r-[#808080] border-b-[#808080] hover:bg-slate-200 active:border-t-[#808080] active:border-l-[#808080]"
                title="Switch to Hacker Theme"
              >
                Switch to Hacker Theme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP PRIMARY STATUS BAR */}
      <div
        className={`px-3 py-2 transition-colors ${
          isClassic
            ? 'bg-[#c0c0c0] border-3 border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-[2px_2px_0px_#000000]'
            : 'bg-black/90 border border-emerald-500/30 text-emerald-400 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.15)]'
        }`}
      >
        {isClassic ? (
          /* CLASSIC WIN95 SUNKEN INSET SCOREBOARD */
          <div className="p-2 bg-[#c0c0c0] border-3 border-t-[#808080] border-l-[#808080] border-r-white border-b-white flex items-center justify-between gap-4">
            {/* Left LED: Threat Counter */}
            <div className="flex items-center gap-2">
              <div
                className="bg-black text-red-600 font-mono font-bold text-2xl tracking-widest px-2 py-0.5 border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white shadow-inner select-none"
                title="Threats Remaining"
              >
                {formatDigitalLED(threatsRemaining)}
              </div>
              <div className="hidden sm:flex flex-col text-[10px] font-bold text-slate-700 uppercase">
                <span>Threats</span>
                <span>Active</span>
              </div>
            </div>

            {/* Center: Iconic Yellow Smiley Button */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                className="w-10 h-10 sm:w-11 sm:h-11 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white flex items-center justify-center text-2xl select-none transition-transform"
                title="Status Smile"
              >
                <span>{getSmileyFace()}</span>
              </button>
            </div>

            {/* Right: Credits LED & Shields */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: maxShields }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3.5 h-4 border ${
                        i < shields
                          ? 'bg-emerald-600 border-black'
                          : 'bg-slate-400 border-[#808080]'
                      }`}
                      title={`Shield Plate ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="text-[10px] font-bold text-slate-700 uppercase tracking-tighter">
                  Armor: {shields}/{maxShields}
                </div>
              </div>

              <div
                className="bg-black text-red-600 font-mono font-bold text-2xl tracking-widest px-2 py-0.5 border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white shadow-inner select-none"
                title="Credits Available"
              >
                {formatDigitalLED(credits)}
              </div>
            </div>
          </div>
        ) : (
          /* HACKER CYBER STATUS BAR */
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono">
            {/* Title & Sector */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                <span className="text-sm font-extrabold text-emerald-300 tracking-wider">
                  SEC_{sector.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] text-emerald-500/80 border border-emerald-500/30 px-1.5 py-0.2 rounded bg-emerald-950/40">
                  T{Math.min(4, Math.ceil(sector / 2))}
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenSeedModal}
                className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer bg-emerald-950/40 hover:bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-500/30"
                title="Mission Seed"
              >
                <Key className="w-2.5 h-2.5 text-emerald-400" />
                <span>{currentSeed}</span>
              </button>
            </div>

            {/* Meters: Shields, Credits, Threats */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              {/* Shields */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase text-emerald-500/70 font-bold">ARMOR:</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: maxShields }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3.5 h-4 rounded-[2px] flex items-center justify-center transition-all ${
                        i < shields
                          ? 'bg-emerald-500/30 border border-emerald-400 text-emerald-300 shadow-[0_0_6px_rgba(52,211,153,0.5)]'
                          : 'bg-black border border-zinc-800 text-zinc-700'
                      }`}
                      title={`Armor Plate ${i + 1}`}
                    >
                      <Shield className="w-2 h-2" />
                    </div>
                  ))}
                  <span className="text-[11px] font-bold text-emerald-300 ml-0.5">
                    {shields}/{maxShields}
                  </span>
                </div>
              </div>

              {/* Credits */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase text-emerald-500/70 font-bold">CREDITS:</span>
                <span className="font-bold text-sm text-lime-400 tabular-nums drop-shadow-[0_0_6px_rgba(190,242,100,0.6)]">
                  {credits} CR
                </span>
              </div>

              {/* Threat Neutralization */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase text-emerald-500/70 font-bold">MINES:</span>
                <span className="text-xs font-bold tabular-nums text-rose-400">
                  {flagsPlaced}<span className="text-emerald-600 font-normal">/</span>{totalMines}
                </span>
              </div>
            </div>

            {/* Right Controls: Theme Toggle & Sound */}
            <div className="flex items-center gap-1.5">
              {/* Theme Picker */}
              <div className="flex items-center bg-black/60 p-0.5 rounded-lg border border-emerald-900/60 text-xs">
                <button
                  type="button"
                  onClick={() => onChangeDisguise('minimal')}
                  className="px-2 py-0.5 rounded transition-colors text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                  title="Dark Green & Black Hacker Terminal"
                >
                  <Terminal className="w-2.5 h-2.5 inline mr-1" />
                  Hacker
                </button>
                <button
                  type="button"
                  onClick={() => onChangeDisguise('classic')}
                  className="px-2 py-0.5 rounded transition-colors text-[10px] text-zinc-500 hover:text-zinc-300"
                  title="Old Classical Minesweeper Theme"
                >
                  <Monitor className="w-2.5 h-2.5 inline mr-1" />
                  '95
                </button>
              </div>

              {/* Sound Controls */}
              <div className="flex items-center bg-black/60 p-0.5 rounded-lg border border-emerald-900/60 text-xs">
                <button
                  type="button"
                  onClick={onToggleSound}
                  className={`p-1 rounded transition-colors ${
                    isMuted ? 'text-zinc-600 hover:text-zinc-400' : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                  title={isMuted ? 'Sound Muted' : 'Sound Enabled'}
                >
                  {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onClick={onToggleStealthAudio}
                  className={`px-1.5 py-0.5 text-[9px] rounded transition-colors font-medium ${
                    isStealthAudio ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Stealth Office Click Mode"
                >
                  Clicks
                </button>
              </div>

              {/* Manual */}
              <button
                type="button"
                onClick={onOpenRules}
                className="p-1 bg-black hover:bg-emerald-950/50 text-emerald-400 rounded-lg border border-emerald-900/60 transition-colors cursor-pointer"
                title="Field Manual"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>

              {/* Exit to Main Menu */}
              {onExitToMenu && (
                <button
                  type="button"
                  onClick={onExitToMenu}
                  className="p-1 bg-black hover:bg-rose-950/60 text-zinc-500 hover:text-rose-300 rounded-lg border border-emerald-900/60 hover:border-rose-500/50 transition-colors cursor-pointer"
                  title="Exit to Main Menu"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Boss Key */}
              <button
                type="button"
                onClick={onTriggerBossKey}
                className="flex items-center gap-1 px-2 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-lg text-[10px] font-bold border border-rose-700/60 transition-all cursor-pointer shadow-[0_0_6px_rgba(244,63,94,0.3)]"
                title="Instant Camouflage Panic Screen [Esc]"
              >
                <EyeOff className="w-3 h-3" />
                <span className="hidden sm:inline">ESC</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SECONDARY SECTION: ACTIVE GADGETS & EQUIPPED RELICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Gadget Tools Row */}
        <div
          className={`p-2 transition-colors flex flex-col justify-between ${
            isClassic
              ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black shadow-xs'
              : 'bg-black/85 border border-emerald-900/60 text-emerald-300 rounded-xl'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1 font-mono">
            <span
              className={`uppercase tracking-wider text-[10px] font-bold ${
                isClassic ? 'text-slate-800' : 'text-emerald-400'
              }`}
            >
              Hardware Tooling
            </span>
            <span className={`text-[10px] ${isClassic ? 'text-slate-600' : 'text-emerald-600'}`}>
              Click or [1-5] to arm
            </span>
          </div>

          {gadgets.length === 0 ? (
            <div className="text-[11px] text-zinc-500 italic py-0.5">
              No gadgets equipped. Acquire Sonar, Defusers, or EMPs between sectors.
            </div>
          ) : (
            <div className="flex items-center gap-1.5 flex-wrap">
              {gadgets.map((gadget, index) => {
                const IconComponent = ICON_MAP[gadget.icon] || Wrench;
                const isSelected =
                  (gadget.id === 'sonar_scanner' && activeTool === 'sonar') ||
                  (gadget.id === 'mine_defuser' && activeTool === 'defuse') ||
                  (gadget.id === 'xray_sensor' && activeTool === 'xray') ||
                  (gadget.id === 'cross_laser' && activeTool === 'cross_laser') ||
                  (gadget.id === 'orbital_railgun' && activeTool === 'railgun');

                const isTargetingTool = ['sonar_scanner', 'mine_defuser', 'xray_sensor', 'cross_laser', 'orbital_railgun'].includes(gadget.id);

                const isLegendary = gadget.rarity === 'legendary';

                return (
                  <button
                    type="button"
                    key={gadget.id}
                    onClick={() => {
                      if (isTargetingTool) {
                        if (gadget.id === 'sonar_scanner') {
                          onSelectTool(activeTool === 'sonar' ? 'none' : 'sonar');
                        } else if (gadget.id === 'mine_defuser') {
                          onSelectTool(activeTool === 'defuse' ? 'none' : 'defuse');
                        } else if (gadget.id === 'xray_sensor') {
                          onSelectTool(activeTool === 'xray' ? 'none' : 'xray');
                        } else if (gadget.id === 'cross_laser') {
                          onSelectTool(activeTool === 'cross_laser' ? 'none' : 'cross_laser');
                        } else if (gadget.id === 'orbital_railgun') {
                          onSelectTool(activeTool === 'railgun' ? 'none' : 'railgun');
                        }
                      } else {
                        onUseInstantGadget(gadget.id);
                      }
                    }}
                    onMouseEnter={() => {
                      if (isLegendary) soundManager.playLegendaryShimmer();
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1 text-xs font-mono font-medium transition-all cursor-pointer ${
                      isClassic
                        ? isSelected
                          ? 'bg-[#a0a0a0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white font-bold text-black'
                          : isLegendary
                          ? 'bg-[#dfd09f] border-2 border-t-[#fff8d4] border-l-[#fff8d4] border-r-[#7d6015] border-b-[#7d6015] font-bold text-[#362604]'
                          : 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-black'
                        : isSelected
                        ? isLegendary
                          ? 'bg-amber-500 text-black border border-amber-200 ring-2 ring-amber-400/80 rounded-lg font-bold shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                          : 'bg-emerald-600 text-black border border-emerald-300 ring-2 ring-emerald-400/80 rounded-lg font-bold shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                        : isLegendary
                        ? 'bg-amber-950/60 hover:bg-amber-950/90 border-2 border-amber-400/80 hover:border-amber-300 text-amber-200 rounded-lg shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                        : 'bg-zinc-950/80 hover:bg-emerald-950/60 border border-emerald-900/50 hover:border-emerald-600/70 text-emerald-300 rounded-lg'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${
                      isClassic
                        ? 'text-black'
                        : isSelected
                        ? 'text-black'
                        : isLegendary
                        ? 'text-amber-300'
                        : 'text-emerald-400'
                    }`} />
                    <span className="text-[11px] font-semibold flex items-center gap-1">
                      {isLegendary && <Crown className="w-2.5 h-2.5 text-amber-400 inline" />}
                      {gadget.name}
                    </span>
                    <span
                      className={`px-1 rounded text-[10px] font-mono font-bold ${
                        isClassic
                          ? 'bg-black text-amber-300'
                          : isSelected
                          ? 'bg-black/30 text-black'
                          : isLegendary
                          ? 'bg-amber-950 text-amber-300 border border-amber-500'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {gadget.charges}x
                    </span>
                    <span className={`text-[10px] ${isLegendary && !isSelected ? 'text-amber-400/70' : 'text-zinc-500'}`}>[{index + 1}]</span>
                  </button>
                );
              })}

              {activeTool !== 'none' && (
                <button
                  type="button"
                  onClick={() => onSelectTool('none')}
                  className="text-xs text-rose-400 hover:text-rose-300 underline ml-1 font-mono font-bold"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>

        {/* Equipped Passive Relics */}
        <div
          className={`p-2 transition-colors flex flex-col justify-between relative z-30 ${
            isClassic
              ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black shadow-xs'
              : 'bg-black/85 border border-emerald-900/60 text-emerald-300 rounded-xl'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1 font-mono">
            <span
              className={`uppercase tracking-wider text-[10px] font-bold ${
                isClassic ? 'text-slate-800' : 'text-emerald-400'
              }`}
            >
              Daemon Subroutines ({equippedRelics.filter(r => r.edition !== 'ghost').length}/{maxRelicSlots} Slots)
            </span>
            <span className={`text-[10px] ${isClassic ? 'text-slate-600' : 'text-emerald-600'}`}>
              Hover for telemetry
            </span>
          </div>

          {equippedRelics.length === 0 ? (
            <div className="text-[11px] text-zinc-500 italic py-0.5">
              No relics equipped yet. Purchase passives at the Inter-Sector Shop.
            </div>
          ) : (
            <div className="flex items-center gap-1.5 flex-wrap">
              {equippedRelics.map((relic, index) => {
                const IconComponent = ICON_MAP[relic.icon] || Sparkles;
                const isGhost = relic.edition === 'ghost';
                const isPrism = relic.edition === 'prism';
                const isGlitched = relic.edition === 'glitched';
                const isOverclocked = relic.edition === 'overclocked';
                const isLegendary = relic.rarity === 'legendary';
                const isRare = relic.rarity === 'rare';
                const isThisHovered = hoveredRelic?.id === relic.id;

                // Smart horizontal positioning so tooltip doesn't clip screen edges
                const isFirst = index === 0;
                const isLast = index === equippedRelics.length - 1 && equippedRelics.length > 1;
                const alignmentClasses = isFirst
                  ? 'left-0'
                  : isLast
                  ? 'right-0'
                  : 'left-1/2 -translate-x-1/2';
                const arrowClasses = isFirst
                  ? 'left-3'
                  : isLast
                  ? 'right-3'
                  : 'left-1/2 -translate-x-1/2';

                return (
                  <div
                    key={relic.id}
                    onMouseEnter={() => {
                      setHoveredRelic(relic);
                      if (isLegendary) soundManager.playLegendaryShimmer();
                    }}
                    onMouseLeave={() => setHoveredRelic(null)}
                    className={`p-1.5 transition-all cursor-pointer relative ${
                      isThisHovered ? 'z-50' : 'z-10'
                    } ${
                      isClassic
                        ? isLegendary
                          ? 'bg-[#dfd09f] border-2 border-t-[#fff8d4] border-l-[#fff8d4] border-r-[#7d6015] border-b-[#7d6015] text-[#362604]'
                          : isRare
                          ? 'bg-[#d0dbe8] border-2 border-t-[#f2f7fc] border-l-[#f2f7fc] border-r-[#4a6382] border-b-[#4a6382] text-[#0f2842]'
                          : 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black hover:bg-slate-200'
                        : isGhost
                        ? 'rounded-lg bg-emerald-950/80 border border-emerald-400 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                        : isPrism
                        ? 'rounded-lg bg-gradient-to-r from-emerald-950/90 via-teal-950/80 to-lime-950/90 border border-emerald-300 text-emerald-200 shadow-[0_0_8px_rgba(110,231,183,0.5)]'
                        : isGlitched
                        ? 'rounded-lg bg-cyan-950/80 border border-cyan-400 text-cyan-200 shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                        : isOverclocked
                        ? 'rounded-lg bg-amber-950/80 border border-amber-400 text-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : isLegendary
                        ? 'rounded-lg bg-amber-950/80 border-2 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.55)] hover:border-amber-300'
                        : isRare
                        ? 'rounded-lg bg-cyan-950/80 border border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.35)] hover:border-cyan-300'
                        : 'rounded-lg bg-zinc-950 border border-emerald-900/60 text-emerald-400 hover:border-emerald-500'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    {relic.edition && relic.edition !== 'standard' && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                    {isLegendary && (!relic.edition || relic.edition === 'standard') && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                    )}

                    {/* Popover anchored directly UNDER this specific relic */}
                    {isThisHovered && (
                      <div
                        className={`absolute top-full ${alignmentClasses} mt-2 w-72 sm:w-80 p-3 text-xs shadow-2xl z-50 pointer-events-none transition-all ${
                          isClassic
                            ? isLegendary
                              ? 'bg-[#dfd09f] border-2 border-t-[#fff8d4] border-l-[#fff8d4] border-r-[#7d6015] border-b-[#7d6015] text-[#362604] shadow-[3px_3px_0px_#000000]'
                              : isRare
                              ? 'bg-[#d0dbe8] border-2 border-t-[#f2f7fc] border-l-[#f2f7fc] border-r-[#4a6382] border-b-[#4a6382] text-[#0f2842] shadow-[3px_3px_0px_#000000]'
                              : 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black text-black shadow-[3px_3px_0px_#000000]'
                            : isLegendary
                            ? 'rounded-xl bg-slate-950/95 backdrop-blur-md border-2 border-amber-400/90 text-amber-100 shadow-[0_0_30px_rgba(245,158,11,0.45)] ring-1 ring-amber-400/30'
                            : isRare
                            ? 'rounded-xl bg-slate-950/95 backdrop-blur-md border border-cyan-400/80 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                            : 'rounded-xl bg-slate-950/95 backdrop-blur-md border border-emerald-500/80 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                        }`}
                      >
                        {/* Upward indicator arrow pointing at the relic icon above */}
                        <div
                          className={`absolute bottom-full ${arrowClasses} w-0 h-0 border-x-[5px] border-x-transparent border-b-[6px] ${
                            isClassic
                              ? isLegendary ? 'border-b-[#7d6015]' : isRare ? 'border-b-[#4a6382]' : 'border-b-black'
                              : isLegendary ? 'border-b-amber-400' : isRare ? 'border-b-cyan-400' : 'border-b-emerald-500'
                          }`}
                        />

                        {/* Top-right & bottom-left tech brackets for legendaries */}
                        {!isClassic && isLegendary && (
                          <>
                            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-400 rounded-tr-md" />
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-400 rounded-bl-md" />
                          </>
                        )}

                        <div className="flex items-center justify-between mb-1.5 font-mono">
                          <div className="flex items-center gap-1.5">
                            {isLegendary && <Crown className="w-3.5 h-3.5 text-amber-400 inline shrink-0" />}
                            <span className={`font-black text-sm tracking-tight ${
                              isClassic
                                ? isLegendary ? 'text-[#483303]' : isRare ? 'text-[#0a2340]' : 'text-blue-900'
                                : isLegendary
                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300'
                                : isRare
                                ? 'text-cyan-200'
                                : 'text-emerald-300'
                            }`}>
                              {relic.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {relic.edition && relic.edition !== 'standard' && (
                              <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-500">
                                {relic.edition === 'ghost' ? 'GHOST DAEMON (0 SLOTS)' : relic.edition}
                              </span>
                            )}
                            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                              isClassic
                                ? isLegendary
                                ? 'bg-[#7d6015] text-[#fff8d4] border border-[#4d3b0c]'
                                : isRare
                                ? 'bg-[#294c74] text-[#e0efff] border border-[#142940]'
                                : 'text-slate-700'
                                : isLegendary
                                ? 'bg-gradient-to-r from-amber-500/25 to-yellow-500/30 text-amber-300 border border-amber-400/70 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                                : isRare
                                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/60 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                                : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                            }`}>
                              {isLegendary ? '★ LEGENDARY' : isRare ? '◆ RARE' : 'COMMON'}
                            </span>
                          </div>
                        </div>

                        <p className={`leading-relaxed mb-1.5 text-xs whitespace-normal text-left ${
                          isClassic
                            ? isLegendary ? 'text-[#362604]' : isRare ? 'text-[#122e4d]' : 'text-slate-800'
                            : isLegendary ? 'text-amber-100/90' : isRare ? 'text-cyan-100/90' : 'text-zinc-300'
                        }`}>{relic.description}</p>

                        {relic.id === 'hull_reinforcement' && (
                          <div className={`mt-2 p-1.5 rounded font-mono text-[10px] flex items-center gap-1.5 text-left ${
                            !aegisUsed
                              ? 'bg-emerald-950/90 border border-emerald-400 text-emerald-300 font-bold shadow-[0_0_10px_rgba(52,211,153,0.35)]'
                              : 'bg-zinc-950 border border-zinc-800 text-zinc-500'
                          }`}>
                            <Shield className={`w-3.5 h-3.5 shrink-0 ${!aegisUsed ? 'text-emerald-400 animate-pulse' : 'text-zinc-600'}`} />
                            <span>
                              {!aegisUsed
                                ? '● SECOND CHANCE READY: Prevents fatal breach at 0 shields!'
                                : '○ SECOND CHANCE DISCHARGED (Hull capacity +1 retained)'}
                            </span>
                          </div>
                        )}

                        {relic.flavorText && (
                          <p className={`text-[10px] italic mt-1.5 text-left ${
                            isLegendary ? 'text-amber-300/60' : isRare ? 'text-cyan-400/60' : 'text-zinc-500'
                          }`}>&ldquo;{relic.flavorText}&rdquo;</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
