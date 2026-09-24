/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Item } from '../types/game';

export const ALL_RELICS: Item[] = [
  {
    id: 'corner_compass',
    name: 'Corner Compass',
    type: 'relic',
    rarity: 'common',
    description: 'All 4 corners of every sector are guaranteed safe and auto-revealed upon entering.',
    cost: 12,
    icon: 'Compass',
    flavorText: 'Standard triangulation beacon for navigating unknown matrix topography.'
  },
  {
    id: 'cascade_capacitor',
    name: 'Cascade Capacitor',
    type: 'relic',
    rarity: 'common',
    description: 'Clearing cascades of 5 or more tiles grants +2 bonus credits.',
    cost: 14,
    icon: 'Zap',
    flavorText: 'Harnesses data chain reaction momentum into liquid audit funds.'
  },
  {
    id: 'high_roller',
    name: 'High Roller Matrix',
    type: 'relic',
    rarity: 'common',
    description: 'Revealing high-threat clue tiles (numbers 3, 4, or 5+) awards +1 credit each.',
    cost: 15,
    icon: 'TrendingUp',
    flavorText: 'Danger pay authorized by senior management.'
  },
  {
    id: 'scrap_collector',
    name: 'Scrap Magnet',
    type: 'relic',
    rarity: 'common',
    description: 'Correctly flagged or defused mines yield +2 bonus credits on sector completion.',
    cost: 16,
    icon: 'Coins',
    flavorText: 'Salvages volatile raw capacitors from disarmed explosives.'
  },
  {
    id: 'golden_chisel',
    name: 'Chord Amplifier',
    type: 'relic',
    rarity: 'rare',
    description: 'Chording a satisfied number cell immediately yields +1 credit.',
    cost: 20,
    icon: 'Sparkles',
    flavorText: 'Speedy deduction protocol yields efficiency dividends.'
  },
  {
    id: 'quantum_buffer',
    name: '50/50 Quantum Buffer',
    type: 'relic',
    rarity: 'rare',
    description: 'Guarantees the first ambiguous guess on each sector will never detonate a mine.',
    cost: 24,
    icon: 'ShieldCheck',
    flavorText: 'Schrodinger audit: until inspected, the cell collapses into safety.'
  },
  {
    id: 'reactive_chobham',
    name: 'Reactive Plating',
    type: 'relic',
    rarity: 'rare',
    description: 'When a shield absorbs a mine hit, it safely reveals all 8 adjacent tiles.',
    cost: 22,
    icon: 'Activity',
    flavorText: 'Explosive reactive armor clears surrounding debris cleanly.'
  },
  {
    id: 'logic_beacon',
    name: 'Logic Beacon',
    type: 'relic',
    rarity: 'rare',
    description: 'At the start of each sector, auto-locates and safely clears 2 guaranteed safe tiles.',
    cost: 22,
    icon: 'Eye',
    flavorText: 'Pre-flight sector vulnerability probe.'
  },
  {
    id: 'volatile_dampener',
    name: 'Dampening Coil',
    type: 'relic',
    rarity: 'rare',
    description: 'Cluster / Volatile double-mines are stabilized and count as regular 1-value mines.',
    cost: 25,
    icon: 'Cpu',
    flavorText: 'Frequency harmonics suppress dual-stage explosive reactions.'
  },
  {
    id: 'shield_dynamo',
    name: 'Regen Dynamo',
    type: 'relic',
    rarity: 'legendary',
    description: 'Restores +1 Shield plate automatically after every 2 cleared sectors.',
    cost: 32,
    icon: 'RefreshCw',
    flavorText: 'Self-repair micro-drones cycling at regular audit intervals.'
  },
  {
    id: 'credit_overclock',
    name: 'Overclock Ledger',
    type: 'relic',
    rarity: 'legendary',
    description: 'Boosts all credit earnings and end-of-sector clear bonuses by +40%.',
    cost: 28,
    icon: 'Percent',
    flavorText: 'Double-entry bookkeeping at clock-cycle execution speed.'
  },
  {
    id: 'hull_reinforcement',
    name: 'Aegis Hardlight Core',
    type: 'relic',
    rarity: 'legendary',
    description: 'Increases Max Shields by +1. [Second Chance]: If a fatal mine blast strikes at 0 Shields, Aegis discharges: averts death, restores 1 Shield plate, and disarms the blast!',
    cost: 30,
    icon: 'ShieldAlert',
    flavorText: 'When the hull fails, the hardlight matrix holds the breach.'
  },
  {
    id: 'bounty_tracker',
    name: 'Bounty Tracker',
    type: 'relic',
    rarity: 'common',
    description: 'Placing a flag on a confirmed mine yields +1 credit instantly.',
    cost: 14,
    icon: 'Crosshair',
    flavorText: 'Real-time bounty contract for identifying explosive ordnance.'
  },
  {
    id: 'gamblers_dice',
    name: "Gambler's Matrix",
    type: 'relic',
    rarity: 'rare',
    description: 'Uncovering rare high-threat clue tiles (numbers 4, 5, or higher) grants +4 credits and +200 score!',
    cost: 18,
    icon: 'Coins',
    flavorText: 'Weighted calculation for operatives who dance on lethal margins.'
  },
  {
    id: 'demolition_payout',
    name: 'Demolition Bonus',
    type: 'relic',
    rarity: 'common',
    description: 'Whenever a mine is disarmed or absorbed by shields, gain +3 credits and +50 points.',
    cost: 15,
    icon: 'ShieldAlert',
    flavorText: 'Insurance payout voucher for neutralizing active sector hazards.'
  },
  {
    id: 'mine_reprocessor',
    name: 'Accuracy Reprocessor',
    type: 'relic',
    rarity: 'rare',
    description: 'If a sector is completed with 100% of mines correctly flagged, receive an extra +15 credits bonus!',
    cost: 22,
    icon: 'Target',
    flavorText: '100% telemetry accuracy bonus certified by the salvage guild.'
  },
  {
    id: 'subsurface_geophone',
    name: 'Perimeter Sensor',
    type: 'relic',
    rarity: 'common',
    description: 'At the start of each sector, auto-locates and safely clears 3 perimeter border tiles.',
    cost: 16,
    icon: 'Layers',
    flavorText: 'Acoustic seismic sensor reading perimeter density variations.'
  },
  {
    id: 'nanite_sponge',
    name: 'Nanite Sponge',
    type: 'relic',
    rarity: 'rare',
    description: 'When a shield absorbs a mine blast, it also converts 1 random unrevealed mine elsewhere into a safe tile!',
    cost: 24,
    icon: 'Dna',
    flavorText: 'Self-replicating nanite colony converts raw shrapnel into structural matrix.'
  },
  {
    id: 'compound_interest',
    name: 'Compound Ledger',
    type: 'relic',
    rarity: 'rare',
    description: 'Earn +15% of your current credit balance (up to +15 CR) as dividend yield after every cleared sector.',
    cost: 20,
    icon: 'TrendingUp',
    flavorText: 'High-frequency arbitrage account compounding across sweep sectors.'
  },
  {
    id: 'black_market_pass',
    name: 'Black Market Pass',
    type: 'relic',
    rarity: 'legendary',
    description: 'Depot rerolls are completely FREE, and all item costs are permanently discounted by 25%.',
    cost: 30,
    icon: 'ShoppingBag',
    flavorText: 'Forged cryptographic credentials granting direct wholesale depot access.'
  },
  {
    id: 'adrenalin_overdrive',
    name: 'Adrenalin Core',
    type: 'relic',
    rarity: 'legendary',
    description: 'When at exactly 1 Shield remaining, all cascades and chords yield DOUBLE credits and TRIPLE score!',
    cost: 28,
    icon: 'Flame',
    flavorText: 'Neural inhibitor bypass unlocking peak human survival cognition.'
  },
  {
    id: 'golden_transmuter',
    name: 'Golden Transmuter',
    type: 'relic',
    rarity: 'rare',
    description: 'Spawns +2 extra Golden Caches per sector. Golden tiles yield +10 credits and restore 1 gadget charge!',
    cost: 22,
    icon: 'Sparkles',
    flavorText: 'Algorithmic alchemy turning raw data clusters into pure liquidity.'
  },
  {
    id: 'aegis_battery',
    name: 'Hyper-Capacitor Array',
    type: 'relic',
    rarity: 'legendary',
    description: 'Increases Maximum Shields by +2 and immediately restores 2 shield plates.',
    cost: 36,
    icon: 'ShieldPlus',
    flavorText: 'Heavy-duty modular capacitors doubling reactive defense threshold.'
  },
  {
    id: 'flawless_bounty',
    name: 'Flawless Protocol',
    type: 'relic',
    rarity: 'rare',
    description: 'Clearing any sector without taking a single shield breach awards +15 bonus credits and +500 score!',
    cost: 20,
    icon: 'Award',
    flavorText: 'Zero-tolerance audit excellence contract ratified by corporate command.'
  },
  {
    id: 'chrono_dial',
    name: 'Chrono Stabilizer',
    type: 'relic',
    rarity: 'legendary',
    description: 'Once per sector, rewinds the first mine detonation without losing a shield plate!',
    cost: 32,
    icon: 'Clock',
    flavorText: 'Tachyon field dampener reversing entropy on structural ruptures.'
  },
  {
    id: 'apex_matrix',
    name: 'Apex Core',
    type: 'relic',
    rarity: 'legendary',
    description: 'Adds +1 Max Shield, +1 Max Charge to ALL gadgets, and +500 points immediately!',
    cost: 34,
    icon: 'Sparkles',
    flavorText: 'Hyper-dense quantum computational core running omni-directional optimizations.'
  }
];

