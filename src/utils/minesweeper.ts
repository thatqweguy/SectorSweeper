/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cell, SectorConfig } from '../types/game';

// Generate difficulty config per sector
export function getSectorConfig(sector: number): SectorConfig {
  switch (sector) {
    case 1:
      return {
        sector: 1,
        name: 'Sector 01: Low Earth Orbit Data Relay',
        rows: 9,
        cols: 9,
        mines: 10,
        clusterMines: 0,
        glitchTiles: 0,
        goldenTiles: 1,
        hazardDescription: 'Standard grid. No active electromagnetic anomalies.'
      };
    case 2:
      return {
        sector: 2,
        name: 'Sector 02: Lunar Telemetry Vault',
        rows: 10,
        cols: 10,
        mines: 14,
        clusterMines: 0,
        glitchTiles: 0,
        goldenTiles: 2,
        hazardDescription: 'Elevated mine density detected. Golden data cache spotted.'
      };
    case 3:
      return {
        sector: 3,
        name: 'Sector 03: Asteroid Deep Storage',
        rows: 11,
        cols: 11,
        mines: 19,
        clusterMines: 1,
        glitchTiles: 0,
        goldenTiles: 2,
        hazardDescription: 'Volatile Cluster Mine detected! Counts as 2 adjacent mines for clues.'
      };
    case 4:
      return {
        sector: 4,
        name: 'Sector 04: Martian Subsurface Node',
        rows: 12,
        cols: 12,
        mines: 25,
        clusterMines: 2,
        glitchTiles: 2,
        goldenTiles: 2,
        hazardDescription: 'Corrupted Glitch signals present. Numbers may flicker until bounded.'
      };
    case 5:
      return {
        sector: 5,
        name: 'Sector 05: Jovian Gas Processing Array',
        rows: 13,
        cols: 13,
        mines: 32,
        clusterMines: 3,
        glitchTiles: 3,
        goldenTiles: 3,
        hazardDescription: 'High atmospheric interference. Multiple volatile clusters.'
      };
    case 6:
      return {
        sector: 6,
        name: 'Sector 06: Kuiper Ring Terminal',
        rows: 14,
        cols: 14,
        mines: 40,
        clusterMines: 4,
        glitchTiles: 3,
        goldenTiles: 3,
        hazardDescription: 'Critical hazard zone. Hazardous seismic shifts in unobserved sectors.'
      };
    case 7:
      return {
        sector: 7,
        name: 'Sector 07: Oort Cloud Outpost',
        rows: 15,
        cols: 15,
        mines: 48,
        clusterMines: 5,
        glitchTiles: 4,
        goldenTiles: 4,
        hazardDescription: 'Dense minefield. High financial rewards for thorough extraction.'
      };
    case 8:
      return {
        sector: 8,
        name: 'Sector 08: Interstellar Relay Core',
        rows: 15,
        cols: 15,
        mines: 55,
        clusterMines: 6,
        glitchTiles: 5,
        goldenTiles: 4,
        hazardDescription: 'Extreme volatility. Use gadgets and active shields deliberately.'
      };
    default: {
      // Endless or Boss levels (Sector 9+)
      const scaledRows = Math.min(16, 14 + Math.floor((sector - 8) / 2));
      const scaledMines = Math.min(65, 50 + (sector - 8) * 4);
      return {
        sector,
        name: `Sector ${sector.toString().padStart(2, '0')}: Singularity Quarantine`,
        rows: scaledRows,
        cols: scaledRows,
        mines: scaledMines,
        clusterMines: Math.min(8, 4 + Math.floor(sector / 2)),
        glitchTiles: Math.min(6, 3 + Math.floor(sector / 3)),
        goldenTiles: 4,
        hazardDescription: 'Maximum threat matrix. Singularity resonance active.'
      };
    }
  }
}

// Create an initial empty board
export function createEmptyBoard(rows: number, cols: number): Cell[][] {
  const board: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        isClusterMine: false,
        isGlitch: false,
        isRevealed: false,
        isFlagged: false,
        isDefused: false,
        isGolden: false,
        adjacentMines: 0
      });
    }
    board.push(row);
  }
  return board;
}

// Get all 8 neighbors of a cell
export function getNeighbors(board: Cell[][], r: number, c: number): Cell[] {
  const neighbors: Cell[] = [];
  const rows = board.length;
  const cols = board[0].length;

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push(board[nr][nc]);
      }
    }
  }
  return neighbors;
}

// Calculate adjacent mine counts for all cells
export function recalculateAdjacencies(board: Cell[][], dampeningCoilActive: boolean = false) {
  const rows = board.length;
  const cols = board[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) continue;

      let count = 0;
      const neighbors = getNeighbors(board, r, c);
      for (const n of neighbors) {
        if (n.isMine && !n.isDefused) {
          if (n.isClusterMine && !dampeningCoilActive) {
            count += 2;
          } else {
            count += 1;
          }
        }
      }
      board[r][c].adjacentMines = count;
    }
  }
}

