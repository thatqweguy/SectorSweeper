/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shield,
  Play,
  Calendar,
  Key,
  HelpCircle,
  Sliders,
  Monitor,
  Volume2,
  VolumeX,
  Keyboard,
  EyeOff,
  Crosshair,
  Zap,
  Clock,
  Ban,
  RefreshCw,
  Copy,
  Check,
  ChevronRight,
  Terminal,
  Radio,
  Cpu,
  CornerDownLeft
} from 'lucide-react';
import { ChallengeProtocol, DisguiseMode } from '../types/game';
import { isDailySeed } from '../utils/seed';

interface MainMenuProps {
  currentSeed: string;
  selectedProtocol: ChallengeProtocol;
  disguiseMode: DisguiseMode;
  isMuted: boolean;
  isStealthAudio: boolean;
  onSelectProtocol: (protocol: ChallengeProtocol) => void;
  onStartRun: (seed?: string, protocol?: ChallengeProtocol) => void;
  onStartDailyRun: () => void;
  onOpenSeedModal: () => void;
  onOpenRules: () => void;
  onChangeDisguise: (mode: DisguiseMode) => void;
  onToggleSound: () => void;
  onToggleStealthAudio: () => void;
  onRandomizeSeed: () => void;
}

interface ProtocolInfo {
  id: ChallengeProtocol;
  name: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  threatRating: string;
  accentColor: string;
  activeBorder: string;
  activeBg: string;
  badgeText: string;
}

const PROTOCOLS: ProtocolInfo[] = [
  {
    id: 'tactical',
    name: 'Tactical Standard',
    tagline: 'Standard Operational Baseline',
    description: '3 Armor Shields · Standard hazard growth · Balanced item generation',
    icon: Shield,
    threatRating: 'NORMAL',
    accentColor: 'text-emerald-400',
    activeBorder: 'border-emerald-500/80',
    activeBg: 'bg-emerald-950/40',
    badgeText: '3 Shields'
  },
  {
    id: 'ironclad',
    name: 'Ironclad Protocol',
    tagline: 'Zero Margin for Error',
    description: '1 Maximum Shield only · Single mine detonation breaches hull',
    icon: Zap,
    threatRating: 'EXTREME',
    accentColor: 'text-rose-400',
    activeBorder: 'border-rose-500/80',
    activeBg: 'bg-rose-950/40',
    badgeText: '1 Shield Max'
  },
  {
    id: 'speedrun',
    name: 'Oxygen Rush',
    tagline: 'Timed Life-Support Drain',
    description: '75s countdown timer · Depletion costs 1 Shield · Fast-twitch deduction',
    icon: Clock,
    threatRating: 'INTENSE',
    accentColor: 'text-amber-400',
    activeBorder: 'border-amber-500/80',
    activeBg: 'bg-amber-950/40',
    badgeText: '75s Timer'
  },
  {
    id: 'zero_flag',
    name: 'Zero-Flag Protocol',
    tagline: 'Blind Hazard Sweeping',
    description: 'Manual flag deployment prohibited · Pure cognitive spatial deduction',
    icon: Ban,
    threatRating: 'HARDCORE',
    accentColor: 'text-purple-400',
    activeBorder: 'border-purple-500/80',
    activeBg: 'bg-purple-950/40',
    badgeText: 'No Flags'
  }
];

