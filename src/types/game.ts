/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ItemRarity = 'common' | 'rare' | 'legendary';
export type ItemType = 'relic' | 'gadget';
export type ItemEdition = 'standard' | 'overclocked' | 'glitched' | 'prism' | 'ghost';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  description: string;
  cost: number;
  icon: string;
  charges?: number;
  maxCharges?: number;
  flavorText?: string;
  edition?: ItemEdition;
}

export interface BoosterPack {
  id: string;
  name: string;
  tagline: string;
  cost: number;
  options: {
    id: string;
    title: string;
    description: string;
    icon: string;
    actionType: 'credit_grant' | 'shield_grant' | 'gadget_upgrade' | 'relic_slot' | 'free_repair';
    payload?: any;
  }[];
}

export interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isClusterMine: boolean; // Counts as 2 mines in adjacent calculations
  isGlitch: boolean; // Corrupted indicator that stabilizes once neighbors are opened
  isRevealed: boolean;
  isFlagged: boolean;
  isDefused: boolean; // Disarmed by gadget/shield
  isGolden: boolean; // Grants bonus credits when opened safely
  adjacentMines: number;
  isPeeking?: boolean; // Highlighted by X-Ray tool
  isDetonated?: boolean; // Mine that caused shield hit
}

export type DisguiseMode = 'minimal' | 'classic';

export type GameState = 'TITLE' | 'PLAYING' | 'SHOP' | 'SECTOR_CLEAR' | 'GAME_OVER' | 'VICTORY';

export type ActiveGadgetTool = 'none' | 'sonar' | 'defuse' | 'xray' | 'cross_laser' | 'railgun';

export type ChallengeProtocol = 'tactical' | 'ironclad' | 'speedrun' | 'zero_flag';

export interface SectorConfig {
  sector: number;
  name: string;
  rows: number;
  cols: number;
  mines: number;
  clusterMines: number;
  glitchTiles: number;
  goldenTiles: number;
  hazardDescription: string;
  isBoss?: boolean;
}

export interface SectorAuditEntry {
  sector: number;
  sectorName: string;
  cleared: boolean;
  timeSpentSeconds: number;
  damageTaken: number;
  creditsEarned: number;
}

export interface PlayerStats {
  shields: number;
  maxShields: number;
  credits: number;
  totalCreditsEarned: number;
  score: number;
  sector: number;
  minesDefusedTotal: number;
  tilesClearedTotal: number;
  cascadesTriggered: number;
  damageTakenTotal: number;
  runDurationSeconds: number;
  firstGuessSafe: boolean;
  gadgetsUsedTotal: number;
  chordsExecutedTotal: number;
  protocol?: ChallengeProtocol;
  isEndless?: boolean;
  flawlessSectorsTotal?: number;
  maxRelicSlots: number;
  sectorHistory: SectorAuditEntry[];
}
