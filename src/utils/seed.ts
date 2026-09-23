/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 32-bit FNV-1a hash algorithm to turn any arbitrary string into an unsigned integer
export function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

// Mulberry32 pseudo-random number generator
export function createPRNG(seedNumber: number): () => number {
  let s = seedNumber >>> 0;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Deterministic RNG for a given seed and sector's board generation
export function getSectorRng(seed: string, sector: number): () => number {
  const hash = hashString(`${seed}::sector_${sector}::board_layout`);
  return createPRNG(hash);
}

// Deterministic RNG for shop offerings and shop rerolls
export function getShopRng(seed: string, sector: number, rerollCount: number = 0): () => number {
  const hash = hashString(`${seed}::sector_${sector}::shop_inventory_roll_${rerollCount}`);
  return createPRNG(hash);
}

const SEED_PREFIXES = [
  'SWEEP',
  'ORBIT',
  'NEON',
  'CYBER',
  'PULSE',
  'TITAN',
  'OMEGA',
  'SOLAR',
  'VAPOR',
  'AEGIS',
  'RADAR',
  'CHRONO',
  'ZERO',
  'VOID',
  'AURORA',
  'MATRIX'
];

const SEED_PHONETICS = [
  'ALPHA',
  'BRAVO',
  'CHARLIE',
  'DELTA',
  'ECHO',
  'FOXTROT',
  'GOLF',
  'HOTEL',
  'INDIA',
  'KILO',
  'LIMA',
  'MIKE',
  'NOVA',
  'OSCAR',
  'PAPA',
  'ROMEO',
  'SIERRA',
  'TANGO',
  'VICTOR',
  'XRAY',
  'YANKEE',
  'ZULU'
];

// Generate a random military/sci-fi themed seed, e.g. "SWEEP-4921-ECHO"
export function generateRandomSeed(): string {
  const prefix = SEED_PREFIXES[Math.floor(Math.random() * SEED_PREFIXES.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  const phonetic = SEED_PHONETICS[Math.floor(Math.random() * SEED_PHONETICS.length)];
  return `${prefix}-${num}-${phonetic}`;
}

// Get the standardized Daily Mission Seed for today's local date, e.g. "DAILY-2026-09-22"
export function getDailySeed(customDate?: Date): string {
  const d = customDate || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `DAILY-${year}-${month}-${day}`;
}

// Check if a seed is the Daily Challenge
export function isDailySeed(seed: string): boolean {
  return seed.toUpperCase().startsWith('DAILY-');
}

// Friendly formatting for Daily date string
export function formatDailyDate(seed: string): string {
  if (!isDailySeed(seed)) return '';
  const parts = seed.split('-');
  if (parts.length >= 4) {
    const year = parts[1];
    const month = parseInt(parts[2], 10);
    const day = parseInt(parts[3], 10);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[month - 1] || month} ${day}, ${year}`;
  }
  return seed;
}
