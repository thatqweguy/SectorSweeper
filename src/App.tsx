/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Cell,
  GameState,
  DisguiseMode,
  ActiveGadgetTool,
  ChallengeProtocol,
  PlayerStats,
  Item,
  BoosterPack
} from './types/game';
import {
  getSectorConfig,
  createEmptyBoard,
  populateBoardWithMines,
  cascadeReveal,
  getNeighbors,
  countFlaggedNeighbors,
  isSectorCleared,
  revealAllSafeCells,
  quantumEvacuateMine
} from './utils/minesweeper';
import { getProceduralShopItems, generateBoosterPack } from './utils/items';
import { soundManager } from './utils/audio';
import {
  generateRandomSeed,
  getDailySeed,
  isDailySeed,
  getSectorRng,
  getShopRng,
  formatDailyDate
} from './utils/seed';
import { Board } from './components/Board';
import { InventoryHUD } from './components/InventoryHUD';
import { ShopModal } from './components/ShopModal';
import { BossKeyDisguise } from './components/BossKeyDisguise';
import { RulesModal } from './components/RulesModal';
import { SeedModal } from './components/SeedModal';
import { EndGameModal } from './components/EndGameModal';
import { MainMenu } from './components/MainMenu';
import { ConfirmExitModal } from './components/ConfirmExitModal';
import { FloatingEffects, FloatingText } from './components/FloatingEffects';
import {
  Shield,
  Play,
  HelpCircle,
  EyeOff,
  Sparkles,
  Sliders,
  Monitor,
  Volume2,
  VolumeX,
  Keyboard,
  Key,
  Calendar
} from 'lucide-react';

