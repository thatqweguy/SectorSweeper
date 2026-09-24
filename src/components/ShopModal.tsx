/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Item,
  SectorConfig,
  DisguiseMode,
  BoosterPack
} from '../types/game';
import {
  Coins,
  Shield,
  RefreshCw,
  ArrowRight,
  Package,
  Compass,
  Zap,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Activity,
  Eye,
  Cpu,
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
  Tag,
  LogOut,
  Trash2,
  Gift,
  HelpCircle,
  Clock,
  Snowflake,
  Crown,
  Lock,
  Unlock,
  Key,
  Check,
  Terminal
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ShopModalProps {
  currentSector: number;
  nextConfig: SectorConfig;
  shopItems: Item[];
  equippedRelics: Item[];
  gadgets: Item[];
  credits: number;
  shields: number;
  maxShields: number;
  maxRelicSlots: number;
  rerollCount: number;
  boosterPack: BoosterPack | null;
  disguiseMode: DisguiseMode;
  hasBlackMarketPass?: boolean;
  onBuyItem: (item: Item, effectiveCost: number) => void;
  onSellRelic: (relicId: string, refundCredits: number) => void;
  onBuyShieldRepair: (cost: number) => void;
  onBuyMaxShieldUpgrade: (cost: number) => void;
  onBuyRelicSlotUpgrade: (cost: number) => void;
  onOpenBoosterPack: (optionId: string, cost: number) => void;
  onRerollShop: (cost: number) => void;
  onProceedToNextSector: () => void;
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
  Clock,
  Snowflake
};

export const ShopModal: React.FC<ShopModalProps> = ({
  currentSector,
  nextConfig,
  shopItems,
  equippedRelics,
  gadgets,
  credits,
  shields,
  maxShields,
  maxRelicSlots,
  rerollCount,
  boosterPack,
  disguiseMode,
  hasBlackMarketPass = false,
  onBuyItem,
  onSellRelic,
  onBuyShieldRepair,
  onBuyMaxShieldUpgrade,
  onBuyRelicSlotUpgrade,
  onOpenBoosterPack,
  onRerollShop,
  onProceedToNextSector,
  onExitToMenu
}) => {
  const [packPhase, setPackPhase] = useState<'sealed' | 'unsealing' | 'revealed' | 'claiming'>('sealed');
  const [claimedOptionId, setClaimedOptionId] = useState<string | null>(null);
  const [cipherText, setCipherText] = useState<string>('0x7F9B_ENCRYPTED');

  useEffect(() => {
    setPackPhase('sealed');
    setClaimedOptionId(null);
  }, [boosterPack?.id]);

  const handleStartUnseal = () => {
    if (!boosterPack || credits < boosterPack.cost || packPhase !== 'sealed') return;
    setPackPhase('unsealing');
    soundManager.playPackUnseal();

    const hexChars = '0123456789ABCDEF!#*&%@$';
    const interval = setInterval(() => {
      let code = '0x';
      for (let i = 0; i < 6; i++) {
        code += hexChars[Math.floor(Math.random() * hexChars.length)];
      }
      setCipherText(code);
    }, 60);

    setTimeout(() => {
      clearInterval(interval);
      setPackPhase('revealed');
      soundManager.playPackReveal();
    }, 850);
  };

  const handleClaimOption = (optionId: string) => {
    if (packPhase !== 'revealed' || !boosterPack) return;
    setClaimedOptionId(optionId);
    setPackPhase('claiming');
    soundManager.playPackClaim();

    setTimeout(() => {
      onOpenBoosterPack(optionId, boosterPack.cost);
      setPackPhase('sealed');
      setClaimedOptionId(null);
    }, 600);
  };

  // Scaled Economics
  const repairCost = Math.min(25, 10 + currentSector);
  const maxUpgradeCost = 28 + (maxShields - 3) * 14;
  const slotUpgradeCost = 35 + (maxRelicSlots - 5) * 25;
  const baseReroll = 6;
  const rerollCost = hasBlackMarketPass ? 0 : baseReroll + rerollCount * 4;

  const isClassic = disguiseMode === 'classic';

  // Count non-ghost relics currently taking slots
  const slotConsumingRelics = equippedRelics.filter(r => r.edition !== 'ghost');
  const slotsRemaining = maxRelicSlots - slotConsumingRelics.length;

  const getItemCost = (baseCost: number) => {
    return hasBlackMarketPass ? Math.max(1, Math.round(baseCost * 0.75)) : baseCost;
  };

  const getRarityVisuals = (rarity: string) => {
    if (rarity === 'legendary') {
      return {
        card: isClassic
          ? 'bg-[#dfd09f] border-2 border-t-[#fff8d4] border-l-[#fff8d4] border-r-[#7d6015] border-b-[#7d6015] text-[#362604] shadow-[2px_2px_0px_#000000]'
          : 'bg-gradient-to-b from-amber-950/80 via-yellow-950/40 to-slate-950/95 border-2 border-amber-400/80 shadow-[0_0_24px_rgba(245,158,11,0.28)] hover:shadow-[0_0_34px_rgba(245,158,11,0.45)] hover:border-amber-300 ring-1 ring-amber-400/30 rounded-xl',
        iconBox: isClassic
          ? 'bg-[#caa54c] border-2 border-t-[#fff] border-l-[#fff] border-r-[#523d06] border-b-[#523d06] text-[#2e2003]'
          : 'bg-gradient-to-br from-amber-500/35 to-yellow-600/15 border border-amber-400/80 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.45)] rounded-lg',
        title: isClassic
          ? 'text-[#483303] font-black'
          : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-300 font-black tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]',
        desc: isClassic ? 'text-[#362604] font-medium' : 'text-amber-100/90',
        badge: isClassic
          ? 'bg-[#7d6015] text-[#fff8d4] font-bold text-[9px] uppercase px-1.5 py-0.5 border border-[#4d3b0c] font-mono tracking-wider'
          : 'bg-gradient-to-r from-amber-500/25 via-yellow-400/30 to-amber-600/25 text-amber-300 border border-amber-400/70 shadow-[0_0_10px_rgba(245,158,11,0.3)] font-mono font-black text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1',
        badgeLabel: '★ LEGENDARY',
        button: isClassic
          ? 'bg-[#dfcb8c] border-2 border-t-white border-l-white border-r-[#6e540b] border-b-[#6e540b] active:border-t-[#6e540b] active:border-l-[#6e540b] text-[#3e2b05] font-black'
          : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black shadow-[0_0_16px_rgba(245,158,11,0.45)] rounded-xl',
        equippedCard: isClassic
          ? 'bg-[#dfd09f] border-2 border-t-[#fff8d4] border-l-[#fff8d4] border-r-[#7d6015] border-b-[#7d6015] text-[#362604]'
          : 'bg-gradient-to-b from-amber-950/90 via-yellow-950/40 to-black border-2 border-amber-400/80 text-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.35)] rounded-xl hover:border-amber-300',
        equippedIcon: 'text-amber-300',
        glowAura: true
      };
    }
    if (rarity === 'rare') {
      return {
        card: isClassic
          ? 'bg-[#d0dbe8] border-2 border-t-[#f2f7fc] border-l-[#f2f7fc] border-r-[#4a6382] border-b-[#4a6382] text-[#0f2842] shadow-[2px_2px_0px_#000000]'
          : 'bg-gradient-to-b from-cyan-950/65 via-slate-900/85 to-black border border-cyan-500/60 shadow-[0_0_16px_rgba(6,182,212,0.18)] hover:border-cyan-400 hover:shadow-[0_0_24px_rgba(6,182,212,0.3)] ring-1 ring-cyan-500/15 rounded-xl',
        iconBox: isClassic
          ? 'bg-[#98b3d4] border-2 border-t-[#fff] border-l-[#fff] border-r-[#243d5c] border-b-[#243d5c] text-blue-950'
          : 'bg-cyan-950/80 border border-cyan-400/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)] rounded-lg',
        title: isClassic ? 'text-[#0a2340] font-bold' : 'text-cyan-200 font-bold tracking-tight',
        desc: isClassic ? 'text-[#122e4d]' : 'text-cyan-100/90',
        badge: isClassic
          ? 'bg-[#294c74] text-[#e0efff] font-bold text-[9px] uppercase px-1.5 py-0.5 border border-[#142940] font-mono tracking-wider'
          : 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/60 shadow-[0_0_8px_rgba(6,182,212,0.2)] font-mono font-bold text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1',
        badgeLabel: '◆ RARE',
        button: isClassic
          ? 'bg-[#bed0e3] border-2 border-t-white border-l-white border-r-[#3d5573] border-b-[#3d5573] active:border-t-[#3d5573] active:border-l-[#3d5573] text-[#0f2842] font-bold'
          : 'bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-md shadow-cyan-950/50',
        equippedCard: isClassic
          ? 'bg-[#d0dbe8] border-2 border-t-[#f2f7fc] border-l-[#f2f7fc] border-r-[#4a6382] border-b-[#4a6382] text-[#0f2842]'
          : 'bg-gradient-to-b from-cyan-950/80 to-slate-900 border border-cyan-500/70 text-cyan-200 shadow-sm rounded-xl hover:border-cyan-400',
        equippedIcon: 'text-cyan-400',
        glowAura: false
      };
    }
    // Common
    return {
      card: isClassic
        ? 'bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white text-black'
        : 'bg-slate-900/85 border border-slate-700/70 hover:border-slate-500 text-slate-300 rounded-xl shadow-xs',
      iconBox: isClassic
        ? 'bg-[#c0c0c0] border border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black'
        : 'rounded-lg bg-slate-800 border border-slate-700 text-slate-300',
      title: isClassic ? 'text-black font-bold' : 'text-slate-100 font-bold',
      desc: isClassic ? 'text-slate-800' : 'text-slate-300',
      badge: isClassic
        ? 'text-slate-700 font-medium text-[9px] uppercase font-mono'
        : 'bg-slate-800/80 text-slate-400 border border-slate-700/80 font-mono text-[9px] uppercase px-1.5 py-0.5 rounded',
      badgeLabel: 'COMMON',
      button: isClassic
        ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-black font-bold'
        : 'bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl shadow',
      equippedCard: isClassic
        ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black shadow-xs'
        : 'bg-slate-800/90 border-slate-700 hover:border-slate-500 shadow-md rounded-xl',
      equippedIcon: 'text-slate-400',
      glowAura: false
    };
  };

  const getPackOptionTheme = (actionType: string) => {
    switch (actionType) {
      case 'credit_grant':
        return {
          categoryLabel: 'FINANCIAL INJECTION',
          border: 'border-amber-500/60 hover:border-amber-400',
          bgGradient: 'from-amber-950/40 via-slate-900/90 to-slate-950',
          iconBox: 'bg-amber-950/80 border-amber-500/60 text-amber-300',
          titleColor: 'text-amber-200',
          glow: 'shadow-[0_0_18px_rgba(245,158,11,0.22)]',
          btnBg: 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black font-bold shadow-amber-900/40',
        };
      case 'shield_grant':
        return {
          categoryLabel: 'HULL REINFORCEMENT',
          border: 'border-emerald-500/60 hover:border-emerald-400',
          bgGradient: 'from-emerald-950/40 via-slate-900/90 to-slate-950',
          iconBox: 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300',
          titleColor: 'text-emerald-200',
          glow: 'shadow-[0_0_18px_rgba(16,185,129,0.22)]',
          btnBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-bold shadow-emerald-900/40',
        };
      case 'relic_slot':
        return {
          categoryLabel: 'CORTEX EXPANSION',
          border: 'border-fuchsia-500/60 hover:border-fuchsia-400',
          bgGradient: 'from-fuchsia-950/40 via-slate-900/90 to-slate-950',
          iconBox: 'bg-fuchsia-950/80 border-fuchsia-500/60 text-fuchsia-300',
          titleColor: 'text-fuchsia-200',
          glow: 'shadow-[0_0_18px_rgba(217,70,239,0.22)]',
          btnBg: 'bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold shadow-fuchsia-900/40',
        };
      case 'gadget_upgrade':
        return {
          categoryLabel: 'TACTICAL OVERCLOCK',
          border: 'border-cyan-500/60 hover:border-cyan-400',
          bgGradient: 'from-cyan-950/40 via-slate-900/90 to-slate-950',
          iconBox: 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300',
          titleColor: 'text-cyan-200',
          glow: 'shadow-[0_0_18px_rgba(6,182,212,0.22)]',
          btnBg: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-black font-bold shadow-cyan-900/40',
        };
      case 'free_repair':
      default:
        return {
          categoryLabel: 'SUBROUTINE UPGRADE',
          border: 'border-purple-500/60 hover:border-purple-400',
          bgGradient: 'from-purple-950/40 via-slate-900/90 to-slate-950',
          iconBox: 'bg-purple-950/80 border-purple-500/60 text-purple-300',
          titleColor: 'text-purple-200',
          glow: 'shadow-[0_0_18px_rgba(168,85,247,0.22)]',
          btnBg: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-purple-900/40',
        };
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return isClassic ? 'text-amber-800 font-bold' : 'text-amber-400 font-bold';
      case 'rare':
        return isClassic ? 'text-blue-800 font-bold' : 'text-emerald-400 font-semibold';
      default:
        return isClassic ? 'text-slate-700 font-medium' : 'text-zinc-400 font-medium';
    }
  };

  const getEditionBadge = (edition?: string) => {
    switch (edition) {
      case 'ghost':
        return {
          label: 'GHOST DAEMON',
          color: 'bg-emerald-950 text-emerald-300 border-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]',
          desc: '0 Slot Footprint! Runs headless.'
        };
      case 'prism':
        return {
          label: 'PRISM THREAD',
          color: 'bg-emerald-950 text-lime-300 border-lime-400 shadow-[0_0_8px_rgba(190,242,100,0.5)]',
          desc: '+50% Credits & Score Payout'
        };
      case 'glitched':
        return {
          label: 'GLITCHED BIT',
          color: 'bg-cyan-950 text-cyan-300 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]',
          desc: '+300 Bonus Score & +2 CR'
        };
      case 'overclocked':
        return {
          label: 'OVERCLOCKED',
          color: 'bg-amber-950 text-amber-300 border-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]',
          desc: '+150 Bonus Score'
        };
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div
        className={`w-full max-w-4xl shadow-2xl transition-colors my-auto ${
          isClassic
            ? 'bg-[#c0c0c0] border-4 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black p-4'
            : 'bg-black/95 border border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.15)] text-emerald-300 rounded-2xl p-4 sm:p-6'
        }`}
      >
        {/* Classic Win95 Title Header */}
        {isClassic && (
          <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-2 py-1 text-white flex items-center justify-between font-bold text-xs mb-3">
            <div className="flex items-center gap-1.5">
              <span>🛒</span>
              <span>Requisition Depot & Tactical Assembly — Sector {currentSector} Cleared</span>
            </div>
            <div className="w-4 h-3.5 bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-[#808080] border-b-[#808080] flex items-center justify-center text-[9px] font-bold font-mono">
              ✕
            </div>
          </div>
        )}

        {/* Header HUD Strip */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 ${
            isClassic ? 'border-b border-[#808080]' : 'border-b border-slate-800'
          }`}
        >
          <div>
            <div
              className={`text-xs uppercase tracking-wider font-semibold mb-0.5 ${
                isClassic ? 'text-emerald-800 font-bold' : 'text-emerald-400'
              }`}
            >
              Sector {currentSector} Audit Completed
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight font-mono">
              REQUISITION DEPOT & ARMORY
            </h2>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Relic Slots Indicator */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 ${
                isClassic
                  ? 'bg-black text-cyan-400 font-mono font-bold border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white text-xs'
                  : 'bg-slate-800/90 rounded-xl border border-slate-700 text-xs'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold tabular-nums">
                {slotConsumingRelics.length} / {maxRelicSlots}
              </span>
              <span className={isClassic ? 'text-cyan-300' : 'text-slate-400'}>Slots</span>
            </div>

            {/* Armor Plates */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 ${
                isClassic
                  ? 'bg-black text-emerald-400 font-mono font-bold border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white text-xs'
                  : 'bg-slate-800/90 rounded-xl border border-slate-700 text-xs'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold tabular-nums">
                {shields} / {maxShields}
              </span>
              <span className={isClassic ? 'text-emerald-300' : 'text-slate-400'}>Armor</span>
            </div>

            {/* Tactical Credits */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 ${
                isClassic
                  ? 'bg-black text-amber-400 font-mono font-bold border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white text-xs'
                  : 'bg-slate-800/90 rounded-xl border border-slate-700 text-xs'
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-extrabold tabular-nums text-sm text-amber-300">{credits}</span>
              <span className={isClassic ? 'text-amber-300' : 'text-slate-400'}>CR</span>
            </div>
          </div>
        </div>

        {/* ACTIVE EQUIPPED RELICS & JOKER TACTICAL TRAY (BALATRO STYLE) */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className={`text-xs font-bold uppercase tracking-wider font-mono ${
                isClassic ? 'text-slate-900 font-bold' : 'text-slate-300'
              }`}>
                Active Relic Rig ({equippedRelics.length} Equipped · {slotsRemaining} Slots Free)
              </span>
            </div>
            <span className={`text-[11px] ${isClassic ? 'text-slate-600' : 'text-slate-400'}`}>
              Click Sell (50% Refund) to free slots for new builds
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {Array.from({ length: maxRelicSlots }).map((_, index) => {
              const relic = equippedRelics[index];
              if (!relic) {
                return (
                  <div
                    key={`empty-slot-${index}`}
                    className={`h-24 rounded-xl border border-dashed flex flex-col items-center justify-center p-2 text-center select-none ${
                      isClassic
                        ? 'border-[#808080] bg-[#b0b0b0]/50 text-slate-600'
                        : 'border-slate-800 bg-slate-950/40 text-slate-600'
                    }`}
                  >
                    <Layers className="w-4 h-4 mb-1 opacity-40" />
                    <span className="text-[10px] font-mono uppercase">Slot {index + 1}</span>
                    <span className="text-[9px] opacity-60">Open</span>
                  </div>
                );
              }

              const IconComponent = ICON_MAP[relic.icon] || Sparkles;
              const refundAmount = Math.max(1, Math.round(relic.cost * 0.5));
              const editionInfo = getEditionBadge(relic.edition);
              const visuals = getRarityVisuals(relic.rarity);

              return (
                <div
                  key={relic.id}
                  onMouseEnter={() => {
                    if (relic.rarity === 'legendary') soundManager.playLegendaryShimmer();
                  }}
                  className={`h-24 rounded-xl border flex flex-col justify-between p-2 relative group transition-all overflow-hidden ${visuals.equippedCard}`}
                  title={`${relic.name}: ${relic.description}`}
                >
                  {/* Subtle top-right corner notch for legendaries */}
                  {relic.rarity === 'legendary' && !isClassic && (
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400 pointer-events-none rounded-tr-md" />
                  )}

                  <div className="flex items-start justify-between gap-1">
                    <IconComponent className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${visuals.equippedIcon}`} />
                    {editionInfo ? (
                      <span className={`text-[8px] font-mono font-bold px-1 rounded border leading-tight ${editionInfo.color}`}>
                        {editionInfo.label}
                      </span>
                    ) : (
                      <span className={`text-[8px] font-mono font-bold leading-tight ${
                        relic.rarity === 'legendary'
                          ? isClassic ? 'text-amber-900 font-black' : 'text-amber-300 font-extrabold flex items-center gap-0.5'
                          : relic.rarity === 'rare'
                          ? isClassic ? 'text-blue-900 font-bold' : 'text-cyan-300 font-bold'
                          : isClassic ? 'text-slate-700' : 'text-slate-400'
                      }`}>
                        {relic.rarity === 'legendary' && <Crown className="w-2.5 h-2.5 inline" />}
                        {relic.rarity.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className={`text-[11px] font-bold truncate leading-tight mt-0.5 ${
                    relic.rarity === 'legendary'
                      ? isClassic ? 'text-amber-950 font-black' : 'text-amber-100 font-black'
                      : relic.rarity === 'rare'
                      ? isClassic ? 'text-blue-950 font-bold' : 'text-cyan-100 font-bold'
                      : isClassic ? 'text-black' : 'text-slate-200'
                  }`} title={relic.name}>
                    {relic.name}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSellRelic(relic.id, refundAmount)}
                    className={`w-full py-1 text-[10px] font-bold rounded flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      isClassic
                        ? 'bg-[#c0c0c0] border border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-red-900 hover:bg-red-100'
                        : 'bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/60'
                    }`}
                    title={`Sell ${relic.name} for +${refundAmount} Credits`}
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    <span>Sell +{refundAmount}Cr</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* PROCEDURAL ITEMS SHELF */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold uppercase tracking-wider font-mono ${
                  isClassic ? 'text-slate-800 font-bold' : 'text-slate-300'
                }`}
              >
                Requisition Deck ({shopItems.length} Available)
              </span>
              {hasBlackMarketPass && (
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  <Tag className="w-3 h-3" />
                  <span>25% Black Market Discount</span>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => onRerollShop(rerollCost)}
              disabled={credits < rerollCost}
              className={`flex items-center gap-1.5 text-xs px-3 py-1 font-semibold transition-colors cursor-pointer ${
                isClassic
                  ? credits >= rerollCost
                    ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-black'
                    : 'bg-[#c0c0c0] border-2 border-[#808080] text-slate-500 cursor-not-allowed'
                  : credits >= rerollCost
                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-600 rounded-xl'
                  : 'bg-slate-800/40 text-slate-500 border border-slate-800 rounded-xl cursor-not-allowed'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restock Shelf ({rerollCost === 0 ? 'FREE' : `${rerollCost} Cr`})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {shopItems.map(item => {
              const IconComponent = ICON_MAP[item.icon] || Package;
              const effectiveCost = getItemCost(item.cost);
              const canAfford = credits >= effectiveCost;
              const editionInfo = getEditionBadge(item.edition);
              const visuals = getRarityVisuals(item.rarity);

              // Relic Slot Constraint
              const isRelic = item.type === 'relic';
              const isGhost = item.edition === 'ghost';
              const relicSlotBlocked = isRelic && !isGhost && slotsRemaining <= 0;

              // Gadget Max Capacity Constraint (4 max per gadget)
              const existingGadget = gadgets.find(g => g.id === item.id);
              const currentCharges = existingGadget?.charges || 0;
              const gadgetCapBlocked = !isRelic && currentCharges >= 4;

              const isBuyDisabled = !canAfford || relicSlotBlocked || gadgetCapBlocked;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => {
                    if (item.rarity === 'legendary') soundManager.playLegendaryShimmer();
                  }}
                  className={`flex flex-col justify-between p-3.5 transition-all relative overflow-hidden group ${visuals.card}`}
                >
                  {/* Modern Hacker Theme decorative tech brackets & ambient glow */}
                  {!isClassic && item.rarity === 'legendary' && (
                    <>
                      <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400 pointer-events-none rounded-tr-xl" />
                      <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400 pointer-events-none rounded-bl-xl" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/12 via-transparent to-transparent pointer-events-none rounded-xl" />
                    </>
                  )}
                  {!isClassic && item.rarity === 'rare' && (
                    <>
                      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-cyan-400/70 pointer-events-none rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-cyan-400/70 pointer-events-none rounded-bl-lg" />
                    </>
                  )}

                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2 relative z-10">
                      <div className={`p-2 transition-transform group-hover:scale-105 ${visuals.iconBox}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <div className={visuals.badge}>
                          {item.rarity === 'legendary' && <Crown className="w-2.5 h-2.5" />}
                          <span>{visuals.badgeLabel} · {item.type.toUpperCase()}</span>
                        </div>
                        {editionInfo && (
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${editionInfo.color}`}>
                            {editionInfo.label}
                          </span>
                        )}
                        {item.charges && (
                          <div className={`text-[10px] font-mono ${
                            item.rarity === 'legendary'
                              ? isClassic ? 'text-amber-900 font-bold' : 'text-amber-300/90 font-semibold'
                              : isClassic ? 'text-slate-600' : 'text-slate-400'
                          }`}>
                            +{item.charges} charges {currentCharges > 0 && `(Belt: ${currentCharges}/4)`}
                          </div>
                        )}
                      </div>
                    </div>

                    <h4 className={`text-sm mb-1 relative z-10 ${visuals.title}`}>{item.name}</h4>
                    <p className={`text-xs leading-relaxed mb-2 relative z-10 ${visuals.desc}`}>
                      {item.description}
                    </p>

                    {/* Highlighted Second Chance badge for Aegis Hardlight Core */}
                    {item.id === 'hull_reinforcement' && (
                      <div className={`mb-2 p-1.5 rounded flex items-center gap-1.5 text-[10px] font-mono font-bold relative z-10 ${
                        isClassic
                          ? 'bg-[#fff5cc] border border-[#7d6015] text-[#4d3b0c]'
                          : 'bg-emerald-950/70 border border-emerald-400/80 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                      }`}>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>SECOND CHANCE MATRIX: Prevents death at 0 Shields!</span>
                      </div>
                    )}

                    {editionInfo && (
                      <p className="text-[10px] text-pink-300 font-mono mb-2 relative z-10">
                        ★ {editionInfo.desc}
                      </p>
                    )}
                  </div>

                  <div className="relative z-10">
                    {relicSlotBlocked && (
                      <div className="text-[10px] text-rose-400 font-mono font-bold mb-1.5 text-center">
                        Relic Slots Full! Sell a relic or upgrade slots.
                      </div>
                    )}
                    {gadgetCapBlocked && (
                      <div className="text-[10px] text-amber-400 font-mono font-bold mb-1.5 text-center">
                        Gadget Belt Full (4/4 Max Charges)!
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => onBuyItem(item, effectiveCost)}
                      disabled={isBuyDisabled}
                      className={`w-full py-1.5 px-3 text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        !isBuyDisabled
                          ? visuals.button
                          : isClassic
                          ? 'bg-[#c0c0c0] border-2 border-[#808080] text-slate-500 cursor-not-allowed'
                          : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/50 rounded-xl'
                      }`}
                    >
                      <Coins className={`w-3.5 h-3.5 ${item.rarity === 'legendary' && !isBuyDisabled ? (isClassic ? 'text-amber-900' : 'text-slate-950') : 'text-amber-400'}`} />
                      {hasBlackMarketPass && effectiveCost < item.cost ? (
                        <span className="flex items-center gap-1.5">
                          <span className="line-through text-slate-400 text-[11px]">{item.cost}</span>
                          <span className="font-bold">{effectiveCost} Cr</span>
                        </span>
                      ) : (
                        <span>Buy for {effectiveCost} Cr</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BALATRO-STYLE BOOSTER PACK / SUBROUTINE CACHE */}
        {boosterPack && (
          <div className="mb-5">
            {isClassic ? (
              /* ================== CLASSIC DISGUISE RETRO ARCHIVE ================== */
              packPhase === 'sealed' ? (
                <div className="p-3 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black shadow-xs">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#808080]">
                    <div className="flex items-center gap-1.5 font-bold text-xs font-mono">
                      <Package className="w-4 h-4 text-navy-900" />
                      <span>WINMINE_ARCHIVE: {boosterPack.name}.ZIP</span>
                    </div>
                    <span className="text-xs font-bold font-mono">
                      COST: <span className="text-amber-900 font-black">{boosterPack.cost} CR</span>
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-1">
                    <p className="text-xs text-slate-800 leading-relaxed">
                      {boosterPack.tagline}. Unzip archive to inspect 3 encrypted subroutines and extract 1 permanent upgrade!
                    </p>
                    <button
                      type="button"
                      onClick={handleStartUnseal}
                      disabled={credits < boosterPack.cost}
                      className={`px-4 py-2 text-xs font-bold border-2 shrink-0 cursor-pointer ${
                        credits >= boosterPack.cost
                          ? 'bg-[#c0c0c0] border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] hover:bg-[#d4d4d4] text-black font-black'
                          : 'bg-[#c0c0c0] border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Extract Archive ({boosterPack.cost} Cr)
                    </button>
                  </div>
                </div>
              ) : packPhase === 'unsealing' ? (
                <div className="p-4 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black text-center animate-unseal-jitter shadow-xs">
                  <div className="font-bold text-xs mb-2 font-mono">
                    Extracting archive {boosterPack.name}.ZIP to C:\WINMINE\CACHE...
                  </div>
                  <div className="w-full bg-[#000080] text-lime-300 font-mono text-xs py-1.5 px-3 border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white">
                    Decompressing subroutines: 100% [ |||||||||||||||||||||||||||||||| ]
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black shadow-xs">
                  <div className="font-bold text-xs mb-2.5 pb-1.5 border-b border-[#808080] flex items-center justify-between font-mono">
                    <span className="font-black">Archive Extracted: Select 1 Upgrade to Install</span>
                    <span className="text-[11px] text-gray-700">1 of 3 Available</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {boosterPack.options.map((opt, idx) => {
                      const OptIcon = ICON_MAP[opt.icon] || Sparkles;
                      const isClaimed = claimedOptionId === opt.id;
                      const isDismissed = packPhase === 'claiming' && !isClaimed;
                      return (
                        <div
                          key={opt.id}
                          style={{ animationDelay: `${idx * 100}ms` }}
                          className={`animate-card-emerge p-2.5 border-2 flex flex-col justify-between transition-all ${
                            isClaimed
                              ? 'bg-[#dfd09f] border-t-[#808080] border-l-[#808080] border-r-white border-b-white'
                              : isDismissed
                              ? 'opacity-40 bg-[#b0b0b0] border-t-[#808080] border-l-[#808080] border-r-white border-b-white'
                              : 'bg-[#c0c0c0] border-t-white border-l-white border-r-[#808080] border-b-[#808080]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5 font-bold text-xs">
                              <div className="p-1 bg-white border border-[#808080]">
                                <OptIcon className="w-3.5 h-3.5 text-black" />
                              </div>
                              <span className="font-bold text-black">{opt.title}</span>
                            </div>
                            <p className="text-[11px] leading-relaxed mb-3 text-slate-800">
                              {opt.description}
                            </p>
                          </div>
                          <button
                            type="button"
                            disabled={packPhase === 'claiming'}
                            onClick={() => handleClaimOption(opt.id)}
                            className={`w-full py-1.5 text-xs font-bold border-2 cursor-pointer ${
                              isClaimed
                                ? 'bg-green-700 text-white border-t-[#808080] border-l-[#808080] border-r-white border-b-white font-black'
                                : isDismissed
                                ? 'bg-[#a0a0a0] text-gray-600 border-t-[#808080] border-l-[#808080] border-r-white border-b-white cursor-not-allowed'
                                : 'bg-[#c0c0c0] border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] hover:bg-gray-100 text-black font-bold'
                            }`}
                          >
                            {isClaimed ? '✓ Installing...' : 'Install Upgrade'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            ) : (
              /* ================== HACKER MODE CYBERPUNK BOOSTER PACK ================== */
              packPhase === 'sealed' ? (
                <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#140628] via-[#090b16] to-[#040810] border-2 border-purple-500/50 shadow-[0_0_35px_rgba(168,85,247,0.22)] group hover:border-purple-400/80 transition-all duration-300">
                  {/* Foil holographic diagonal sheen overlay */}
                  <div className="pointer-events-none absolute -inset-full bg-gradient-to-r from-transparent via-purple-300/10 via-cyan-300/15 via-pink-300/10 to-transparent animate-foil-sheen" />

                  {/* Cyber Grid Texture */}
                  <div className="pointer-events-none absolute inset-0 cyber-grid-pattern opacity-25" />

                  {/* Top Security Header */}
                  <div className="relative flex items-center justify-between mb-3 text-[11px] font-mono border-b border-purple-500/25 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                      <span className="font-bold text-purple-300 tracking-wider">
                        TOP_SECRET // ENCRYPTED SUBROUTINE CACHE
                      </span>
                    </div>
                    <span className="text-purple-300/90 font-mono">
                      COST: <span className="font-bold text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">{boosterPack.cost} CR</span>
                    </span>
                  </div>

                  {/* Foil Core Presentation */}
                  <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 sm:gap-4.5">
                      {/* Holographic Quantum Core Emblem */}
                      <div className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-purple-900/80 via-slate-950 to-indigo-950 border border-purple-400/60 flex items-center justify-center animate-holo-pulse shadow-[0_0_22px_rgba(168,85,247,0.45)]">
                        <div
                          className="absolute inset-1 rounded-lg border border-dashed border-purple-400/40 animate-spin"
                          style={{ animationDuration: '16s' }}
                        />
                        <Gift className="w-7 h-7 text-purple-200 drop-shadow-[0_0_10px_rgba(216,180,254,0.9)]" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm sm:text-base font-black text-white font-mono tracking-wider drop-shadow-[0_0_10px_rgba(192,132,252,0.6)]">
                            {boosterPack.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-purple-950/90 text-purple-300 border border-purple-500/50 shadow-sm">
                            3 ENHANCEMENTS
                          </span>
                        </div>
                        <p className="text-xs text-purple-200/90 font-mono mb-1">
                          {boosterPack.tagline}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Unseal and decrypt to reveal 3 confidential enhancements. Claim 1 permanent modification!
                        </p>
                      </div>
                    </div>

                    {/* Big Action Button */}
                    <div className="shrink-0 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={handleStartUnseal}
                        disabled={credits < boosterPack.cost}
                        className={`w-full md:w-auto px-6 py-3 text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                          credits >= boosterPack.cost
                            ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_24px_rgba(168,85,247,0.5)] hover:shadow-[0_0_36px_rgba(168,85,247,0.85)] hover:scale-[1.02] active:scale-95 border border-purple-400/60'
                            : 'bg-slate-900/90 text-slate-500 border border-slate-800 cursor-not-allowed'
                        }`}
                      >
                        {credits >= boosterPack.cost ? (
                          <>
                            <Unlock className="w-4 h-4 text-purple-200 animate-pulse" />
                            <span>DECRYPT & UNSEAL ({boosterPack.cost} CR)</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 text-slate-600" />
                            <span>LOCKED ({boosterPack.cost} CR REQUIRED)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : packPhase === 'unsealing' ? (
                <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-[#1c0836] via-[#090b16] to-[#040810] border-2 border-cyan-400/80 shadow-[0_0_40px_rgba(56,189,248,0.4)] animate-unseal-jitter">
                  {/* Horizontal Laser Slicing Beam */}
                  <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-300 via-purple-300 to-transparent animate-laser-cut shadow-[0_0_24px_#38bdf8]" />

                  <div className="relative flex flex-col items-center justify-center text-center py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal className="w-4 h-4 text-cyan-400 animate-spin" />
                      <span className="font-mono text-xs font-bold text-cyan-300 tracking-wider">
                        CIPHER BREACH IN PROGRESS // {cipherText}
                      </span>
                    </div>

                    <div className="text-sm font-black font-mono text-white tracking-widest uppercase mb-3 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]">
                      TEARING QUANTUM ENCRYPTION SEALS...
                    </div>

                    {/* High-speed animated cyber progress bar */}
                    <div className="w-full max-w-md h-3 rounded-full bg-slate-950 border border-cyan-500/50 p-0.5 overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-300 animate-pulse w-full" />
                    </div>

                    <p className="text-[11px] font-mono text-purple-300 mt-2">
                      EXTRACTING 3 CONFIDENTIAL PERMANENT SUBROUTINES...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#0e051a] via-[#080a14] to-[#04070c] border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                  {/* Top Status Header */}
                  <div className="relative flex items-center justify-between mb-3 text-[11px] font-mono border-b border-purple-500/20 pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-300 animate-bounce" />
                      <span className="font-bold text-purple-200 tracking-wider">
                        CACHE UNSEALED // SELECT 1 PERMANENT SYSTEM MODIFICATION
                      </span>
                    </div>
                    <span className="text-purple-300 font-bold bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/40">
                      1 OF 3 CLAIMABLE
                    </span>
                  </div>

                  {/* 3 Revealed Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {boosterPack.options.map((opt, idx) => {
                      const OptIcon = ICON_MAP[opt.icon] || Sparkles;
                      const theme = getPackOptionTheme(opt.actionType);
                      const isClaimed = claimedOptionId === opt.id;
                      const isOtherDismissed = packPhase === 'claiming' && !isClaimed;

                      return (
                        <div
                          key={opt.id}
                          style={{ animationDelay: `${idx * 130}ms` }}
                          className={`animate-card-emerge relative rounded-xl p-3.5 flex flex-col justify-between transition-all duration-300 ${
                            isClaimed
                              ? 'animate-claim-burst ring-2 ring-emerald-400 border-emerald-400 shadow-[0_0_35px_rgba(52,211,153,0.7)] bg-gradient-to-b from-emerald-950/80 via-slate-900 to-slate-950 scale-[1.02] z-10'
                              : isOtherDismissed
                              ? 'opacity-25 grayscale scale-95 pointer-events-none'
                              : `bg-gradient-to-b ${theme.bgGradient} border ${theme.border} ${theme.glow} hover:-translate-y-1.5 hover:shadow-[0_0_26px_rgba(168,85,247,0.35)]`
                          }`}
                        >
                          <div>
                            {/* Category kicker */}
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
                                · {theme.categoryLabel}
                              </span>
                              <span className="text-[10px] font-mono text-purple-400/80">[0{idx + 1}]</span>
                            </div>

                            {/* Icon + Title */}
                            <div className="flex items-start gap-2.5 mb-2">
                              <div className={`p-2 rounded-lg border shrink-0 ${theme.iconBox} shadow-sm`}>
                                <OptIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm font-mono text-white leading-tight">
                                  {opt.title}
                                </h4>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-slate-300 leading-relaxed font-sans min-h-[44px] mb-3">
                              {opt.description}
                            </p>
                          </div>

                          {/* Action button */}
                          <div>
                            <button
                              type="button"
                              disabled={packPhase === 'claiming'}
                              onClick={() => handleClaimOption(opt.id)}
                              className={`w-full py-2 text-xs font-mono font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                isClaimed
                                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/50'
                                  : isOtherDismissed
                                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                  : `${theme.btnBg} hover:brightness-110 active:scale-95`
                              }`}
                            >
                              {isClaimed ? (
                                <>
                                  <Check className="w-4 h-4 stroke-[3]" />
                                  <span>ACTIVATING MODIFICATION...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>CLAIM ENHANCEMENT</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* LATE-GAME UPGRADE SERVICES (ARMOR, EXPANSION, REPAIR) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
          {/* Armor Repair */}
          <div
            className={`p-3 flex flex-col justify-between ${
              isClassic
                ? 'bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white'
                : 'rounded-xl bg-slate-800/40 border border-slate-700/60'
            }`}
          >
            <div className="mb-2">
              <div className="font-semibold text-xs font-mono">Emergency Armor Patch</div>
              <div className={`text-[11px] mt-0.5 ${isClassic ? 'text-slate-600' : 'text-slate-400'}`}>
                Restores 1 Shield plate ({shields}/{maxShields})
              </div>
            </div>
            <button
              type="button"
              onClick={() => onBuyShieldRepair(repairCost)}
              disabled={shields >= maxShields || credits < repairCost}
              className={`w-full py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                shields < maxShields && credits >= repairCost
                  ? isClassic
                    ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black font-bold'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl'
                  : isClassic
                  ? 'bg-[#c0c0c0] border-2 border-[#808080] text-slate-500 cursor-not-allowed'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 rounded-xl'
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Patch ({repairCost} Cr)</span>
            </button>
          </div>

          {/* Reinforced Bulkheads (Escalating Cost) */}
          <div
            className={`p-3 flex flex-col justify-between ${
              isClassic
                ? 'bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white'
                : 'rounded-xl bg-slate-800/40 border border-slate-700/60'
            }`}
          >
            <div className="mb-2">
              <div className="font-semibold text-xs font-mono">+1 Max Shield Plating</div>
              <div className={`text-[11px] mt-0.5 ${isClassic ? 'text-slate-600' : 'text-slate-400'}`}>
                Expands max armor & restores 1 shield
              </div>
            </div>
            <button
              type="button"
              onClick={() => onBuyMaxShieldUpgrade(maxUpgradeCost)}
              disabled={credits < maxUpgradeCost}
              className={`w-full py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                credits >= maxUpgradeCost
                  ? isClassic
                    ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black font-bold'
                    : 'bg-sky-600 hover:bg-sky-500 text-white rounded-xl'
                  : isClassic
                  ? 'bg-[#c0c0c0] border-2 border-[#808080] text-slate-500 cursor-not-allowed'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 rounded-xl'
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Bulkhead ({maxUpgradeCost} Cr)</span>
            </button>
          </div>

          {/* Relic Slot Expansion (Balatro Voucher Style) */}
          <div
            className={`p-3 flex flex-col justify-between ${
              isClassic
                ? 'bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white'
                : 'rounded-xl bg-slate-800/40 border border-slate-700/60'
            }`}
          >
            <div className="mb-2">
              <div className="font-semibold text-xs font-mono">+1 Relic Slot Voucher</div>
              <div className={`text-[11px] mt-0.5 ${isClassic ? 'text-slate-600' : 'text-slate-400'}`}>
                Permanently adds +1 Relic holding capacity
              </div>
            </div>
            <button
              type="button"
              onClick={() => onBuyRelicSlotUpgrade(slotUpgradeCost)}
              disabled={credits < slotUpgradeCost || maxRelicSlots >= 8}
              className={`w-full py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                credits >= slotUpgradeCost && maxRelicSlots < 8
                  ? isClassic
                    ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black font-bold'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl'
                  : isClassic
                  ? 'bg-[#c0c0c0] border-2 border-[#808080] text-slate-500 cursor-not-allowed'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 rounded-xl'
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {maxRelicSlots >= 8 ? 'MAX SLOTS' : `Expand (${slotUpgradeCost} Cr)`}
              </span>
            </button>
          </div>
        </div>

        {/* BOTTOM ACTION STRIP */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 ${
            isClassic ? 'border-t border-[#808080]' : 'border-t border-slate-800'
          }`}
        >
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="font-semibold text-white">Next Destination:</span>
            <span>
              Sector {nextConfig.sector} ({nextConfig.rows}x{nextConfig.cols}, {nextConfig.mines} Mines)
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onExitToMenu && (
              <button
                type="button"
                onClick={onExitToMenu}
                className={`px-4 py-2.5 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isClassic
                    ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-red-900 active:border-t-[#808080] active:border-l-[#808080]'
                    : 'bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 rounded-xl border border-slate-700 hover:border-rose-500/40'
                }`}
                title="Retire & Exit to Main Menu"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit to HQ</span>
              </button>
            )}

            <button
              type="button"
              onClick={onProceedToNextSector}
              className={`w-full sm:w-auto px-6 py-2.5 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isClassic
                  ? 'bg-[#c0c0c0] border-3 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-black'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg hover:bg-emerald-400'
              }`}
            >
              <span>Launch Sector {nextConfig.sector}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