// Populate mines with guaranteed safe first click and Corner Compass support
export function populateBoardWithMines(
  board: Cell[][],
  startRow: number,
  startCol: number,
  mineCount: number,
  clusterMines: number,
  glitchTiles: number,
  goldenTiles: number,
  cornerCompassActive: boolean,
  dampeningCoilActive: boolean,
  rng?: () => number
): Cell[][] {
  const rand = rng || Math.random;
  const rows = board.length;
  const cols = board[0].length;

  // Protected cells (start cell and its neighbors)
  const protectedSet = new Set<string>();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = startRow + dr;
      const nc = startCol + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        protectedSet.add(`${nr},${nc}`);
      }
    }
  }

  // Corner compass protection
  if (cornerCompassActive) {
    protectedSet.add(`0,0`);
    protectedSet.add(`0,${cols - 1}`);
    protectedSet.add(`${rows - 1},0`);
    protectedSet.add(`${rows - 1},${cols - 1}`);
  }

  // Gather all candidate positions
  const candidates: { r: number; c: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!protectedSet.has(`${r},${c}`)) {
        candidates.push({ r, c });
      }
    }
  }

  // Shuffle candidates deterministically using seeded rand or Math.random
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  // Place mines
  const actualMines = Math.min(mineCount, candidates.length);
  for (let i = 0; i < actualMines; i++) {
    const { r, c } = candidates[i];
    board[r][c].isMine = true;
    if (i < clusterMines) {
      board[r][c].isClusterMine = true;
    }
  }

  // Place glitch tiles among safe candidates
  const safeCandidates = candidates.slice(actualMines);
  for (let i = 0; i < Math.min(glitchTiles, safeCandidates.length); i++) {
    const { r, c } = safeCandidates[i];
    board[r][c].isGlitch = true;
  }

  // Place golden tiles among remaining safe candidates
  const remainingSafe = safeCandidates.slice(glitchTiles);
  for (let i = 0; i < Math.min(goldenTiles, remainingSafe.length); i++) {
    const { r, c } = remainingSafe[i];
    board[r][c].isGolden = true;
  }

  // Recalculate numbers
  recalculateAdjacencies(board, dampeningCoilActive);

  return board;
}

// Flood-fill cascade for opening empty (0) cells
export function cascadeReveal(
  board: Cell[][],
  startRow: number,
  startCol: number
): { revealedCells: Cell[]; hitGoldenCount: number } {
  const queue: [number, number][] = [[startRow, startCol]];
  const visited = new Set<string>();
  const revealedCells: Cell[] = [];
  let hitGoldenCount = 0;

  const startKey = `${startRow},${startCol}`;
  visited.add(startKey);

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const cell = board[r][c];

    if (cell.isFlagged) continue;

    if (!cell.isRevealed) {
      cell.isRevealed = true;
      revealedCells.push(cell);
      if (cell.isGolden) {
        hitGoldenCount++;
      }
    }

    // If cell has 0 adjacent mines, expand to all neighbors
    if (cell.adjacentMines === 0 && !cell.isMine) {
      const neighbors = getNeighbors(board, r, c);
      for (const n of neighbors) {
        const key = `${n.row},${n.col}`;
        if (!visited.has(key) && !n.isRevealed && !n.isFlagged) {
          visited.add(key);
          queue.push([n.row, n.col]);
        }
      }
    }
  }

  return { revealedCells, hitGoldenCount };
}

// Chording helper: count flagged neighbors
export function countFlaggedNeighbors(board: Cell[][], r: number, c: number): number {
  const neighbors = getNeighbors(board, r, c);
  return neighbors.filter(n => n.isFlagged || n.isDefused || n.isDetonated).length;
}

// Check if sector is completely cleared:
// Satisfied when either all safe cells are revealed, OR all mines are neutralized (flagged, defused, or detonated) without false flags.
export function isSectorCleared(board: Cell[][]): boolean {
  if (!board || board.length === 0) return false;

  // Criterion 1: All non-mine cells are revealed
  const allSafeRevealed = board.every(row =>
    row.every(cell => cell.isMine || cell.isRevealed)
  );
  if (allSafeRevealed) return true;

  // Criterion 2: All mines are neutralized (flagged, defused, or detonated),
  // and no non-mine cells are flagged
  let hasMines = false;
  const allMinesNeutralized = board.every(row =>
    row.every(cell => {
      if (cell.isMine) {
        hasMines = true;
        return cell.isFlagged || cell.isDefused || cell.isDetonated;
      }
      return !cell.isFlagged;
    })
  );

  return hasMines && allMinesNeutralized;
}

// Helper to reveal all remaining safe cells when sector clears
export function revealAllSafeCells(board: Cell[][]): { revealedCount: number; goldenCount: number } {
  let revealedCount = 0;
  let goldenCount = 0;
  for (const row of board) {
    for (const cell of row) {
      if (!cell.isMine && !cell.isRevealed) {
        cell.isRevealed = true;
        revealedCount++;
        if (cell.isGolden) {
          goldenCount++;
        }
      }
    }
  }
  return { revealedCount, goldenCount };
}

// Quantum safety: Shift a mine away if quantum stabilizer activates
export function quantumEvacuateMine(
  board: Cell[][],
  r: number,
  c: number,
  dampeningCoilActive: boolean,
  rng?: () => number
): boolean {
  const rand = rng || Math.random;
  const cell = board[r][c];
  if (!cell.isMine) return false;

  // Find an unrevealed, non-mine, non-flagged cell to move the mine to
  const rows = board.length;
  const cols = board[0].length;
  const safeSpots: Cell[] = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const spot = board[i][j];
      if (!spot.isMine && !spot.isRevealed && !spot.isFlagged && (Math.abs(i - r) > 1 || Math.abs(j - c) > 1)) {
        safeSpots.push(spot);
      }
    }
  }

  if (safeSpots.length === 0) return false;

  // Relocate mine deterministically
  const destination = safeSpots[Math.floor(rand() * safeSpots.length)];
  destination.isMine = true;
  destination.isClusterMine = cell.isClusterMine;

  cell.isMine = false;
  cell.isClusterMine = false;

  recalculateAdjacencies(board, dampeningCoilActive);
  return true;
}
