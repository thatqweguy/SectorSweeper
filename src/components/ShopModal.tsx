/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Item, SectorConfig, DisguiseMode } from '../types/game';
import {
  Shield,
  Coins,
  RefreshCw,
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
  ArrowRight,
  Package,
  Crosshair,
  Target,
  ShoppingBag,
  Flame,
  Dna,
  ShieldPlus,
  BatteryCharging,
  Layers,
  Tag
} from 'lucide-react';

interface ShopModalProps {
  currentSector: number;
  nextConfig: SectorConfig;
  shopItems: Item[];
  credits: number;
  shields: number;
  maxShields: number;
  disguiseMode: DisguiseMode;
  hasBlackMarketPass?: boolean;
  onBuyItem: (item: Item, effectiveCost: number) => void;
  onBuyShieldRepair: () => void;
  onBuyMaxShieldUpgrade: () => void;
  onRerollShop: () => void;
  onProceedToNextSector: () => void;
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

export const ShopModal: React.FC<ShopModalProps> = ({
  currentSector,
  nextConfig,
  shopItems,
  credits,
  shields,
  maxShields,
  disguiseMode,
  hasBlackMarketPass = false,
  onBuyItem,
  onBuyShieldRepair,
  onBuyMaxShieldUpgrade,
  onRerollShop,
  onProceedToNextSector
}) => {
  const repairCost = 10;
  const maxUpgradeCost = 26;
  const rerollCost = hasBlackMarketPass ? 0 : 5;
  const isClassic = disguiseMode === 'classic';

  const getItemCost = (baseCost: number) => {
    return hasBlackMarketPass ? Math.max(1, Math.round(baseCost * 0.75)) : baseCost;
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return isClassic ? 'text-amber-800 font-bold' : 'text-amber-400 font-bold';
      case 'rare':
        return isClassic ? 'text-blue-800 font-bold' : 'text-indigo-400 font-semibold';
      default:
        return isClassic ? 'text-slate-700 font-medium' : 'text-slate-400 font-medium';
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`w-full max-w-3xl shadow-2xl transition-colors ${
          isClassic
            ? 'bg-[#c0c0c0] border-4 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black p-4'
            : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-6 sm:p-8'
        }`}
      >
        {/* Classic Win95 Title Header */}
        {isClassic && (
          <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-2 py-1 text-white flex items-center justify-between font-bold text-xs mb-4">
            <div className="flex items-center gap-1.5">
              <span>🛒</span>
              <span>Requisition Depot — Sector {currentSector} Cleared</span>
            </div>
            <div className="w-4 h-3.5 bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-[#808080] border-b-[#808080] flex items-center justify-center text-[9px] font-bold font-mono">
              ✕
            </div>
          </div>
        )}

        {/* Header */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 ${
            isClassic ? 'border-b border-[#808080]' : 'border-b border-slate-800'
          }`}
        >
          <div>
            <div
              className={`text-xs uppercase tracking-wider font-semibold mb-1 ${
                isClassic ? 'text-emerald-800 font-bold' : 'text-emerald-400'
              }`}
            >
              Sector {currentSector} Cleared Successfully
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Requisition Depot & Field Upgrades
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 ${
                isClassic
                  ? 'bg-black text-amber-400 font-mono font-bold border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white text-sm'
                  : 'bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700'
              }`}
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="font-bold tabular-nums">{credits}</span>
              <span className={`text-xs ${isClassic ? 'text-amber-300' : 'text-slate-400'}`}>Cr</span>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 ${
                isClassic
                  ? 'bg-black text-emerald-400 font-mono font-bold border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white text-sm'
                  : 'bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700'
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="font-bold tabular-nums">
                {shields} / {maxShields}
              </span>
              <span className={`text-xs ${isClassic ? 'text-emerald-300' : 'text-slate-400'}`}>Armor</span>
            </div>
          </div>
        </div>

        {/* Procedural Items Shelf */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <h3
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isClassic ? 'text-slate-800 font-bold' : 'text-slate-400'
                }`}
              >
                Tactical Relics & Field Gadgets
              </h3>
              {hasBlackMarketPass && (
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  <Tag className="w-3 h-3" />
                  <span>25% Black Market Discount</span>
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onRerollShop}
              disabled={credits < rerollCost}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 transition-colors ${
                isClassic
                  ? credits >= rerollCost
                    ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-black'
                    : 'bg-[#c0c0c0] border-2 border-[#808080] text-slate-500 cursor-not-allowed'
                  : credits >= rerollCost
                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-600 rounded-lg'
                  : 'bg-slate-800/40 text-slate-500 border border-slate-800 rounded-lg cursor-not-allowed'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reroll Stock ({rerollCost === 0 ? 'FREE' : `${rerollCost} Cr`})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {shopItems.map(item => {
              const IconComponent = ICON_MAP[item.icon] || Package;
              const effectiveCost = getItemCost(item.cost);
              const canAfford = credits >= effectiveCost;

              return (
                <div
                  key={item.id}
                  className={`flex flex-col justify-between p-3.5 transition-all ${
                    isClassic
                      ? 'bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white text-black'
                      : 'bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 rounded-xl'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div
                        className={`p-2 ${
                          isClassic
                            ? 'bg-[#c0c0c0] border border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-black'
                            : 'rounded-lg bg-slate-700/50 text-indigo-400'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="text-right">
                        <div className={`text-xs capitalize ${getRarityBadge(item.rarity)}`}>
                          {item.rarity} · {item.type}
                        </div>
                        {item.charges && (
                          <div className={`text-[11px] ${isClassic ? 'text-slate-600' : 'text-slate-400'}`}>
                            {item.charges} charges
                          </div>
                        )}
                      </div>
                    </div>

                    <h4 className="font-bold text-sm mb-1">{item.name}</h4>
                    <p className={`text-xs leading-relaxed mb-2 ${isClassic ? 'text-slate-800' : 'text-slate-300'}`}>
                      {item.description}
                    </p>
                    {item.flavorText && (
                      <p
                        className={`text-[11px] italic mb-3 pt-1 border-t ${
                          isClassic ? 'border-[#808080] text-slate-600' : 'border-slate-700/40 text-slate-400'
                        }`}
                      >
                        &ldquo;{item.flavorText}&rdquo;
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onBuyItem(item, effectiveCost)}
                    disabled={!canAfford}
                    className={`w-full py-1.5 px-3 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      isClassic
                        ? canAfford
                          ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-black font-bold'
                          : 'bg-[#c0c0c0] border-2 border-[#808080] text-slate-500 cursor-not-allowed'
                        : canAfford
                        ? 'bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50 rounded-xl'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    {hasBlackMarketPass && effectiveCost < item.cost ? (
                      <span className="flex items-center gap-1.5">
                        <span className="line-through text-slate-400 text-[11px]">{item.cost}</span>
                        <span className="font-bold text-amber-300">{effectiveCost} Cr</span>
                      </span>
                    ) : (
                      <span>Buy for {effectiveCost} Cr</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Armor & Field Services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div
            className={`p-3.5 flex items-center justify-between ${
              isClassic
                ? 'bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white'
                : 'rounded-xl bg-slate-800/40 border border-slate-700/60'
            }`}
          >
            <div>
              <div className="font-semibold text-sm">Emergency Armor Patch</div>
              <div className={`text-xs mt-0.5 ${isClassic ? 'text-slate-600' : 'text-slate-400'}`}>
                Restores 1 Shield plate (Current: {shields}/{maxShields})
              </div>
            </div>
            <button
              type="button"
              onClick={onBuyShieldRepair}
              disabled={shields >= maxShields || credits < repairCost}
              className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                isClassic
                  ? shields < maxShields && credits >= repairCost
                    ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-black'
                    : 'bg-[#c0c0c0] border-2 border-[#808080] text-slate-500 cursor-not-allowed'
                  : shields < maxShields && credits >= repairCost
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 rounded-xl'
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Repair ({repairCost} Cr)</span>
            </button>
          </div>

          <div
            className={`p-3.5 flex items-center justify-between ${
              isClassic
                ? 'bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white'
                : 'rounded-xl bg-slate-800/40 border border-slate-700/60'
            }`}
          >
            <div>
              <div className="font-semibold text-sm">Reinforced Bulkheads</div>
              <div className={`text-xs mt-0.5 ${isClassic ? 'text-slate-600' : 'text-slate-400'}`}>
                Increases Max Shields +1 (Also restores 1 shield)
              </div>
            </div>
            <button
              type="button"
              onClick={onBuyMaxShieldUpgrade}
              disabled={credits < maxUpgradeCost}
              className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                isClassic
                  ? credits >= maxUpgradeCost
                    ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-black'
                    : 'bg-[#c0c0c0] border-2 border-[#808080] text-slate-500 cursor-not-allowed'
                  : credits >= maxUpgradeCost
                  ? 'bg-sky-600 hover:bg-sky-500 text-white rounded-xl'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 rounded-xl'
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Upgrade ({maxUpgradeCost} Cr)</span>
            </button>
          </div>
        </div>

        {/* Footer: Next Sector Briefing & Launch */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 ${
            isClassic ? 'border-t border-[#808080]' : 'border-t border-slate-800'
          }`}
        >
          <div className="text-xs text-slate-400 max-w-md">
            <span className={`font-semibold ${isClassic ? 'text-black' : 'text-slate-200'}`}>
              Next Sector: {nextConfig.name}{' '}
            </span>
            <span className={isClassic ? 'text-slate-700' : 'text-slate-400'}>
              ({nextConfig.rows}x{nextConfig.cols}, {nextConfig.mines} mines).{' '}
            </span>
            <span className={isClassic ? 'text-amber-800 font-semibold' : 'text-amber-400'}>
              {nextConfig.hazardDescription}
            </span>
          </div>

          <button
            type="button"
            onClick={onProceedToNextSector}
            className={`w-full sm:w-auto px-6 py-2.5 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isClassic
                ? 'bg-[#c0c0c0] border-3 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] text-black'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg'
            }`}
          >
            <span>Launch Sector {nextConfig.sector}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