export default function App() {
  // Primary State
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [stats, setStats] = useState<PlayerStats>({
    shields: 3,
    maxShields: 3,
    credits: 15,
    totalCreditsEarned: 15,
    score: 0,
    sector: 1,
    minesDefusedTotal: 0,
    tilesClearedTotal: 0,
    cascadesTriggered: 0,
    damageTakenTotal: 0,
    runDurationSeconds: 0,
    firstGuessSafe: true,
    gadgetsUsedTotal: 0,
    chordsExecutedTotal: 0,
    maxRelicSlots: 5,
    sectorHistory: []
  });

  const [sectorStartTime, setSectorStartTime] = useState<number>(Date.now());
  const [sectorDamageTaken, setSectorDamageTaken] = useState<number>(0);
  const [sectorCreditsEarned, setSectorCreditsEarned] = useState<number>(0);

  const [board, setBoard] = useState<Cell[][]>([]);
  const [firstClickDone, setFirstClickDone] = useState<boolean>(false);
  const [equippedRelics, setEquippedRelics] = useState<Item[]>([]);
  const [gadgets, setGadgets] = useState<Item[]>([]);
  const [activeTool, setActiveTool] = useState<ActiveGadgetTool>('none');
  const [disguiseMode, setDisguiseMode] = useState<DisguiseMode>('minimal');
  const [isBossKeyActive, setIsBossKeyActive] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [shopItems, setShopItems] = useState<Item[]>([]);
  const [shopBoosterPack, setShopBoosterPack] = useState<BoosterPack | null>(null);
  const [shopRerollCount, setShopRerollCount] = useState<number>(0);
  const [quantumBufferReady, setQuantumBufferReady] = useState<boolean>(true);

  // Seed system state
  const [currentSeed, setCurrentSeed] = useState<string>(() => generateRandomSeed());
  const [isSeedModalOpen, setIsSeedModalOpen] = useState<boolean>(false);

  // Audio settings
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isStealthAudio, setIsStealthAudio] = useState<boolean>(false);

  // Animation and Visual FX State
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isHitFlash, setIsHitFlash] = useState<boolean>(false);
  const [isEmpActive, setIsEmpActive] = useState<boolean>(false);
  const [isVictoryCelebration, setIsVictoryCelebration] = useState<boolean>(false);
  const [radarPulseCell, setRadarPulseCell] = useState<{ r: number; c: number } | null>(null);
  const [chordPulseCenter, setChordPulseCenter] = useState<{ r: number; c: number } | null>(null);
  const [chronoDialUsed, setChronoDialUsed] = useState<boolean>(false);
  const [aegisUsed, setAegisUsed] = useState<boolean>(false);
  const [selectedProtocol, setSelectedProtocol] = useState<ChallengeProtocol>('tactical');
  const [oxygenTimeLeft, setOxygenTimeLeft] = useState<number>(75);
  const [isEndlessActive, setIsEndlessActive] = useState<boolean>(false);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState<boolean>(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [smileyState, setSmileyState] = useState<'normal' | 'anxious' | 'hit' | 'dead' | 'win'>('normal');

  const addFloatingText = useCallback((text: string, type: FloatingText['type']) => {
    const id = `${Date.now()}-${Math.random()}`;
    setFloatingTexts(prev => [...prev.slice(-3), { id, text, type }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, 1600);
  }, []);

  const sectorConfig = getSectorConfig(stats.sector);
  const nextSectorConfig = getSectorConfig(stats.sector + 1);

  // Sync browser title based on disguise mode or boss key
  useEffect(() => {
    if (isBossKeyActive) {
      document.title = 'FY2026_Q3_Expenses_Consolidated.xlsx - Google Sheets';
    } else if (disguiseMode === 'classic') {
      document.title = `Minesweeper - Sector ${stats.sector}`;
    } else {
      document.title = `Sector ${stats.sector} - Sector Sweeper Roguelike`;
    }
  }, [isBossKeyActive, disguiseMode, stats.sector]);

  // Global Keyboard Shortcuts (Esc for Boss Key, 1-3 for gadgets)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isExitConfirmOpen) {
          setIsExitConfirmOpen(false);
          return;
        }
        e.preventDefault();
        setIsBossKeyActive(prev => !prev);
        return;
      }

      if (isBossKeyActive) return;

      if (e.key === '1' && gadgets.length >= 1) {
        handleTriggerGadgetByIndex(0);
      } else if (e.key === '2' && gadgets.length >= 2) {
        handleTriggerGadgetByIndex(1);
      } else if (e.key === '3' && gadgets.length >= 3) {
        handleTriggerGadgetByIndex(2);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBossKeyActive, gadgets, isExitConfirmOpen]);

  // Timer effect for tracking run duration
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timer = setInterval(() => {
      setStats(prev => ({
        ...prev,
        runDurationSeconds: prev.runDurationSeconds + 1
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Speedrun protocol oxygen countdown timer
  useEffect(() => {
    if (gameState !== 'PLAYING' || stats.protocol !== 'speedrun') return;

    const oxygenTimer = setInterval(() => {
      setOxygenTimeLeft(prev => {
        if (prev <= 1) {
          soundManager.playShieldHit();
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 450);
          setIsHitFlash(true);
          setTimeout(() => setIsHitFlash(false), 350);
          addFloatingText('OXYGEN DEPLETED! (-1 SHIELD) ⚠️', 'damage');
          setStats(s => {
            const nextShields = s.shields - 1;
            if (nextShields <= 0) {
              if (equippedRelics.some(r => r.id === 'hull_reinforcement') && !aegisUsed) {
                setAegisUsed(true);
                soundManager.playShieldHit();
                addFloatingText('⚡ AEGIS HARDLIGHT PREVENTED FATAL SUFFOCATION! 🛡️', 'shield');
                return {
                  ...s,
                  shields: 1,
                  damageTakenTotal: s.damageTakenTotal + 1
                };
              }
              setGameState('GAME_OVER');
            }
            return {
              ...s,
              shields: Math.max(0, nextShields),
              damageTakenTotal: s.damageTakenTotal + 1
            };
          });
          return 45; // Emergency replenish 45s
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(oxygenTimer);
  }, [gameState, stats.protocol]);

  // Initialize a fresh sector board
  const startSector = useCallback((sectorNum: number) => {
    const config = getSectorConfig(sectorNum);
    const newBoard = createEmptyBoard(config.rows, config.cols);
    setBoard(newBoard);
    setFirstClickDone(false);
    setActiveTool('none');
    setQuantumBufferReady(true);
    setChronoDialUsed(false);
    setOxygenTimeLeft(75);
    setChordPulseCenter(null);
    setIsVictoryCelebration(false);
    setSmileyState('normal');
    setSectorStartTime(Date.now());
    setSectorDamageTaken(0);
    setSectorCreditsEarned(0);
    setGameState('PLAYING');
  }, []);

  // Start new run from scratch with a specified seed or a freshly generated one
  const handleStartNewRun = (seedOverride?: string, protocolOverride?: ChallengeProtocol) => {
    const nextSeed = (seedOverride || generateRandomSeed()).toUpperCase();
    const activeProto = protocolOverride || selectedProtocol;
    setSelectedProtocol(activeProto);
    setCurrentSeed(nextSeed);
    setShopRerollCount(0);
    setIsEndlessActive(false);

    const startShields = activeProto === 'ironclad' ? 1 : 3;

    const initialStats: PlayerStats = {
      shields: startShields,
      maxShields: startShields,
      credits: 15,
      totalCreditsEarned: 15,
      score: 0,
      sector: 1,
      minesDefusedTotal: 0,
      tilesClearedTotal: 0,
      cascadesTriggered: 0,
      damageTakenTotal: 0,
      runDurationSeconds: 0,
      firstGuessSafe: true,
      gadgetsUsedTotal: 0,
      chordsExecutedTotal: 0,
      protocol: activeProto,
      maxRelicSlots: 5,
      sectorHistory: []
    };
    setStats(initialStats);
    setEquippedRelics([]);
    setGadgets([]);
    setAegisUsed(false);
    setShopBoosterPack(null);
    setIsVictoryCelebration(false);
    setSmileyState('normal');
    startSector(1);
  };

  // Ascend into Endless Void (Sector 13+)
  const handleAscendEndless = () => {
    setIsEndlessActive(true);
    const nextSec = stats.sector + 1; // 13+
    setStats(prev => ({
      ...prev,
      sector: nextSec,
      credits: prev.credits + 50,
      maxShields: prev.maxShields + 1,
      shields: prev.shields + 1,
      isEndless: true
    }));
    soundManager.playCash();
    addFloatingText('ASCENDED TO ENDLESS VOID! (+50 CR, +1 SHIELD) 🌌', 'victory');
    setShopRerollCount(0);
    const shopPool = getProceduralShopItems(
      equippedRelics.map(r => r.id),
      gadgets.map(g => g.id),
      3,
      getShopRng(currentSeed, nextSec, 0)
    );
    setShopItems(shopPool);
    setGameState('SHOP');
  };

  // Launch today's global daily classified mission
  const handleStartDailyRun = () => {
    const daily = getDailySeed();
    handleStartNewRun(daily);
  };

  // Replay the exact same seed from scratch
  const handleReplaySeed = (seedToReplay: string) => {
    handleStartNewRun(seedToReplay);
  };

  // Apply a custom entered seed from the modal and begin sweep
  const handleApplySeedAndRestart = (newSeed: string) => {
    handleStartNewRun(newSeed);
  };

  // Exit current game and return to main menu
  const handleConfirmExit = () => {
    setIsExitConfirmOpen(false);
    setGameState('TITLE');
    soundManager.playFlag();
    addFloatingText('MISSION ABORTED · RETURNED TO HQ', 'damage');
  };

  // Roll a fresh procedural seed on the main menu
  const handleRandomizeSeed = () => {
    const newSeed = generateRandomSeed();
    setCurrentSeed(newSeed);
    soundManager.playFlag();
    addFloatingText(`NEW MISSION SEED: ${newSeed} 🎲`, 'credit');
  };

  // Check passive relic possession
  const hasRelic = (relicId: string) => equippedRelics.some(r => r.id === relicId);

  // Consume charges on an active tool
  const consumeGadgetCharge = (gadgetId: string) => {
    setStats(prev => ({ ...prev, gadgetsUsedTotal: prev.gadgetsUsedTotal + 1 }));
    setGadgets(prev => {
      return prev
        .map(g => {
          if (g.id === gadgetId && g.charges) {
            const nextCharges = g.charges - 1;
            return { ...g, charges: nextCharges };
          }
          return g;
        })
        .filter(g => (g.charges === undefined ? true : g.charges > 0));
    });
  };

  // Instant consumable gadgets
  const handleUseInstantGadget = (gadgetId: string) => {
    if (gadgetId === 'field_repair') {
      if (stats.shields < stats.maxShields) {
        setStats(prev => ({ ...prev, shields: prev.shields + 1 }));
        consumeGadgetCharge('field_repair');
        soundManager.playDefusal();
        addFloatingText('+1 SHIELD REPAIRED 🛡️', 'shield');
      }
    } else if (gadgetId === 'emp_jammer') {
      // Trigger EMP Visual shockwave
      setIsEmpActive(true);
      setTimeout(() => setIsEmpActive(false), 700);
      addFloatingText('EMP JAMMER DISCHARGED ⚡', 'cascade');

      // Safely reveal 3 random unrevealed non-mine cells
      const safeUnrevealed: { r: number; c: number }[] = [];
      board.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (!cell.isMine && !cell.isRevealed && !cell.isFlagged) {
            safeUnrevealed.push({ r, c });
          }
        });
      });

      if (safeUnrevealed.length > 0) {
        const toReveal = [...safeUnrevealed].sort(() => Math.random() - 0.5).slice(0, 3);
        const nextBoard = [...board.map(row => [...row])];
        toReveal.forEach(({ r, c }) => {
          nextBoard[r][c].isRevealed = true;
        });
        setBoard(nextBoard);
        consumeGadgetCharge('emp_jammer');
        soundManager.playCascade();

        if (isSectorCleared(nextBoard)) {
          handleSectorCleared(nextBoard);
        }
      }
    } else if (gadgetId === 'recon_drone') {
      // Find 1 unrevealed, non-defused mine and disarm it
      const hiddenMines: { r: number; c: number }[] = [];
      board.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell.isMine && !cell.isDefused && !cell.isRevealed) {
            hiddenMines.push({ r, c });
          }
        });
      });

      if (hiddenMines.length > 0) {
        const target = hiddenMines[Math.floor(Math.random() * hiddenMines.length)];
        const nextBoard = board.map(row => [...row]);
        nextBoard[target.r][target.c].isDefused = true;
        nextBoard[target.r][target.c].isRevealed = true;
        setBoard(nextBoard);
        consumeGadgetCharge('recon_drone');
        soundManager.playDefusal();
        addFloatingText('RECON DRONE DISARMED MINE 🛸', 'defuse');

        if (hasRelic('demolition_payout')) {
          setStats(prev => ({
            ...prev,
            credits: prev.credits + 3,
            totalCreditsEarned: prev.totalCreditsEarned + 3,
            score: prev.score + 50,
            minesDefusedTotal: prev.minesDefusedTotal + 1
          }));
        } else {
          setStats(prev => ({
            ...prev,
            minesDefusedTotal: prev.minesDefusedTotal + 1
          }));
        }

        if (isSectorCleared(nextBoard)) {
          handleSectorCleared(nextBoard);
        }
      } else {
        addFloatingText('NO ACTIVE MINES FOUND 🔍', 'defuse');
      }
    } else if (gadgetId === 'credit_siphon') {
      soundManager.playCash();
      setStats(prev => ({
        ...prev,
        credits: prev.credits + 25,
        totalCreditsEarned: prev.totalCreditsEarned + 25
      }));
      setSectorCreditsEarned(prev => prev + 25);
      consumeGadgetCharge('credit_siphon');
      addFloatingText('+25 CREDITS LIQUIDATED 💰', 'gold');
    } else if (gadgetId === 'overcharge_surge') {
      soundManager.playShieldHit();
      setStats(prev => ({
        ...prev,
        shields: prev.shields + 1,
        maxShields: Math.max(prev.maxShields, prev.shields + 1)
      }));
      consumeGadgetCharge('overcharge_surge');
      addFloatingText('+1 OVERSHIELD CHARGED ⚡', 'shield');
    } else if (gadgetId === 'cryo_pulse') {
      const nextBoard = board.map(row => row.map(c => ({ ...c })));
      let disarmedCluster = false;
      const safeUnrevealed: { r: number; c: number }[] = [];

      nextBoard.forEach(row => {
        row.forEach(cell => {
          if (!disarmedCluster && cell.isClusterMine && !cell.isRevealed && !cell.isDefused) {
            cell.isDefused = true;
            cell.isRevealed = true;
            disarmedCluster = true;
          }
          if (!cell.isMine && !cell.isRevealed && !cell.isFlagged) {
            safeUnrevealed.push({ r: cell.row, c: cell.col });
          }
        });
      });

      const shuffled = [...safeUnrevealed].sort(() => Math.random() - 0.5);
      const toReveal = shuffled.slice(0, 4);
      toReveal.forEach(({ r, c }) => {
        nextBoard[r][c].isRevealed = true;
      });

      consumeGadgetCharge('cryo_pulse');
      soundManager.playCascade();
      setBoard(nextBoard);
      addFloatingText(
        disarmedCluster
          ? 'CRYO-PULSE: CLUSTER DISARMED + 4 TILES ❄️'
          : 'CRYO-PULSE: 4 TILES SAFELY REVEALED ❄️',
        'cascade'
      );

      if (isSectorCleared(nextBoard)) {
        handleSectorCleared(nextBoard);
      }
    }
  };

  // Trigger gadget selection by index [1, 2, 3]
  const handleTriggerGadgetByIndex = (index: number) => {
    const gadget = gadgets[index];
    if (!gadget) return;

    if (gadget.id === 'sonar_scanner') {
      setActiveTool(prev => (prev === 'sonar' ? 'none' : 'sonar'));
    } else if (gadget.id === 'mine_defuser') {
      setActiveTool(prev => (prev === 'defuse' ? 'none' : 'defuse'));
    } else if (gadget.id === 'xray_sensor') {
      setActiveTool(prev => (prev === 'xray' ? 'none' : 'xray'));
    } else if (gadget.id === 'cross_laser') {
      setActiveTool(prev => (prev === 'cross_laser' ? 'none' : 'cross_laser'));
    } else if (gadget.id === 'orbital_railgun') {
      setActiveTool(prev => (prev === 'railgun' ? 'none' : 'railgun'));
    } else {
      handleUseInstantGadget(gadget.id);
    }
  };

  // Handle Sector Complete
  const handleSectorCleared = (currentBoard: Cell[][]) => {
    const { revealedCount, goldenCount } = revealAllSafeCells(currentBoard);
    setBoard([...currentBoard]);
    soundManager.playVictory();

    // Reward calculations
    const baseReward = 10 + stats.sector * 3;
    let bonusReward = goldenCount * 5;

    // Relic: Scrap Magnet (+2 credits per correctly flagged/defused/detonated mine)
    if (hasRelic('scrap_collector')) {
      const correctMines = currentBoard.flat().filter(c => c.isMine && (c.isFlagged || c.isDefused || c.isDetonated)).length;
      bonusReward += correctMines * 2;
    }

    // Relic: Compound Ledger (+15% of current credits up to 15 CR)
    if (hasRelic('compound_interest')) {
      const dividend = Math.min(15, Math.floor(stats.credits * 0.15));
      if (dividend > 0) {
        bonusReward += dividend;
        addFloatingText(`+${dividend} CR COMPOUND YIELD 📈`, 'credit');
      }
    }

    // Relic: Accuracy Reprocessor (100% of mines correctly flagged/defused)
    if (hasRelic('mine_reprocessor')) {
      const allMines = currentBoard.flat().filter(c => c.isMine);
      const allDisarmed =
        allMines.length > 0 &&
        allMines.every(c => c.isFlagged || c.isDefused || c.isDetonated);
      if (allDisarmed) {
        bonusReward += 15;
        addFloatingText('100% ACCURACY BONUS! 🎯 (+15 CR)', 'gold');
      }
    }

    let sectorScoreBonus = stats.sector * 500 + stats.shields * 100 + revealedCount * 10;

    // Relic: Flawless Protocol (Clearing without taking shield damage)
    if (hasRelic('flawless_bounty') && sectorDamageTaken === 0) {
      bonusReward += 15;
      sectorScoreBonus += 500;
      addFloatingText('FLAWLESS PROTOCOL ACHIEVED! 🏆 (+15 CR)', 'gold');
    }

    // Relic: Overclock Ledger (+40% bonus credits)
    let totalEarned = baseReward + bonusReward;
    if (hasRelic('credit_overclock')) {
      totalEarned = Math.round(totalEarned * 1.4);
    }

    // Hacker Subroutine Modifiers: Prism (+50% credits & score), Glitched (+300 score, +2 Cr), Overclocked (+150 score)
    equippedRelics.forEach(r => {
      if (r.edition === 'prism') {
        totalEarned = Math.round(totalEarned * 1.5);
        sectorScoreBonus = Math.round(sectorScoreBonus * 1.5);
      } else if (r.edition === 'glitched') {
        totalEarned += 2;
        sectorScoreBonus += 300;
      } else if (r.edition === 'overclocked') {
        sectorScoreBonus += 150;
      }
    });

    // Relic: Regen Dynamo (Restores +1 Shield every 2 sectors)
    let restoredShields = stats.shields;
    if (hasRelic('shield_dynamo') && stats.sector % 2 === 0 && restoredShields < stats.maxShields) {
      restoredShields += 1;
    }

    const timeSpent = Math.max(1, Math.round((Date.now() - sectorStartTime) / 1000));

    // Trigger celebratory confetti and floating victory banner
    setIsVictoryCelebration(true);
    setSmileyState('win');
    addFloatingText(`SECTOR ${stats.sector} SECURED! 🎉 (+${totalEarned} CR)`, 'victory');

    const auditEntry = {
      sector: stats.sector,
      sectorName: sectorConfig.name,
      cleared: true,
      timeSpentSeconds: timeSpent,
      damageTaken: sectorDamageTaken,
      creditsEarned: sectorCreditsEarned + totalEarned
    };

    setStats(prev => ({
      ...prev,
      credits: prev.credits + totalEarned,
      totalCreditsEarned: prev.totalCreditsEarned + totalEarned,
      score: prev.score + sectorScoreBonus,
      shields: restoredShields,
      tilesClearedTotal: prev.tilesClearedTotal + revealedCount,
      sectorHistory: [...prev.sectorHistory, auditEntry]
    }));

    if (stats.sector >= 12 && !isEndlessActive) {
      setGameState('VICTORY');
    } else {
      // Prepare deterministic seeded shop items & booster pack
      setShopRerollCount(0);
      const shopRng = getShopRng(currentSeed, stats.sector, 0);
      const shopPool = getProceduralShopItems(
        equippedRelics.map(r => r.id),
        gadgets.map(g => g.id),
        3,
        shopRng
      );
      setShopItems(shopPool);
      setShopBoosterPack(generateBoosterPack(stats.sector, shopRng));
      setGameState('SHOP');
    }
  };

  // Primary Cell Click Handler
  const handleCellClick = (r: number, c: number) => {
    if (gameState !== 'PLAYING') return;

    let workingBoard = board.map(row => row.map(cell => ({ ...cell })));
    const targetCell = workingBoard[r][c];

    // GADGET TOOL HANDLING
    if (activeTool === 'sonar') {
      // Sonar Scan 3x3
      const neighbors = getNeighbors(workingBoard, r, c);
      const scanCells = [targetCell, ...neighbors];

      let safeOpened = 0;
      scanCells.forEach(cell => {
        if (cell.isMine) {
          // Safely flag without detonating!
          cell.isFlagged = true;
        } else if (!cell.isRevealed) {
          cell.isRevealed = true;
          safeOpened++;
        }
      });

      // Visual Radar ping effect
      setRadarPulseCell({ r, c });
      setTimeout(() => setRadarPulseCell(null), 650);
      addFloatingText('SECTOR RADAR SCANNED 📡', 'cascade');

      consumeGadgetCharge('sonar_scanner');
      setActiveTool('none');
      soundManager.playCascade();
      setBoard(workingBoard);

      if (isSectorCleared(workingBoard)) {
        handleSectorCleared(workingBoard);
      }
      return;
    }

    if (activeTool === 'defuse') {
      // Disarm Chisel
      if (targetCell.isMine) {
        targetCell.isDefused = true;
        targetCell.isRevealed = true;
        setStats(prev => ({
          ...prev,
          credits: prev.credits + 5,
          minesDefusedTotal: prev.minesDefusedTotal + 1,
          score: prev.score + 150
        }));
        soundManager.playDefusal();
        addFloatingText('THREAT DISARMED 🛡️ (+5 CR)', 'defuse');
      } else {
        targetCell.isRevealed = true;
        soundManager.playReveal(1);
        addFloatingText('SAFE SECTOR 🔍', 'cascade');
      }

      consumeGadgetCharge('mine_defuser');
      setActiveTool('none');
      setBoard(workingBoard);

      if (isSectorCleared(workingBoard)) {
        handleSectorCleared(workingBoard);
      }
      return;
    }

    if (activeTool === 'xray') {
      // X-Ray peek
      targetCell.isPeeking = true;
      setBoard(workingBoard);
      consumeGadgetCharge('xray_sensor');
      setActiveTool('none');
      soundManager.playReveal(1.8);
      addFloatingText('CELL SENSORS EXPOSED 👁️', 'defuse');

      setTimeout(() => {
        setBoard(current =>
          current.map(row =>
            row.map(cell =>
              cell.row === r && cell.col === c ? { ...cell, isPeeking: false } : cell
            )
          )
        );
      }, 4000);
      return;
    }

    if (activeTool === 'cross_laser') {
      // Cross Laser: Sweeps the entire row r and column c
      const rows = workingBoard.length;
      const cols = workingBoard[0].length;
      let safeCleared = 0;
      let minesDiscovered = 0;

      for (let cr = 0; cr < rows; cr++) {
        const cell = workingBoard[cr][c];
        if (cell.isMine) {
          if (!cell.isFlagged) {
            cell.isFlagged = true;
            minesDiscovered++;
          }
        } else if (!cell.isRevealed) {
          cell.isRevealed = true;
          safeCleared++;
        }
      }

      for (let cc = 0; cc < cols; cc++) {
        const cell = workingBoard[r][cc];
        if (cell.isMine) {
          if (!cell.isFlagged) {
            cell.isFlagged = true;
            minesDiscovered++;
          }
        } else if (!cell.isRevealed) {
          cell.isRevealed = true;
          safeCleared++;
        }
      }

      consumeGadgetCharge('cross_laser');
      setActiveTool('none');
      soundManager.playCascade();
      setBoard(workingBoard);
      addFloatingText(`CROSS BEAM: ${safeCleared} CLEARED, ${minesDiscovered} FLAGGED ⚡`, 'cascade');

      if (isSectorCleared(workingBoard)) {
        handleSectorCleared(workingBoard);
      }
      return;
    }

    if (activeTool === 'railgun') {
      let safeCleared = 0;
      let minesDisarmed = 0;
      workingBoard.forEach(row => {
        row.forEach(cell => {
          const onDiag1 = (cell.row - r === cell.col - c);
          const onDiag2 = (cell.row - r === -(cell.col - c));
          if (onDiag1 || onDiag2) {
            if (cell.isMine && !cell.isDefused) {
              cell.isDefused = true;
              cell.isRevealed = true;
              minesDisarmed++;
            } else if (!cell.isRevealed && !cell.isFlagged) {
              cell.isRevealed = true;
              safeCleared++;
            }
          }
        });
      });

      consumeGadgetCharge('orbital_railgun');
      setActiveTool('none');
      soundManager.playShieldHit();
      addFloatingText(`RAILGUN DISARMED ${minesDisarmed} MINES! ⚡`, 'defuse');

      if (minesDisarmed > 0) {
        setStats(prev => ({
          ...prev,
          credits: prev.credits + minesDisarmed * 5,
          minesDefusedTotal: prev.minesDefusedTotal + minesDisarmed,
          score: prev.score + minesDisarmed * 200
        }));
      }

      setBoard(workingBoard);
      if (isSectorCleared(workingBoard)) {
        handleSectorCleared(workingBoard);
      }
      return;
    }

    // NORMAL REVEAL LOGIC
    if (targetCell.isFlagged || targetCell.isRevealed) return;

    // First Click Generation
    if (!firstClickDone) {
      const sectorRng = getSectorRng(currentSeed, stats.sector);
      const extraGolden = hasRelic('golden_transmuter') ? 2 : 0;
      workingBoard = populateBoardWithMines(
        workingBoard,
        r,
        c,
        sectorConfig.mines,
        sectorConfig.clusterMines,
        sectorConfig.glitchTiles,
        sectorConfig.goldenTiles + extraGolden,
        hasRelic('corner_compass'),
        hasRelic('volatile_dampener'),
        sectorRng
      );

      // Relic: Logic Beacon (auto-clears 2 guaranteed safe cells)
      if (hasRelic('logic_beacon')) {
        const safeCandidates: Cell[] = [];
        workingBoard.forEach(row => {
          row.forEach(cell => {
            if (!cell.isMine && (cell.row !== r || cell.col !== c)) {
              safeCandidates.push(cell);
            }
          });
        });
        // Seeded shuffle of candidates
        for (let i = safeCandidates.length - 1; i > 0; i--) {
          const j = Math.floor(sectorRng() * (i + 1));
          [safeCandidates[i], safeCandidates[j]] = [safeCandidates[j], safeCandidates[i]];
        }
        const selectedSafe = safeCandidates.slice(0, 2);
        selectedSafe.forEach(cell => {
          cell.isRevealed = true;
        });
      }

      // Relic: Perimeter Sensor / Subsurface Geophone (auto-clears 3 safe perimeter border cells)
      if (hasRelic('subsurface_geophone')) {
        const borderCandidates: Cell[] = [];
        workingBoard.forEach(row => {
          row.forEach(cell => {
            const isBorder =
              cell.row === 0 ||
              cell.row === sectorConfig.rows - 1 ||
              cell.col === 0 ||
              cell.col === sectorConfig.cols - 1;
            if (isBorder && !cell.isMine && !cell.isRevealed) {
              borderCandidates.push(cell);
            }
          });
        });
        for (let i = borderCandidates.length - 1; i > 0; i--) {
          const j = Math.floor(sectorRng() * (i + 1));
          [borderCandidates[i], borderCandidates[j]] = [borderCandidates[j], borderCandidates[i]];
        }
        borderCandidates.slice(0, 3).forEach(cell => {
          cell.isRevealed = true;
        });
      }

      // Relic: Corner Compass (auto-reveals 4 corners)
      if (hasRelic('corner_compass')) {
        const lastR = sectorConfig.rows - 1;
        const lastC = sectorConfig.cols - 1;
        [
          workingBoard[0][0],
          workingBoard[0][lastC],
          workingBoard[lastR][0],
          workingBoard[lastR][lastC]
        ].forEach(corner => {
          if (!corner.isMine) corner.isRevealed = true;
        });
      }

      setFirstClickDone(true);
    }

    const clickedCell = workingBoard[r][c];

    // Check if clicked cell is a mine
    if (clickedCell.isMine && !clickedCell.isDefused) {
      // Check Relic: Quantum 50/50 Stabilizer
      if (hasRelic('quantum_buffer') && quantumBufferReady) {
        const sectorRng = getSectorRng(currentSeed, stats.sector);
        const evacuated = quantumEvacuateMine(workingBoard, r, c, hasRelic('volatile_dampener'), sectorRng);
        if (evacuated) {
          setQuantumBufferReady(false);
          soundManager.playDefusal();
          addFloatingText('QUANTUM EVACUATION! ⚛️', 'shield');

          // Safely cascade or reveal cell
          if (clickedCell.adjacentMines === 0) {
            cascadeReveal(workingBoard, r, c);
            soundManager.playCascade();
          } else {
            clickedCell.isRevealed = true;
            soundManager.playReveal(1);
          }
          setBoard(workingBoard);
          if (isSectorCleared(workingBoard)) {
            handleSectorCleared(workingBoard);
          }
          return;
        }
      }

      // Check Relic: Chrono Stabilizer (Rewind first detonation in sector)
      if (hasRelic('chrono_dial') && !chronoDialUsed) {
        setChronoDialUsed(true);
        clickedCell.isDefused = true;
        clickedCell.isRevealed = true;
        clickedCell.isFlagged = false;
        soundManager.playDefusal();
        addFloatingText('CHRONO REWIND DISARMED MINE! ⏳', 'shield');
        setStats(prev => ({
          ...prev,
          minesDefusedTotal: prev.minesDefusedTotal + 1,
          score: prev.score + 100
        }));
        setBoard(workingBoard);
        if (isSectorCleared(workingBoard)) {
          handleSectorCleared(workingBoard);
        }
        return;
      }

      // MINE DETONATION -> SHIELD ABSORPTION
      soundManager.playShieldHit();
      const nextShields = stats.shields - 1;
      setSectorDamageTaken(prev => prev + 1);

      // Screen Shake, Red Blast Vignette Flash, and Animated Smiley
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 450);
      setIsHitFlash(true);
      setTimeout(() => setIsHitFlash(false), 350);
      setSmileyState('hit');
      setTimeout(() => {
        setSmileyState(prev => (prev === 'hit' ? 'normal' : prev));
      }, 750);
      addFloatingText('ARMOR BREACHED (-1 SHIELD) 💥', 'damage');

      clickedCell.isDetonated = true;
      clickedCell.isRevealed = true;
      clickedCell.isDefused = true; // disarmed by armor blast
      clickedCell.isFlagged = false;

      // Relic: Reactive Plating (safely opens 8 adjacent cells)
      if (hasRelic('reactive_chobham')) {
        const neighbors = getNeighbors(workingBoard, r, c);
        neighbors.forEach(n => {
          if (!n.isMine && !n.isRevealed && !n.isFlagged) {
            n.isRevealed = true;
          }
        });
      }

      // Relic: Nanite Sponge (neutralizes 1 random unrevealed mine elsewhere into a safe cell)
      if (hasRelic('nanite_sponge')) {
        const otherMines: Cell[] = [];
        workingBoard.forEach(row => {
          row.forEach(cell => {
            if (cell.isMine && !cell.isRevealed && !cell.isDefused && !(cell.row === r && cell.col === c)) {
              otherMines.push(cell);
            }
          });
        });
        if (otherMines.length > 0) {
          const spongeTarget = otherMines[Math.floor(Math.random() * otherMines.length)];
          spongeTarget.isDefused = true;
          addFloatingText('NANITE SPONGE CONVERTED HAZARD 🧬', 'shield');
        }
      }

      // Relic: Demolition Bonus (+3 credits and +50 points)
      if (hasRelic('demolition_payout')) {
        setStats(prev => ({
          ...prev,
          credits: prev.credits + 3,
          totalCreditsEarned: prev.totalCreditsEarned + 3,
          score: prev.score + 50
        }));
        setSectorCreditsEarned(prev => prev + 3);
        addFloatingText('+3 DEMO BONUS 🛡️', 'credit');
      }

      setStats(prev => ({
        ...prev,
        shields: nextShields,
        damageTakenTotal: prev.damageTakenTotal + 1,
        minesDefusedTotal: prev.minesDefusedTotal + 1
      }));

      if (nextShields <= 0) {
        // Relic: Aegis Hardlight Core Second Chance!
        if (hasRelic('hull_reinforcement') && !aegisUsed) {
          setAegisUsed(true);
          soundManager.playShieldHit();
          setIsHitFlash(true);
          setTimeout(() => setIsHitFlash(false), 500);
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 600);
          addFloatingText('⚡ AEGIS HARDLIGHT OVERCHARGE! LETHAL BREACH AVERTED! 🛡️', 'shield');

          // Restores 1 emergency shield plate to stay operational!
          setStats(prev => ({
            ...prev,
            shields: 1
          }));

          // Neutralize the lethal mine so it does not remain a blown hazard
          clickedCell.isDetonated = false;
          clickedCell.isDefused = true;
          clickedCell.isRevealed = true;
          clickedCell.isFlagged = false;

          // Safely reveal adjacent safe neighbors so player has a clear path forward
          const neighbors = getNeighbors(workingBoard, r, c);
          neighbors.forEach(n => {
            if (!n.isMine && !n.isRevealed && !n.isFlagged) {
              n.isRevealed = true;
            }
          });

          setBoard(workingBoard);
          if (isSectorCleared(workingBoard)) {
            handleSectorCleared(workingBoard);
          }
          return;
        }

        // Game Over! Reveal all mines
        setSmileyState('dead');
        workingBoard.forEach(row => {
          row.forEach(cell => {
            if (cell.isMine) cell.isRevealed = true;
          });
        });
        soundManager.playGameOver();
        const timeSpent = Math.max(1, Math.round((Date.now() - sectorStartTime) / 1000));
        const failEntry = {
          sector: stats.sector,
          sectorName: sectorConfig.name,
          cleared: false,
          timeSpentSeconds: timeSpent,
          damageTaken: sectorDamageTaken + 1,
          creditsEarned: sectorCreditsEarned
        };
        setStats(prev => ({
          ...prev,
          sectorHistory: [...prev.sectorHistory, failEntry]
        }));
        setBoard(workingBoard);
        setGameState('GAME_OVER');
        return;
      }

      setBoard(workingBoard);

      // Check if this detonated/neutralized mine completes the sector!
      if (isSectorCleared(workingBoard)) {
        handleSectorCleared(workingBoard);
      }
      return;
    }

    // Safe Cell Click
    if (clickedCell.adjacentMines === 0) {
      const { revealedCells, hitGoldenCount } = cascadeReveal(workingBoard, r, c);
      soundManager.playCascade();

      const perGolden = hasRelic('golden_transmuter') ? 10 : 5;
      let bonusCredits = hitGoldenCount * perGolden;

      if (hasRelic('golden_transmuter') && hitGoldenCount > 0) {
        setGadgets(prev => {
          let restored = false;
          return prev.map(g => {
            if (!restored && g.charges !== undefined && g.maxCharges !== undefined && g.charges < g.maxCharges) {
              restored = true;
              return { ...g, charges: g.charges + 1 };
            }
            return g;
          });
        });
        addFloatingText(`TRANSMUTED: +${bonusCredits} CR & CHARGE RESTORED! ⭐`, 'gold');
      } else if (hitGoldenCount > 0) {
        addFloatingText(`+${hitGoldenCount * 5} CREDITS ⭐`, 'gold');
      }

      // Relic: Cascade Capacitor (+2 credits for cascades >= 5)
      if (hasRelic('cascade_capacitor') && revealedCells.length >= 5) {
        bonusCredits += 2;
      }

      let cascadeScore = revealedCells.length * 10;
      // Relic: Adrenalin Core (When down to 1 Shield, double credits and triple score)
      if (hasRelic('adrenalin_overdrive') && stats.shields === 1) {
        bonusCredits *= 2;
        cascadeScore *= 3;
        addFloatingText('ADRENALIN 2X BOOST! 🔥', 'gold');
      }

      if (revealedCells.length >= 4) {
        addFloatingText(`CASCADE x${revealedCells.length} 🌊`, 'cascade');
      }

      if (bonusCredits > 0) {
        setSectorCreditsEarned(prev => prev + bonusCredits);
      }

      setStats(prev => ({
        ...prev,
        credits: prev.credits + bonusCredits,
        totalCreditsEarned: prev.totalCreditsEarned + bonusCredits,
        tilesClearedTotal: prev.tilesClearedTotal + revealedCells.length,
        cascadesTriggered: prev.cascadesTriggered + 1,
        score: prev.score + cascadeScore
      }));
    } else {
      clickedCell.isRevealed = true;
      soundManager.playReveal(1 + clickedCell.adjacentMines * 0.1);

      let bonusCredits = 0;
      let cellScore = 15;

      if (clickedCell.isGolden) {
        const goldGain = hasRelic('golden_transmuter') ? 10 : 5;
        bonusCredits += goldGain;
        soundManager.playCash();
        if (hasRelic('golden_transmuter')) {
          setGadgets(prev => {
            let restored = false;
            return prev.map(g => {
              if (!restored && g.charges !== undefined && g.maxCharges !== undefined && g.charges < g.maxCharges) {
                restored = true;
                return { ...g, charges: g.charges + 1 };
              }
              return g;
            });
          });
          addFloatingText('+10 CREDITS & CHARGE RESTORED ✨', 'gold');
        } else {
          addFloatingText('+5 CREDITS ✨', 'gold');
        }
      }

      // Relic: High Roller Matrix (+1 credit for numbers 3+)
      if (hasRelic('high_roller') && clickedCell.adjacentMines >= 3) {
        bonusCredits += 1;
      }

      // Relic: Gambler's Matrix (+4 credits and +200 score for numbers 4+)
      if (hasRelic('gamblers_dice') && clickedCell.adjacentMines >= 4) {
        bonusCredits += 4;
        cellScore += 200;
        addFloatingText('HIGH THREAT MATRIX 🎲 (+4 CR)', 'gold');
      }

      // Relic: Adrenalin Core (When down to 1 Shield, double credits and triple score)
      if (hasRelic('adrenalin_overdrive') && stats.shields === 1) {
        bonusCredits *= 2;
        cellScore *= 3;
      }

      if (bonusCredits > 0) {
        setSectorCreditsEarned(prev => prev + bonusCredits);
      }

      setStats(prev => ({
        ...prev,
        credits: prev.credits + bonusCredits,
        totalCreditsEarned: prev.totalCreditsEarned + bonusCredits,
        tilesClearedTotal: prev.tilesClearedTotal + 1,
        score: prev.score + cellScore
      }));
    }

    setBoard(workingBoard);

    // Check Victory / Sector Clear
    if (isSectorCleared(workingBoard)) {
      handleSectorCleared(workingBoard);
    }
  };

  // Flag Right-Click Handler
  const handleCellContextMenu = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState !== 'PLAYING') return;

    if (stats.protocol === 'zero_flag') {
      addFloatingText('ZERO-FLAG PROTOCOL: FLAGS PROHIBITED! 🚫', 'damage');
      return;
    }

    const cell = board[r][c];
    if (cell.isRevealed) return;

    soundManager.playFlag();
    const willBeFlagged = !cell.isFlagged;

    // Relic: Bounty Tracker (Placing a flag on a confirmed mine yields +1 credit instantly)
    if (willBeFlagged && cell.isMine && hasRelic('bounty_tracker')) {
      soundManager.playCash();
      setStats(prev => ({
        ...prev,
        credits: prev.credits + 1,
        totalCreditsEarned: prev.totalCreditsEarned + 1
      }));
      setSectorCreditsEarned(prev => prev + 1);
      addFloatingText('+1 BOUNTY 🎯', 'gold');
    }
    const nextBoard = board.map(row =>
      row.map(curr => {
        if (curr.row === r && curr.col === c) {
          return { ...curr, isFlagged: !curr.isFlagged };
        }
        return curr;
      })
    );

    setBoard(nextBoard);

    if (isSectorCleared(nextBoard)) {
      handleSectorCleared(nextBoard);
    }
  };

  // Chording: Clicking already revealed number cell (Single-click atomic batch reveal like minesweeper.online)
  const handleChordClick = (r: number, c: number) => {
    if (gameState !== 'PLAYING') return;

    const cell = board[r][c];
    if (!cell.isRevealed || cell.adjacentMines === 0 || cell.isMine) return;

    const flagCount = countFlaggedNeighbors(board, r, c);
    const neighbors = getNeighbors(board, r, c);
    const unrevealedNeighbors = neighbors.filter(n => !n.isRevealed && !n.isFlagged);

    if (unrevealedNeighbors.length === 0) return;

    // If flags placed do not match the number on the cell, provide visual pulse feedback (like minesweeper.online)
    if (flagCount !== cell.adjacentMines) {
      setChordPulseCenter({ r, c });
      setTimeout(() => setChordPulseCenter(null), 250);
      return;
    }

    // ATOMIC BATCH CHORD REVEAL
    const workingBoard = board.map(row => row.map(curr => ({ ...curr })));
    let newShields = stats.shields;
    let sectorDmg = sectorDamageTaken;
    let bonusCredits = 0;
    let scoreGain = 0;
    let tilesCleared = 0;
    let cascadesCount = 0;
    let minesDisarmed = 0;
    let hitMine = false;
    let hitGoldenTotal = 0;

    // Chord amplifier relic
    if (hasRelic('golden_chisel')) {
      bonusCredits += (hasRelic('adrenalin_overdrive') && newShields === 1) ? 2 : 1;
    }

    // Process all unrevealed neighbors in this single atomic pass
    for (const n of unrevealedNeighbors) {
      const neighborCell = workingBoard[n.row][n.col];
      if (neighborCell.isRevealed || neighborCell.isFlagged) continue;

      if (neighborCell.isMine && !neighborCell.isDefused) {
        // Quantum buffer check
        if (hasRelic('quantum_buffer') && quantumBufferReady) {
          const sectorRng = getSectorRng(currentSeed, stats.sector);
          const evacuated = quantumEvacuateMine(workingBoard, n.row, n.col, hasRelic('volatile_dampener'), sectorRng);
          if (evacuated) {
            setQuantumBufferReady(false);
            soundManager.playDefusal();
            addFloatingText('QUANTUM EVACUATION! ⚛️', 'shield');
            if (neighborCell.adjacentMines === 0) {
              const { revealedCells, hitGoldenCount } = cascadeReveal(workingBoard, n.row, n.col);
              cascadesCount++;
              tilesCleared += revealedCells.length;
              hitGoldenTotal += hitGoldenCount;
            } else {
              neighborCell.isRevealed = true;
              tilesCleared++;
            }
            continue;
          }
        }

        // Chrono dial check
        if (hasRelic('chrono_dial') && !chronoDialUsed) {
          setChronoDialUsed(true);
          neighborCell.isDefused = true;
          neighborCell.isRevealed = true;
          minesDisarmed++;
          soundManager.playDefusal();
          addFloatingText('CHRONO REWIND DISARMED MINE! ⏳', 'shield');
          continue;
        }

        // Detonation absorbed by shield
        hitMine = true;
        sectorDmg++;
        newShields--;
        neighborCell.isDetonated = true;
        neighborCell.isRevealed = true;
        neighborCell.isDefused = true;
        minesDisarmed++;

        if (hasRelic('demolition_payout')) {
          bonusCredits += 3;
          scoreGain += 50;
        }

        // Reactive plating
        if (hasRelic('reactive_chobham')) {
          const adj = getNeighbors(workingBoard, n.row, n.col);
          adj.forEach(adjCell => {
            if (!adjCell.isMine && !adjCell.isRevealed && !adjCell.isFlagged) {
              adjCell.isRevealed = true;
              tilesCleared++;
            }
          });
        }
      } else {
        // Safe cell
        if (neighborCell.adjacentMines === 0) {
          const { revealedCells, hitGoldenCount } = cascadeReveal(workingBoard, n.row, n.col);
          cascadesCount++;
          tilesCleared += revealedCells.length;
          hitGoldenTotal += hitGoldenCount;

          const perGold = hasRelic('golden_transmuter') ? 10 : 5;
          let goldReward = hitGoldenCount * perGold;
          if (hasRelic('cascade_capacitor') && revealedCells.length >= 5) {
            goldReward += 2;
          }
          bonusCredits += goldReward;
          scoreGain += revealedCells.length * 10;
        } else {
          neighborCell.isRevealed = true;
          tilesCleared++;
          scoreGain += 15;
          if (neighborCell.isGolden) {
            hitGoldenTotal++;
            bonusCredits += hasRelic('golden_transmuter') ? 10 : 5;
          }
          if (hasRelic('high_roller') && neighborCell.adjacentMines >= 3) {
            bonusCredits += 1;
          }
          if (hasRelic('gamblers_dice') && neighborCell.adjacentMines >= 4) {
            bonusCredits += 4;
            scoreGain += 200;
          }
        }
      }
    }

    // Golden transmuter gadget charge restoration
    if (hasRelic('golden_transmuter') && hitGoldenTotal > 0) {
      setGadgets(prev => {
        let restored = false;
        return prev.map(g => {
          if (!restored && g.charges !== undefined && g.maxCharges !== undefined && g.charges < g.maxCharges) {
            restored = true;
            return { ...g, charges: g.charges + 1 };
          }
          return g;
        });
      });
      addFloatingText(`+${hitGoldenTotal * 10} CR & CHARGE RESTORED! ⭐`, 'gold');
    } else if (hitGoldenTotal > 0) {
      addFloatingText(`+${hitGoldenTotal * 5} CR GOLDEN CACHE! ⭐`, 'gold');
    }

    if (hitMine) {
      soundManager.playShieldHit();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 450);
      setIsHitFlash(true);
      setTimeout(() => setIsHitFlash(false), 350);
      setSmileyState('hit');
      setTimeout(() => setSmileyState(prev => (prev === 'hit' ? 'normal' : prev)), 750);
      addFloatingText('ARMOR BREACHED (-1 SHIELD) 💥', 'damage');
    } else {
      if (cascadesCount > 0) {
        soundManager.playCascade();
        addFloatingText(`CHORD CASCADE! 🌊`, 'cascade');
      } else {
        soundManager.playReveal(1.2);
      }
    }

    // Adrenalin Core (When down to 1 Shield)
    if (hasRelic('adrenalin_overdrive') && newShields === 1) {
      bonusCredits *= 2;
      scoreGain *= 3;
    }

    setSectorDamageTaken(sectorDmg);
    if (bonusCredits > 0) {
      setSectorCreditsEarned(prev => prev + bonusCredits);
    }

    // Apply stats
    setStats(prev => ({
      ...prev,
      shields: newShields,
      credits: prev.credits + bonusCredits,
      totalCreditsEarned: prev.totalCreditsEarned + bonusCredits,
      score: prev.score + scoreGain,
      tilesClearedTotal: prev.tilesClearedTotal + tilesCleared,
      cascadesTriggered: prev.cascadesTriggered + cascadesCount,
      damageTakenTotal: prev.damageTakenTotal + (hitMine ? 1 : 0),
      minesDefusedTotal: prev.minesDefusedTotal + minesDisarmed,
      chordsExecutedTotal: prev.chordsExecutedTotal + 1
    }));

    if (newShields <= 0) {
      // Relic: Aegis Hardlight Core Second Chance!
      if (hasRelic('hull_reinforcement') && !aegisUsed) {
        setAegisUsed(true);
        soundManager.playShieldHit();
        setIsHitFlash(true);
        setTimeout(() => setIsHitFlash(false), 500);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 600);
        addFloatingText('⚡ AEGIS HARDLIGHT OVERCHARGE! LETHAL CHORD AVERTED! 🛡️', 'shield');

        // Restore 1 emergency shield plate to stay operational!
        setStats(prev => ({
          ...prev,
          shields: 1
        }));

        // Disarm any mines in this chord that detonated
        unrevealedNeighbors.forEach(n => {
          const c = workingBoard[n.row][n.col];
          if (c.isMine && c.isDetonated) {
            c.isDetonated = false;
            c.isDefused = true;
          }
        });

        setBoard(workingBoard);
        if (isSectorCleared(workingBoard)) {
          handleSectorCleared(workingBoard);
        }
        return;
      }

      // Game Over
      setSmileyState('dead');
      workingBoard.forEach(row => {
        row.forEach(c => {
          if (c.isMine) c.isRevealed = true;
        });
      });
      soundManager.playGameOver();
      const timeSpent = Math.max(1, Math.round((Date.now() - sectorStartTime) / 1000));
      const failEntry = {
        sector: stats.sector,
        sectorName: sectorConfig.name,
        cleared: false,
        timeSpentSeconds: timeSpent,
        damageTaken: sectorDmg,
        creditsEarned: sectorCreditsEarned + bonusCredits
      };
      setStats(prev => ({
        ...prev,
        sectorHistory: [...prev.sectorHistory, failEntry]
      }));
      setBoard(workingBoard);
      setGameState('GAME_OVER');
      return;
    }

    setBoard(workingBoard);

    if (isSectorCleared(workingBoard)) {
      handleSectorCleared(workingBoard);
    }
  };

  // SHOP ACTIONS
  const handleBuyItem = (item: Item, effectiveCost?: number) => {
    const costToCharge = effectiveCost !== undefined ? effectiveCost : item.cost;
    if (stats.credits < costToCharge) return;

    if (item.type === 'relic') {
      const isGhost = item.edition === 'ghost';
      const slotConsumingRelics = equippedRelics.filter(r => r.edition !== 'ghost');
      if (!isGhost && slotConsumingRelics.length >= stats.maxRelicSlots) {
        addFloatingText('RELIC SLOTS FULL! SELL ONE FIRST 🚫', 'damage');
        return;
      }
    } else {
      // Gadget cap: max 4 charges
      const existing = gadgets.find(g => g.id === item.id);
      if (existing && (existing.charges || 0) >= 4) {
        addFloatingText('GADGET BELT CAPACITY FULL (MAX 4)! 🚫', 'damage');
        return;
      }
    }

    soundManager.playCash();
    setStats(prev => ({ ...prev, credits: prev.credits - costToCharge }));
    addFloatingText(`ACQUIRED: ${item.name} 🛒`, 'credit');

    if (item.type === 'relic') {
      // Special immediate effect for Hull Reinforcement & Aegis Super-Battery
      if (item.id === 'hull_reinforcement') {
        setStats(prev => ({
          ...prev,
          maxShields: prev.maxShields + 1,
          shields: Math.min(prev.maxShields + 1, prev.shields + 1)
        }));
      } else if (item.id === 'aegis_battery') {
        setStats(prev => ({
          ...prev,
          maxShields: prev.maxShields + 2,
          shields: prev.shields + 2
        }));
      } else if (item.id === 'apex_matrix') {
        setStats(prev => ({
          ...prev,
          maxShields: prev.maxShields + 1,
          shields: Math.min(prev.maxShields + 1, prev.shields + 1),
          score: prev.score + 500
        }));
        setGadgets(prev =>
          prev.map(g => ({
            ...g,
            maxCharges: Math.min(4, (g.maxCharges || 1) + 1),
            charges: Math.min(4, (g.charges || 1) + 1)
          }))
        );
      }
      setEquippedRelics(prev => [...prev, item]);
    } else {
      // Gadget
      setGadgets(prev => {
        const existing = prev.find(g => g.id === item.id);
        if (existing) {
          return prev.map(g =>
            g.id === item.id
              ? { ...g, charges: Math.min(4, (g.charges || 0) + (item.charges || 1)) }
              : g
          );
        }
        return [...prev, { ...item, charges: Math.min(4, item.charges || 1), maxCharges: 4 }];
      });
    }

    // Remove from shop shelf
    setShopItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handleSellRelic = (relicId: string, refundCredits: number) => {
    soundManager.playCash();
    setEquippedRelics(prev => prev.filter(r => r.id !== relicId));
    setStats(prev => ({
      ...prev,
      credits: prev.credits + refundCredits,
      totalCreditsEarned: prev.totalCreditsEarned + refundCredits
    }));
    addFloatingText(`SOLD RELIC (+${refundCredits} CR) 💰`, 'gold');
  };

  const handleBuyShieldRepair = (repairCost: number) => {
    if (stats.shields >= stats.maxShields || stats.credits < repairCost) return;

    soundManager.playDefusal();
    addFloatingText('+1 SHIELD REPAIRED 🛡️', 'shield');
    setStats(prev => ({
      ...prev,
      credits: prev.credits - repairCost,
      shields: prev.shields + 1
    }));
  };

  const handleBuyMaxShieldUpgrade = (maxUpgradeCost: number) => {
    if (stats.credits < maxUpgradeCost) return;

    soundManager.playDefusal();
    addFloatingText('+1 BULKHEAD UPGRADE 🛡️', 'shield');
    setStats(prev => ({
      ...prev,
      credits: prev.credits - maxUpgradeCost,
      maxShields: prev.maxShields + 1,
      shields: prev.shields + 1
    }));
  };

  const handleBuyRelicSlotUpgrade = (cost: number) => {
    if (stats.credits < cost || stats.maxRelicSlots >= 8) return;

    soundManager.playDefusal();
    addFloatingText('+1 RELIC SLOT UNLOCKED! 🧠', 'shield');
    setStats(prev => ({
      ...prev,
      credits: prev.credits - cost,
      maxRelicSlots: prev.maxRelicSlots + 1
    }));
  };

  const handleOpenBoosterPack = (optionId: string, cost: number) => {
    if (stats.credits < cost || !shopBoosterPack) return;

    const chosen = shopBoosterPack.options.find(o => o.id === optionId);
    if (!chosen) return;

    soundManager.playCash();
    addFloatingText(`ENHANCEMENT: ${chosen.title} ✨`, 'gold');
    setStats(prev => ({ ...prev, credits: prev.credits - cost }));

    if (chosen.actionType === 'credit_grant') {
      const addedCr = chosen.payload?.credits || 15;
      const addedScore = chosen.payload?.score || 0;
      setStats(prev => ({
        ...prev,
        credits: prev.credits + addedCr,
        totalCreditsEarned: prev.totalCreditsEarned + addedCr,
        score: prev.score + addedScore
      }));
    } else if (chosen.actionType === 'shield_grant') {
      const addedMax = chosen.payload?.maxShields || 1;
      setStats(prev => ({
        ...prev,
        maxShields: prev.maxShields + addedMax,
        shields: prev.shields + addedMax
      }));
    } else if (chosen.actionType === 'relic_slot') {
      const addedSlots = chosen.payload?.slots || 1;
      setStats(prev => ({
        ...prev,
        maxRelicSlots: Math.min(8, prev.maxRelicSlots + addedSlots)
      }));
    } else if (chosen.actionType === 'free_repair') {
      setStats(prev => ({
        ...prev,
        shields: prev.maxShields
      }));
    } else if (chosen.actionType === 'gadget_upgrade') {
      const chargeAdd = chosen.payload?.charges || 1;
      setGadgets(prev =>
        prev.map(g => ({
          ...g,
          charges: Math.min(4, (g.charges || 0) + chargeAdd)
        }))
      );
    }

    // Dismiss booster pack once claimed
    setShopBoosterPack(null);
  };

  const handleRerollShop = (rerollCost: number) => {
    if (stats.credits < rerollCost) return;

    soundManager.playFlag();
    addFloatingText('SUPPLIES RESTOCKED 🔄', 'credit');
    const nextReroll = shopRerollCount + 1;
    setShopRerollCount(nextReroll);
    if (rerollCost > 0) {
      setStats(prev => ({ ...prev, credits: prev.credits - rerollCost }));
    }
    const rng = getShopRng(currentSeed, stats.sector, nextReroll);
    const newItems = getProceduralShopItems(
      equippedRelics.map(r => r.id),
      gadgets.map(g => g.id),
      3,
      rng
    );
    setShopItems(newItems);
  };

  const handleProceedToNextSector = () => {
    const nextSec = stats.sector + 1;
    setShopRerollCount(0);
    setShopBoosterPack(null);
    setStats(prev => ({ ...prev, sector: nextSec }));
    setIsVictoryCelebration(false);
    startSector(nextSec);
  };

  // Sound Toggles
  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
  };

  const handleToggleStealthAudio = () => {
    const nextStealth = !isStealthAudio;
    setIsStealthAudio(nextStealth);
    soundManager.setStealthMode(nextStealth);
  };

  const threatsNeutralized = board
    .flat()
    .filter(c => c.isFlagged || (c.isMine && (c.isDetonated || c.isDefused))).length;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-start p-2 sm:p-3 transition-colors duration-200 relative overflow-x-hidden ${
      disguiseMode === 'classic'
        ? 'bg-[#008080] text-black font-sans'
        : 'bg-[#050905] cyber-grid-pattern text-emerald-400 font-sans'
    }`}>
      {/* Floating Combat Text, Screen Shake, and Particle Effects */}
      <FloatingEffects
        floatingTexts={floatingTexts}
        isHitFlash={isHitFlash}
        isVictoryCelebration={isVictoryCelebration}
        isEmpFlash={isEmpActive}
      />

      {/* BOSS KEY OVERLAY (Panic Switch) */}
      {isBossKeyActive && (
        <BossKeyDisguise onDismiss={() => setIsBossKeyActive(false)} />
      )}

      {/* SEED DISPATCHER MODAL */}
      {isSeedModalOpen && (
        <SeedModal
          currentSeed={currentSeed}
          disguiseMode={disguiseMode}
          onClose={() => setIsSeedModalOpen(false)}
          onApplySeedAndRestart={handleApplySeedAndRestart}
        />
      )}

      {/* RULES / MANUAL MODAL */}
      {isRulesOpen && (
        <RulesModal onClose={() => setIsRulesOpen(false)} />
      )}

      {/* CONFIRM EXIT TO MAIN MENU MODAL */}
      {isExitConfirmOpen && (
        <ConfirmExitModal
          sector={stats.sector}
          disguiseMode={disguiseMode}
          onConfirm={handleConfirmExit}
          onCancel={() => setIsExitConfirmOpen(false)}
        />
      )}

      {/* UPGRADED TACTICAL MAIN MENU SCREEN */}
      {gameState === 'TITLE' && (
        <MainMenu
          currentSeed={currentSeed}
          selectedProtocol={selectedProtocol}
          disguiseMode={disguiseMode}
          isMuted={isMuted}
          isStealthAudio={isStealthAudio}
          onSelectProtocol={proto => setSelectedProtocol(proto)}
          onStartRun={handleStartNewRun}
          onStartDailyRun={handleStartDailyRun}
          onOpenSeedModal={() => setIsSeedModalOpen(true)}
          onOpenRules={() => setIsRulesOpen(true)}
          onChangeDisguise={mode => setDisguiseMode(mode)}
          onToggleSound={handleToggleSound}
          onToggleStealthAudio={handleToggleStealthAudio}
          onRandomizeSeed={handleRandomizeSeed}
        />
      )}

      {/* ACTIVE GAMEPLAY HUD & BOARD */}
      {(gameState === 'PLAYING' || gameState === 'SHOP') && (
        <div className="w-full flex-1 flex flex-col items-center max-w-5xl justify-start">
          <InventoryHUD
            sector={stats.sector}
            shields={stats.shields}
            maxShields={stats.maxShields}
            credits={stats.credits}
            totalMines={sectorConfig.mines}
            flagsPlaced={threatsNeutralized}
            equippedRelics={equippedRelics}
            gadgets={gadgets}
            activeTool={activeTool}
            disguiseMode={disguiseMode}
            smileyState={smileyState}
            isMuted={isMuted}
            isStealthAudio={isStealthAudio}
            currentSeed={currentSeed}
            maxRelicSlots={stats.maxRelicSlots}
            aegisUsed={aegisUsed}
            onSelectTool={tool => setActiveTool(tool)}
            onUseInstantGadget={handleUseInstantGadget}
            onChangeDisguise={mode => setDisguiseMode(mode)}
            onToggleSound={handleToggleSound}
            onToggleStealthAudio={handleToggleStealthAudio}
            onTriggerBossKey={() => setIsBossKeyActive(true)}
            onOpenRules={() => setIsRulesOpen(true)}
            onOpenSeedModal={() => setIsSeedModalOpen(true)}
            onExitToMenu={() => setIsExitConfirmOpen(true)}
          />

          {/* Speedrun Oxygen Emergency Bar */}
          {stats.protocol === 'speedrun' && gameState === 'PLAYING' && (
            <div className="w-full max-w-xl my-1 flex items-center justify-between px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-500/60 text-amber-200 text-xs font-mono font-bold animate-pulse shadow-md">
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400 text-xs">⚠️</span>
                <span>OXYGEN PROTOCOL DRAINING:</span>
              </span>
              <span className="text-xs font-extrabold text-amber-300">{oxygenTimeLeft}s REMAINING</span>
            </div>
          )}

          {/* Active Sector Board */}
          <div className="w-full flex justify-center py-1">
            <Board
              board={board}
              disguiseMode={disguiseMode}
              activeTool={activeTool}
              isShaking={isShaking}
              isEmpActive={isEmpActive}
              radarPulseCell={radarPulseCell}
              chordPulseCenter={chordPulseCenter}
              onCellClick={handleCellClick}
              onCellContextMenu={handleCellContextMenu}
              onChordClick={handleChordClick}
              onPointerDown={() => {
                if (smileyState === 'normal') setSmileyState('anxious');
              }}
              onPointerUp={() => {
                if (smileyState === 'anxious') setSmileyState('normal');
              }}
            />
          </div>

          {/* Sector Briefing Footer */}
          <div className="mt-1 pb-1 text-center text-[11px] font-mono text-emerald-600/80">
            <span className="text-emerald-400 font-semibold">{sectorConfig.name}</span>
            <span className="mx-1.5">·</span>
            <span className="text-zinc-400">{sectorConfig.hazardDescription}</span>
          </div>
        </div>
      )}

      {/* INTER-SECTOR SHOP MODAL */}
      {gameState === 'SHOP' && (
        <ShopModal
          currentSector={stats.sector}
          nextConfig={nextSectorConfig}
          shopItems={shopItems}
          equippedRelics={equippedRelics}
          gadgets={gadgets}
          credits={stats.credits}
          shields={stats.shields}
          maxShields={stats.maxShields}
          maxRelicSlots={stats.maxRelicSlots}
          rerollCount={shopRerollCount}
          boosterPack={shopBoosterPack}
          disguiseMode={disguiseMode}
          hasBlackMarketPass={hasRelic('black_market_pass')}
          onBuyItem={handleBuyItem}
          onSellRelic={handleSellRelic}
          onBuyShieldRepair={handleBuyShieldRepair}
          onBuyMaxShieldUpgrade={handleBuyMaxShieldUpgrade}
          onBuyRelicSlotUpgrade={handleBuyRelicSlotUpgrade}
          onOpenBoosterPack={handleOpenBoosterPack}
          onRerollShop={handleRerollShop}
          onProceedToNextSector={handleProceedToNextSector}
          onExitToMenu={() => setIsExitConfirmOpen(true)}
        />
      )}

      {/* GAME OVER & VICTORY MODALS */}
      {(gameState === 'GAME_OVER' || gameState === 'VICTORY') && (
        <EndGameModal
          isVictory={gameState === 'VICTORY'}
          stats={stats}
          board={board}
          equippedRelics={equippedRelics}
          disguiseMode={disguiseMode}
          seed={currentSeed}
          onRestart={() => handleStartNewRun()}
          onReplaySeed={handleReplaySeed}
          onAscendEndless={handleAscendEndless}
          onExitToMenu={() => setGameState('TITLE')}
        />
      )}
    </div>
  );
}