export const MainMenu: React.FC<MainMenuProps> = ({
  currentSeed,
  selectedProtocol,
  disguiseMode,
  isMuted,
  isStealthAudio,
  onSelectProtocol,
  onStartRun,
  onStartDailyRun,
  onOpenSeedModal,
  onOpenRules,
  onChangeDisguise,
  onToggleSound,
  onToggleStealthAudio,
  onRandomizeSeed
}) => {
  const [copiedSeed, setCopiedSeed] = useState(false);

  const handleCopySeed = () => {
    navigator.clipboard.writeText(currentSeed);
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 1800);
  };

  const activeProtoData = PROTOCOLS.find(p => p.id === selectedProtocol) || PROTOCOLS[0];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center py-4 px-3 sm:px-6 animate-in fade-in duration-300 font-mono text-emerald-400">
      {/* TOP TELEMETRY STRIP */}
      <div className="w-full flex flex-wrap items-center justify-between text-xs text-emerald-500/70 pb-3 border-b border-emerald-900/50 mb-5 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-emerald-300 font-bold tracking-wider">COMMAND LINK ONLINE</span>
          <span className="text-emerald-900 hidden sm:inline">|</span>
          <span className="text-emerald-600/90 hidden sm:inline text-[11px]">KERNEL_SWEEP v2.5</span>
          <span className="text-emerald-900 hidden md:inline">|</span>
          <span className="text-emerald-600/70 hidden md:inline text-[11px]">ENCRYPTION: QUANTUM_DETERMINISTIC</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Toggles */}
          <button
            type="button"
            onClick={onToggleSound}
            className="flex items-center gap-1.5 hover:text-emerald-200 transition-colors cursor-pointer px-2 py-1 rounded bg-black/60 border border-emerald-900/60"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="text-[11px]">{isMuted ? 'MUTED' : 'AUDIO ON'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleStealthAudio}
            className={`flex items-center gap-1.5 hover:text-emerald-200 transition-colors cursor-pointer px-2 py-1 rounded bg-black/60 border ${
              isStealthAudio ? 'text-amber-300 border-amber-500/50 font-bold' : 'text-emerald-500/80 border-emerald-900/60'
            }`}
            title="Toggle Office Mechanical Keyboard Audio"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="text-[11px]">CLICKS {isStealthAudio ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* BRAND HERO SECTION */}
      <div className="text-center my-3 relative w-full">
        {/* Subtle decorative emerald glow */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-96 h-32 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="inline-flex items-center gap-2 text-[11px] font-mono text-emerald-400/90 tracking-widest uppercase mb-1.5 px-3 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-800/40">
          <Crosshair className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '14s' }} />
          <span>CYBERNETIC DEDUCTIVE PROTOCOL // SUBROUTINE_DEPOT</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-2 font-mono">
          SECTOR<span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.85)]">SWEEPER</span>
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed font-sans">
          High-stakes deductive cyberspace exploration. Run daemon subroutines, deploy active defusal gadgets,
          absorb blasts with armor plating, and navigate escalating sector hazards.
        </p>
      </div>

      {/* MISSION DEPLOYMENT DECK (12-COLUMN BALANCED GRID) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 mt-4">
        {/* LEFT WING: PRIMARY LAUNCH & PROTOCOLS (7 COLS ON LARGE SCREENS) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Hero Launch Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-black/90 border border-emerald-500/40 relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-emerald-900/60">
              <div>
                <div className="text-xs font-mono text-emerald-400/80 flex items-center gap-1.5 mb-1">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>TARGET MISSION OBJECTIVE</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 flex-wrap">
                  <span>Sector 01: Training Grounds</span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                    12 Sectors + Endless Void
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onStartRun(currentSeed, selectedProtocol)}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black rounded-lg text-sm sm:text-base shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.65)] flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>LAUNCH SWEEP</span>
                <CornerDownLeft className="w-3.5 h-3.5 opacity-60 ml-0.5" />
              </button>
            </div>

            {/* Daily Challenge Alternative Strip */}
            <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px]">Today's Standardized Global Challenge Seed</span>
              </div>
              <button
                type="button"
                onClick={onStartDailyRun}
                className="w-full sm:w-auto px-3 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
              >
                <span>Deploy Daily Sweep</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mission Threat Protocol Selector */}
          <div className="p-4 sm:p-5 rounded-xl bg-black/80 border border-emerald-900/50 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Mission Threat Protocols
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400/80">
                Active: <span className="font-bold text-white">{activeProtoData.name}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PROTOCOLS.map(proto => {
                const IconComponent = proto.icon;
                const isSelected = selectedProtocol === proto.id;

                return (
                  <button
                    type="button"
                    key={proto.id}
                    onClick={() => onSelectProtocol(proto.id)}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? `${proto.activeBorder} ${proto.activeBg} ring-1 ring-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.2)] scale-[1.01]`
                        : 'border-emerald-950/70 bg-zinc-950/60 hover:bg-zinc-900/80 hover:border-emerald-800/60 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 ${isSelected ? proto.accentColor : 'text-zinc-500'}`} />
                        <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                          {proto.name}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-black text-emerald-300 border border-emerald-500/40' : 'bg-black/60 text-zinc-500 border border-zinc-800'
                      }`}>
                        {proto.badgeText}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 mb-2 leading-tight">
                      {proto.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1.5 border-t border-emerald-950/60">
                      <span>Threat: {proto.threatRating}</span>
                      <span className={isSelected ? proto.accentColor : 'text-zinc-600'}>
                        {isSelected ? '● ACTIVE PROTOCOL' : 'Select'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT WING: SEED CONSOLE, MANUAL & SHORTCUTS (5 COLS ON LARGE SCREENS) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Seed Management Console */}
          <div className="p-4 rounded-xl bg-black/80 border border-emerald-900/50 shadow-md">
            <div className="flex items-center justify-between text-xs text-emerald-400/80 mb-2 font-mono">
              <span className="flex items-center gap-1.5 font-bold text-white">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>MISSION SEED</span>
              </span>
              {isDailySeed(currentSeed) && (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                  Daily Seed
                </span>
              )}
            </div>

            <div className="p-2.5 rounded-lg bg-black border border-emerald-900/80 flex items-center justify-between mb-2.5 font-mono">
              <span className="font-extrabold text-emerald-300 text-sm tracking-wider select-all truncate mr-2">
                {currentSeed}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleCopySeed}
                  className="p-1.5 text-emerald-400/80 hover:text-white rounded hover:bg-emerald-950/50 border border-transparent hover:border-emerald-800/60 transition-colors"
                  title="Copy Seed to Clipboard"
                >
                  {copiedSeed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={onRandomizeSeed}
                  className="p-1.5 text-emerald-400/80 hover:text-white rounded hover:bg-emerald-950/50 border border-transparent hover:border-emerald-800/60 transition-colors"
                  title="Roll New Random Seed"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenSeedModal}
              className="w-full py-2 bg-zinc-950 hover:bg-zinc-900 text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-800/50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span>Custom Seed Dispatcher</span>
            </button>
          </div>

          {/* Tactical Manual Card */}
          <div className="p-4 rounded-xl bg-black/80 border border-emerald-900/50 shadow-md flex flex-col justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-1 font-mono">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>FIELD OPERATIONAL MANUAL</span>
              </div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Review all 25+ procedural relics, tactical defusal gadgets, sector hazard types, and one-click chording techniques.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenRules}
              className="w-full py-2 bg-zinc-950 hover:bg-zinc-900 text-emerald-300 font-semibold text-xs rounded-lg border border-emerald-800/50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Inspect Field Manual</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Visual Theme & Panic Switch Options */}
          <div className="p-4 rounded-xl bg-black/80 border border-emerald-900/50 shadow-md">
            <div className="text-xs font-bold text-white mb-2 flex items-center gap-1.5 font-mono">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>VISUAL CAMOUFLAGE</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeDisguise('minimal')}
                className={`p-2 rounded-lg text-xs font-mono font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  disguiseMode === 'minimal'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/80 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
                    : 'bg-black text-zinc-500 border-zinc-800 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hacker</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeDisguise('classic')}
                className={`p-2 rounded-lg text-xs font-mono font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  disguiseMode === 'classic'
                    ? 'bg-zinc-800 text-white border-amber-500/60 shadow'
                    : 'bg-black text-zinc-500 border-zinc-800 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5 text-amber-400" />
                <span>Classic '95</span>
              </button>
            </div>

            <div className="mt-2.5 pt-2 border-t border-emerald-950/60 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 text-rose-400">
                <EyeOff className="w-3 h-3" />
                <span>Panic Screen:</span>
              </span>
              <kbd className="font-mono bg-black text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/60 text-[10px]">
                [Esc] Key
              </kbd>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK TACTICAL CONTROLS FOOTER STRIP */}
      <div className="w-full mt-5 p-3 rounded-xl bg-black/70 border border-emerald-900/40 text-xs text-zinc-400 flex flex-wrap items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-[11px]">
          <span className="text-emerald-400 font-bold">TACTICAL CONTROLS:</span>
          <span><kbd className="text-emerald-300 bg-zinc-900 px-1 rounded border border-zinc-800">L-Click</kbd> Reveal / Chord</span>
          <span className="text-emerald-900">·</span>
          <span><kbd className="text-emerald-300 bg-zinc-900 px-1 rounded border border-zinc-800">R-Click</kbd> Flag Mine</span>
          <span className="text-emerald-900">·</span>
          <span><kbd className="text-emerald-300 bg-zinc-900 px-1 rounded border border-zinc-800">1, 2, 3</kbd> Gadgets</span>
          <span className="text-emerald-900">·</span>
          <span><kbd className="text-emerald-300 bg-zinc-900 px-1 rounded border border-zinc-800">Esc</kbd> Panic Screen</span>
        </div>
        <div className="text-emerald-600/80 text-[10px]">
          SECTOR SWEEPER · ROGUELIKE CORE ENGINE ONLINE
        </div>
      </div>
    </div>
  );
};