export const ALL_GADGETS: Item[] = [
  {
    id: 'orbital_railgun',
    name: 'Orbital Railgun',
    type: 'gadget',
    rarity: 'legendary',
    description: 'Target a cell to fire an ultra-dense diagonal beam across the grid: reveals safe tiles and disarms all hidden mines!',
    cost: 22,
    charges: 1,
    maxCharges: 1,
    icon: 'Zap',
    flavorText: 'Superconducting projectile tearing through encrypted sub-layers.'
  },
  {
    id: 'cryo_pulse',
    name: 'Sub-Zero Cryo-Cell',
    type: 'gadget',
    rarity: 'rare',
    description: 'Instant effect: freezes the sector, safely revealing 4 random safe tiles and disarming the nearest cluster mine!',
    cost: 16,
    charges: 1,
    maxCharges: 1,
    icon: 'Snowflake',
    flavorText: 'Endothermic flash-freeze locking reactive detonator mechanisms.'
  },
  {
    id: 'sonar_scanner',
    name: 'Sonar Scanner',
    type: 'gadget',
    rarity: 'common',
    description: 'Target a 3x3 region to scan it safely: reveals exact mine presence and clears safe tiles.',
    cost: 10,
    charges: 2,
    maxCharges: 2,
    icon: 'Radar',
    flavorText: 'Acoustic pulse penetrating top layer data obstruction.'
  },
  {
    id: 'mine_defuser',
    name: 'Disarm Chisel',
    type: 'gadget',
    rarity: 'rare',
    description: 'Target any covered cell. If it is a mine, disarms it and yields +5 credits! If safe, reveals it.',
    cost: 14,
    charges: 2,
    maxCharges: 2,
    icon: 'Wrench',
    flavorText: 'Precision micro-pliers capable of cutting copper detonator leads.'
  },
  {
    id: 'cross_laser',
    name: 'Crossfire Beam',
    type: 'gadget',
    rarity: 'rare',
    description: 'Target a cell to sweep its entire Row and Column: safely reveals all safe tiles and flags any hidden mines!',
    cost: 18,
    charges: 1,
    maxCharges: 1,
    icon: 'Crosshair',
    flavorText: 'Precision orbital telemetry laser sweeping horizontal and vertical conduits.'
  },
  {
    id: 'emp_jammer',
    name: 'EMP Burst',
    type: 'gadget',
    rarity: 'common',
    description: 'Instant effect: reveals 3 random safe covered tiles anywhere across the board.',
    cost: 12,
    charges: 1,
    maxCharges: 1,
    icon: 'Radio',
    flavorText: 'Shortwave electromagnetic pulse forcing terminal response.'
  },
  {
    id: 'recon_drone',
    name: 'Recon Drone',
    type: 'gadget',
    rarity: 'rare',
    description: 'Instant effect: launches an autonomous seeker drone that tracks down and disarms 1 unrevealed mine.',
    cost: 15,
    charges: 2,
    maxCharges: 2,
    icon: 'Target',
    flavorText: 'Micro-quadcopter programmed to locate and clamp detonator pins.'
  },
  {
    id: 'xray_sensor',
    name: 'X-Ray Chisel',
    type: 'gadget',
    rarity: 'common',
    description: 'Inspect 1 covered cell to peek at its contents for 4 seconds without triggering it.',
    cost: 8,
    charges: 3,
    maxCharges: 3,
    icon: 'Scan',
    flavorText: 'High-density fluoroscopic sensor array.'
  },
  {
    id: 'field_repair',
    name: 'Emergency Nanites',
    type: 'gadget',
    rarity: 'rare',
    description: 'Single-use consumable: instantly repairs 1 lost Shield plate in the field.',
    cost: 16,
    charges: 1,
    maxCharges: 1,
    icon: 'HeartPulse',
    flavorText: 'Rapid aerosol adhesive patching armor breaches.'
  },
  {
    id: 'credit_siphon',
    name: 'Liquid Capital Stim',
    type: 'gadget',
    rarity: 'common',
    description: 'Instant consumable: grants +25 liquid credits immediately for depot purchasing or compounding.',
    cost: 12,
    charges: 1,
    maxCharges: 1,
    icon: 'Coins',
    flavorText: 'One-time crypto-bearer bond liquidation.'
  },
  {
    id: 'overcharge_surge',
    name: 'Overcharge Surge',
    type: 'gadget',
    rarity: 'legendary',
    description: 'Instant consumable: infuses your hull with +1 Temporary Overshield exceeding max capacity!',
    cost: 20,
    charges: 1,
    maxCharges: 1,
    icon: 'BatteryCharging',
    flavorText: 'Overclocked electrostatic barrier providing auxiliary impact padding.'
  }
];

