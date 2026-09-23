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
  Layers
} from 'lucide-react';
import { isDailySeed } from '../utils/seed';

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
  onSelectTool: (tool: ActiveGadgetTool) => void;
  onUseInstantGadget: (gadgetId: string) => void;
  onChangeDisguise: (mode: DisguiseMode) => void;
  onToggleSound: () => void;
  onToggleStealthAudio: () => void;
  onTriggerBossKey: () => void;
  onOpenRules: () => void;
  onOpenSeedModal: () => void;
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
  Layers
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
  onSelectTool,
  onUseInstantGadget,
  onChangeDisguise,
  onToggleSound,
  onToggleStealthAudio,
  onTriggerBossKey,
  onOpenRules,
  onOpenSeedModal
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
    <div className="w-full max-w-4xl flex flex-col gap-3 select-none mb-3">
      {/* CLASSIC WINDOWS 95 TITLE BAR & MENU */}
      {isClassic && (
        <div className="bg-[#c0c0c0] border-3 border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-sm">
          <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-2 py-1 text-white flex items-center justify-between font-bold text-xs">
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
                title="Switch to Minimalist Theme"
              >
                Switch to Minimal Theme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP PRIMARY STATUS BAR */}
      <div
        className={`p-3 sm:p-4 transition-colors ${
          isClassic
            ? 'bg-[#c0c0c0] border-4 border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-[2px_2px_0px_#000000]'
            : 'bg-slate-900/90 border border-slate-800 text-slate-100 rounded-2xl shadow-xl'
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
          /* MINIMALIST MODERN STATUS BAR */
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Title & Sector */}
            <div className="flex items-center gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium flex items-center gap-2">
                  <span>Deep Sector Audit</span>
                  <button
                    type="button"
                    onClick={onOpenSeedModal}
                    className="inline-flex items-center gap-1 text-[10px] font-mono text-indigo-300 hover:text-indigo-200 transition-colors cursor-pointer bg-slate-800/80 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700/60"
                    title="Click to view or copy Mission Seed"
                  >
                    <Key className="w-2.5 h-2.5 text-indigo-400" />
                    <span>{currentSeed}</span>
                    {isDailySeed(currentSeed) && (
                      <span className="text-[9px] text-amber-300 font-bold bg-amber-500/20 px-1 rounded">Daily</span>
                    )}
                  </button>
                </div>
                <div className="text-lg font-bold flex items-center gap-2 text-white">
                  <span>Sector {sector}</span>
                  <span className="text-[11px] font-normal text-slate-400 border border-slate-700/60 px-2 py-0.5 rounded-full">
                    Tier {Math.min(4, Math.ceil(sector / 2))}
                  </span>
                </div>
              </div>
            </div>

            {/* Meters: Shields, Credits, Threats */}
            <div className="flex items-center gap-5 sm:gap-7 flex-wrap">
              {/* Shields */}
              <div className="flex flex-col">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1 font-medium">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span>Armor</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: maxShields }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-5 rounded-md flex items-center justify-center transition-all ${
                        i < shields
                          ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400'
                          : 'bg-slate-800/40 border border-slate-700/50 text-slate-600'
                      }`}
                      title={`Armor Plate ${i + 1}`}
                    >
                      <Shield className="w-2.5 h-2.5" />
                    </div>
                  ))}
                  <span className="text-xs font-mono font-bold ml-1 text-slate-200">
                    {shields}/{maxShields}
                  </span>
                </div>
              </div>

              {/* Credits */}
              <div className="flex flex-col">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1 font-medium">
                  <Coins className="w-3 h-3 text-amber-400" />
                  <span>Credits</span>
                </div>
                <div className="flex items-center gap-1 font-bold font-mono text-base text-amber-300">
                  <span className="tabular-nums">{credits}</span>
                  <span className="text-[11px] text-amber-400/60 font-normal">CR</span>
                </div>
              </div>

              {/* Threat Neutralization */}
              <div className="flex flex-col">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1 font-medium">
                  <Flag className="w-3 h-3 text-rose-400" />
                  <span>Threats</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-base">
                  <span className="font-bold tabular-nums text-rose-400">{flagsPlaced}</span>
                  <span className="text-slate-500 text-xs">/</span>
                  <span className="text-slate-400 tabular-nums">{totalMines}</span>
                </div>
              </div>
            </div>

            {/* Right Controls: Theme Toggle & Sound */}
            <div className="flex items-center gap-2">
              {/* Theme Picker: Minimal vs Classic '95 */}
              <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => onChangeDisguise('minimal')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-medium bg-slate-700 text-white shadow-sm"
                  title="Standard Minimalistic Theme"
                >
                  <Sliders className="w-3 h-3 text-sky-400" />
                  <span className="text-[11px]">Minimal</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeDisguise('classic')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-medium text-slate-400 hover:text-white"
                  title="Old Classical Minesweeper Theme"
                >
                  <Monitor className="w-3 h-3 text-amber-400" />
                  <span className="text-[11px]">Classic '95</span>
                </button>
              </div>

              {/* Sound Controls */}
              <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={onToggleSound}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isMuted ? 'text-slate-500 hover:text-slate-400' : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                  title={isMuted ? 'Sound Muted' : 'Sound Enabled'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={onToggleStealthAudio}
                  className={`px-2 py-1 text-[10px] rounded-lg transition-colors font-medium ${
                    isStealthAudio ? 'bg-slate-700 text-amber-300' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Stealth Office Click Mode"
                >
                  <Keyboard className="w-3 h-3 inline mr-1" />
                  <span>Clicks</span>
                </button>
              </div>

              {/* Manual */}
              <button
                type="button"
                onClick={onOpenRules}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
                title="Field Manual"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Boss Key */}
              <button
                type="button"
                onClick={onTriggerBossKey}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/90 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow transition-all cursor-pointer"
                title="Instant Camouflage Panic Screen [Esc]"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Panic [Esc]</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SECONDARY SECTION: ACTIVE GADGETS & EQUIPPED RELICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Gadget Tools Row */}
        <div
          className={`p-3 transition-colors flex flex-col justify-between ${
            isClassic
              ? 'bg-[#c0c0c0] border-4 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black shadow-sm'
              : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-2xl'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span
              className={`font-semibold uppercase tracking-wider text-[10px] ${
                isClassic ? 'text-slate-800 font-bold' : 'text-slate-400'
              }`}
            >
              Active Gadgets & Tools
            </span>
            <span className={`text-[11px] ${isClassic ? 'text-slate-600' : 'text-slate-500'}`}>
              Click to arm tool or use consumable
            </span>
          </div>

          {gadgets.length === 0 ? (
            <div className="text-xs text-slate-500 italic py-1">
              No gadgets equipped. Acquire Sonar, Disarm Chisels, or EMPs between sectors.
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {gadgets.map((gadget, index) => {
                const IconComponent = ICON_MAP[gadget.icon] || Wrench;
                const isSelected =
                  (gadget.id === 'sonar_scanner' && activeTool === 'sonar') ||
                  (gadget.id === 'mine_defuser' && activeTool === 'defuse') ||
                  (gadget.id === 'xray_sensor' && activeTool === 'xray') ||
                  (gadget.id === 'cross_laser' && activeTool === 'cross_laser');

                const isTargetingTool = ['sonar_scanner', 'mine_defuser', 'xray_sensor', 'cross_laser'].includes(gadget.id);

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
                        }
                      } else {
                        onUseInstantGadget(gadget.id);
                      }
                    }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium transition-all ${
                      isClassic
                        ? isSelected
                          ? 'bg-[#a0a0a0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white font-bold text-black'
                          : 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-black'
                        : isSelected
                        ? 'bg-sky-600 text-white border-sky-400 ring-2 ring-sky-500/50 rounded-xl'
                        : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isClassic ? 'text-black' : 'text-sky-400'}`} />
                    <span>{gadget.name}</span>
                    <span
                      className={`px-1 rounded text-[10px] font-mono ${
                        isClassic ? 'bg-black text-amber-300' : 'bg-slate-900/60 text-sky-300'
                      }`}
                    >
                      {gadget.charges}x
                    </span>
                    <span className="text-[10px] text-slate-500">[{index + 1}]</span>
                  </button>
                );
              })}

              {activeTool !== 'none' && (
                <button
                  type="button"
                  onClick={() => onSelectTool('none')}
                  className="text-xs text-rose-500 hover:text-rose-400 underline ml-1"
                >
                  Cancel Tool
                </button>
              )}
            </div>
          )}
        </div>

        {/* Equipped Passive Relics */}
        <div
          className={`p-3 transition-colors flex flex-col justify-between relative ${
            isClassic
              ? 'bg-[#c0c0c0] border-4 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black shadow-sm'
              : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-2xl'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span
              className={`font-semibold uppercase tracking-wider text-[10px] ${
                isClassic ? 'text-slate-800 font-bold' : 'text-slate-400'
              }`}
            >
              Equipped Relics ({equippedRelics.length})
            </span>
            <span className={`text-[11px] ${isClassic ? 'text-slate-600' : 'text-slate-500'}`}>
              Hover for synergies
            </span>
          </div>

          {equippedRelics.length === 0 ? (
            <div className="text-xs text-slate-500 italic py-1">
              No relics equipped yet. Purchase passives at the Inter-Sector Shop.
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {equippedRelics.map(relic => {
                const IconComponent = ICON_MAP[relic.icon] || Sparkles;
                return (
                  <div
                    key={relic.id}
                    onMouseEnter={() => setHoveredRelic(relic)}
                    onMouseLeave={() => setHoveredRelic(null)}
                    className={`p-1.5 transition-colors cursor-pointer ${
                      isClassic
                        ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black hover:bg-slate-200'
                        : 'rounded-xl bg-slate-800 border border-slate-700 text-indigo-300 hover:border-indigo-400'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Hover Popover for Relics */}
          {hoveredRelic && (
            <div
              className={`absolute top-full left-0 right-0 z-30 mt-1 p-3 text-xs shadow-xl ${
                isClassic
                  ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black text-black'
                  : 'rounded-xl bg-slate-900 border border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-bold text-sm ${isClassic ? 'text-blue-900' : 'text-indigo-300'}`}>
                  {hoveredRelic.name}
                </span>
                <span className="text-[10px] capitalize text-slate-500 font-mono">
                  {hoveredRelic.rarity} Relic
                </span>
              </div>
              <p className="leading-relaxed mb-1">{hoveredRelic.description}</p>
              {hoveredRelic.flavorText && (
                <p className="text-[11px] italic text-slate-500">&ldquo;{hoveredRelic.flavorText}&rdquo;</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