export function getProceduralShopItems(
  equippedRelicIds: string[],
  ownedGadgetIds: string[],
  count: number = 3,
  rng?: () => number
): Item[] {
  // Available relics (not already equipped)
  const availableRelics = ALL_RELICS.filter(r => !equippedRelicIds.includes(r.id));
  // Available gadgets (allow re-buying if not owned or if charges depleted)
  const availableGadgets = ALL_GADGETS.filter(g => !ownedGadgetIds.includes(g.id));

  const allAvailable = [...availableRelics, ...availableGadgets];
  if (allAvailable.length === 0) {
    return ALL_GADGETS.slice(0, count);
  }

  const rand = rng || Math.random;
  // Fisher-Yates deterministic shuffle
  const shuffled = [...allAvailable];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Pick items and occasionally roll hacker-themed subroutines (Ghost, Prism, Glitched, Overclocked)
  const selected = shuffled.slice(0, count).map(baseItem => {
    const roll = rand();
    let edition: Item['edition'] = 'standard';
    let costMod = baseItem.cost;

    if (baseItem.type === 'relic') {
      if (roll < 0.05) {
        edition = 'ghost'; // 5% chance: Takes 0 Relic Slots (runs as headless background daemon)!
        costMod = Math.round(baseItem.cost * 1.5);
      } else if (roll < 0.14) {
        edition = 'prism'; // 9% chance: +50% credit payouts & score (multi-threaded yield)
        costMod = Math.round(baseItem.cost * 1.3);
      } else if (roll < 0.25) {
        edition = 'glitched'; // 11% chance: +300 bonus score & 2 instant credits
        costMod = Math.round(baseItem.cost * 1.15);
      } else if (roll < 0.38) {
        edition = 'overclocked'; // 13% chance: +150 bonus score
        costMod = Math.round(baseItem.cost * 1.1);
      }
    }

    return {
      ...baseItem,
      cost: costMod,
      edition
    };
  });

  return selected;
}

export function generateBoosterPack(sector: number, rng?: () => number): import('../types/game').BoosterPack {
  const rand = rng || Math.random;
  const packTypes = [
    {
      id: 'quantum_cache',
      name: 'Quantum Subroutine Cache',
      tagline: 'Choose 1 of 3 permanent sector modifications',
      cost: Math.min(35, 14 + sector * 2),
      options: [
        {
          id: 'opt_chords',
          title: 'Neural Overclock',
          description: '+300 score on every chord, and instant +12 Credits.',
          icon: 'Sparkles',
          actionType: 'credit_grant' as const,
          payload: { credits: 12, score: 300 }
        },
        {
          id: 'opt_shield_up',
          title: 'Auxiliary Hull Reinforcement',
          description: '+1 Maximum Shield plate and immediately restore 1 Shield.',
          icon: 'ShieldPlus',
          actionType: 'shield_grant' as const,
          payload: { maxShields: 1 }
        },
        {
          id: 'opt_relic_slot',
          title: 'Cortex Expansion',
          description: 'Permanently unlocks +1 Relic Slot capacity!',
          icon: 'Layers',
          actionType: 'relic_slot' as const,
          payload: { slots: 1 }
        }
      ]
    },
    {
      id: 'salvage_vault',
      name: 'Black Market Salvage Vault',
      tagline: 'Choose 1 of 3 rare tactical emergency supplies',
      cost: Math.min(30, 12 + sector * 2),
      options: [
        {
          id: 'opt_gadget_overclock',
          title: 'Omni-Battery Refill',
          description: 'Restores +1 charge to ALL currently equipped gadgets.',
          icon: 'BatteryCharging',
          actionType: 'gadget_upgrade' as const,
          payload: { charges: 1 }
        },
        {
          id: 'opt_capital_stim',
          title: 'Liquid Crypto Injection',
          description: 'Injects +25 liquid credits into your tactical balance.',
          icon: 'Coins',
          actionType: 'credit_grant' as const,
          payload: { credits: 25 }
        },
        {
          id: 'opt_shield_nanites',
          title: 'Full Armor Restoration',
          description: 'Completely repairs all damaged Shield plates to max capacity for free.',
          icon: 'HeartPulse',
          actionType: 'free_repair' as const,
          payload: {}
        }
      ]
    }
  ];

  const chosenIndex = Math.floor(rand() * packTypes.length);
  return packTypes[chosenIndex];
}
