import type { CardJSON, MockFightCreature, ActivatedAbility } from "../types/game";
import { resolveIllustrationPath, isWizardCard } from "./cardMapping";

export interface ActiveBuff {
  sourceName: string;
  power: number;
  toughness: number;
}

export const matchSubtype = (cardSubType: string, targetSubtype: string): boolean => {
  if (!cardSubType || !targetSubtype) return false;
  const s = cardSubType.toLowerCase().trim();
  const t = targetSubtype.toLowerCase().trim();
  if (s === t) return true;

  const stripPlural = (str: string) => {
    if (str.endsWith('ies')) return str.slice(0, -3) + 'y';
    if (str.endsWith('ves')) return str.slice(0, -3) + 'f';
    if (str.endsWith('s') && !str.endsWith('ss')) return str.slice(0, -1);
    return str;
  };

  const sClean = stripPlural(s);
  const tClean = stripPlural(t);
  return sClean === tClean || s.includes(tClean) || t.includes(sClean);
};

export const getCombatStatsAndBuffs = (
  creature: MockFightCreature,
  army: MockFightCreature[]
) => {
  const basePower = parseInt(creature.card.power || "0", 10);
  const baseToughness = parseInt(creature.card.toughness || "1", 10);

  let boostedPower = basePower;
  let boostedToughness = baseToughness;
  const activeBuffs: ActiveBuff[] = [];

  army.forEach(other => {
    if (other.id === creature.id) return;
    const otherT = parseInt(other.card.toughness || "1", 10);
    if (other.damage >= otherT) return;
    if (!other.card.activatedAbilities) return;

    other.card.activatedAbilities.forEach(ability => {
      if (ability.cost && ability.cost.length > 0) return;
      const text = ability.text.toLowerCase();
      const match = text.match(/(?:gives?\s+)?\+(\d+)\/\+(\d+)\s+to\s+all\s+([a-zA-Z]+)/i);
      if (!match) return;

      const pBoost = parseInt(match[1], 10);
      const tBoost = parseInt(match[2], 10);
      const targetSubtype = match[3];

      if (creature.card.cardSubType && matchSubtype(creature.card.cardSubType, targetSubtype)) {
        boostedPower += pBoost;
        boostedToughness += tBoost;
        activeBuffs.push({
          sourceName: other.card.name,
          power: pBoost,
          toughness: tBoost
        });
      }
    });
  });

  if (creature.activeSpells) {
    creature.activeSpells.forEach(spell => {
      const spellName = typeof spell === "string" ? spell : spell?.name || "";
      const spellNameLower = spellName.toLowerCase();
      let rulesText = typeof spell === "string"
        ? (spellNameLower === "strength" ? "+2/+2" : spellNameLower === "fear" ? "-1/-1" : "")
        : spell?.rulesText || spell?.customDescription || "";
      if (!rulesText && spellNameLower === "strength") rulesText = "+2/+2";
      if (!rulesText && spellNameLower === "fear") rulesText = "-1/-1";
      const text = `${spellName} ${rulesText}`.toLowerCase();
      const match = text.match(/([+-]\d+)\/([+-]\d+)/);
      if (match) {
        const pBoost = parseInt(match[1], 10);
        const tBoost = parseInt(match[2], 10);
        boostedPower += pBoost;
        boostedToughness += tBoost;
        activeBuffs.push({
          sourceName: spellName,
          power: pBoost,
          toughness: tBoost
        });
      }
    });
  }

  return {
    power: Math.max(0, boostedPower),
    toughness: Math.max(0, boostedToughness),
    buffs: activeBuffs
  };
};

export const applySubtypeBuffs = (army: MockFightCreature[]): MockFightCreature[] => {
  return army.map(creature => {
    const { power, toughness } = getCombatStatsAndBuffs(creature, army);
    return {
      ...creature,
      card: {
        ...creature.card,
        power: String(power),
        toughness: String(toughness)
      }
    };
  });
};

/**
 * Checks if a card has the flying ability either via its keywords or rules text.
 */
export const isFlying = (card: CardJSON, activeSpells?: (string | CardJSON | any)[]): boolean => {
  if (activeSpells && activeSpells.some(s => (typeof s === "string" ? s : s.name || "").toLowerCase() === "web")) {
    return false;
  }
  if (card.keywords && card.keywords.some(kw => kw.toLowerCase() === "flying")) {
    return true;
  }
  if (card.rulesText && card.rulesText.toLowerCase().includes("flying")) {
    return true;
  }
  if (activeSpells && activeSpells.some(s => (typeof s === "string" ? s : s.name || "").toLowerCase() === "flying")) {
    return true;
  }
  return false;
};

/**
 * Checks if a card has the trample ability either via its keywords or rules text.
 */
export const hasTrample = (card: CardJSON, activeSpells?: (string | CardJSON | any)[]): boolean => {
  if (card.keywords && card.keywords.some(kw => kw.toLowerCase() === "trample")) {
    return true;
  }
  if (card.rulesText && card.rulesText.toLowerCase().includes("trample")) {
    return true;
  }
  if (activeSpells && activeSpells.some(s => (typeof s === "string" ? s : s.name || "").toLowerCase() === "trample")) {
    return true;
  }
  return false;
};

export const hasFirstStrike = (card: CardJSON, activeSpells?: (string | CardJSON | any)[]): boolean => {
  if (card.keywords && card.keywords.some(kw => kw.toLowerCase() === "first strike")) {
    return true;
  }
  if (card.rulesText && card.rulesText.toLowerCase().includes("first strike")) {
    return true;
  }
  if (activeSpells && activeSpells.some(s => (typeof s === "string" ? s : s.name || "").toLowerCase() === "first strike")) {
    return true;
  }
  return false;
};

/**
 * Checks if a card has the stacking ability either via its keywords or rules text.
 */
export const hasStacking = (card: CardJSON): boolean => {
  if (card.keywords && card.keywords.some(kw => kw.toLowerCase() === "stacking")) {
    return true;
  }
  if (card.rulesText && card.rulesText.toLowerCase().includes("stacking")) {
    return true;
  }
  return false;
};


/**
 * Checks if a card can block flying creatures (either because it is Flying, or has Reach / "Can block flying creatures" ability).
 */
export const canBlockFlying = (card: CardJSON, activeSpells?: (string | CardJSON | any)[]): boolean => {
  if (!card) return false;
  if (isFlying(card, activeSpells)) return true;

  const cardNameLower = (card.name || "").toLowerCase();
  if (cardNameLower.includes("archer") || cardNameLower.includes("towerguard")) {
    return true;
  }

  if (card.keywords && card.keywords.some(kw => {
    const kwLower = kw.toLowerCase();
    return kwLower.includes("reach") || kwLower.includes("can block flying");
  })) {
    return true;
  }

  if (card.rulesText && (
    card.rulesText.toLowerCase().includes("can block flying") || 
    card.rulesText.toLowerCase().includes("reach")
  )) {
    return true;
  }

  if (card.activatedAbilities && card.activatedAbilities.some(ab => {
    const textLower = (ab.text || "").toLowerCase();
    return textLower.includes("can block flying") || textLower.includes("reach");
  })) {
    return true;
  }

  if (activeSpells && activeSpells.some(s => {
    const textLower = typeof s === "string" ? s.toLowerCase() : (s.rulesText || s.name || "").toLowerCase();
    return textLower.includes("can block flying") || textLower.includes("reach");
  })) {
    return true;
  }

  return false;
};

/**
 * Validates if a blocker can block an attacker.
 * In battle, flying creatures can be blocked by other flying creatures or units with Reach / "Can block flying creatures".
 */
export const canBlock = (
  attacker: CardJSON,
  blocker: CardJSON,
  attackerSpells?: (string | CardJSON | any)[],
  blockerSpells?: (string | CardJSON | any)[]
): boolean => {
  if (blockerSpells && blockerSpells.some(s => (typeof s === "string" ? s : s.name || "").toLowerCase() === "freeze")) {
    return false;
  }
  if (attackerSpells && attackerSpells.some(s => (typeof s === "string" ? s : s.name || "").toLowerCase() === "freeze")) {
    return false;
  }
  if (isFlying(attacker, attackerSpells)) {
    return canBlockFlying(blocker, blockerSpells);
  }
  return true;
};

export const createMedusaFreezeSpell = (medusaId: string): CardJSON => ({
  id: `medusa-freeze-${medusaId}`,
  name: "Freeze",
  manaCost: "",
  type: "Spell",
  color: "blue",
  illustration: "Freeze.jpg",
  rulesText: "Petrified by Medusa's gaze! Frozen until Medusa is slain or battle ends.",
  customDescription: "Petrified by Medusa's gaze",
  sourceMedusaId: medusaId
});

export const applyMedusaGazeIfNeeded = (
  attacker: MockFightCreature,
  blocker: MockFightCreature,
  logFn?: (msg: string) => void
) => {
  const isAttackerMedusa = (attacker.card.name || "").toLowerCase().includes("medusa");
  const isBlockerMedusa = (blocker.card.name || "").toLowerCase().includes("medusa");

  const attackerToughness = parseInt(attacker.card.toughness || "1", 10);
  const blockerToughness = parseInt(blocker.card.toughness || "1", 10);

  if (isAttackerMedusa && attacker.damage < attackerToughness) {
    const hasMedusaFreeze = blocker.activeSpells?.some(s => (s as any).sourceMedusaId === attacker.id);
    if (!hasMedusaFreeze) {
      blocker.activeSpells = [...(blocker.activeSpells || []), createMedusaFreezeSpell(attacker.id)];
      blocker.isAttacking = false;
      blocker.blockingId = null;
      if (logFn) logFn(`🐍 Medusa's gaze petrifies ${blocker.card.name}! Frozen until Medusa dies or battle ends.`);
    }
  }

  if (isBlockerMedusa && blocker.damage < blockerToughness) {
    const hasMedusaFreeze = attacker.activeSpells?.some(s => (s as any).sourceMedusaId === blocker.id);
    if (!hasMedusaFreeze) {
      attacker.activeSpells = [...(attacker.activeSpells || []), createMedusaFreezeSpell(blocker.id)];
      attacker.isAttacking = false;
      attacker.blockingId = null;
      if (logFn) logFn(`🐍 Medusa's gaze petrifies ${attacker.card.name}! Frozen until Medusa dies or battle ends.`);
    }
  }
};

export interface CombatResult {
  playerCreatures: MockFightCreature[];
  enemyCreatures: MockFightCreature[];
  playerDamage: number;
  enemyDamage: number;
  logs: string[];
}

/**
 * Processes lethal damage on creatures with multi-life abilities (such as Hydra's "3 Lives.").
 * If the creature has remaining lives > 1, decrements the lives count on the card,
 * resets its damage to 0, and returns true (indicating the creature survived).
 * Otherwise returns false (creature dies normally).
 */
export const processHydraLethalDamage = (
  c: MockFightCreature,
  logs?: string[]
): boolean => {
  if (!c || !c.card) return false;

  const abilities = c.card.activatedAbilities || [];
  const abilityIndex = abilities.findIndex(a => /(\d+)\s*lives?/i.test(a.text || ""));

  if (abilityIndex === -1) return false;

  const ability = abilities[abilityIndex];
  const match = (ability.text || "").match(/(\d+)\s*lives?/i);
  if (!match) return false;

  const currentLives = parseInt(match[1], 10);
  if (currentLives > 1) {
    const newLives = currentLives - 1;
    const newText = newLives === 1 ? "1 Life." : `${newLives} Lives.`;

    const updatedAbilities = [...abilities];
    updatedAbilities[abilityIndex] = {
      ...ability,
      text: newText
    };

    c.card = {
      ...c.card,
      activatedAbilities: updatedAbilities
    };
    c.damage = 0; // Reset damage to 0 on losing a life

    const logMsg = `🐍 ${c.card.name} lost a life! (${newLives} ${newLives === 1 ? "Life" : "Lives"} remaining)`;
    if (logs) logs.push(logMsg);
    return true; // Survived/revived
  }

  return false; // No lives remaining
};

/**
 * Pure function to resolve combat between Player and Enemy deployed creatures,
 * incorporating flying restrictions and trample damage carryover.
 */
export const resolveCombat = (
  playerArmy: MockFightCreature[],
  enemyArmy: MockFightCreature[],
  isQuestBattle: boolean = false
): CombatResult => {
  let playerDamage = 0;
  let enemyDamage = 0;
  const logs: string[] = ["⚔️ Resolving Battle Arena Combat (MTG style):"];

  // 1. First, apply subtype buffs to all creatures to get their actual current toughness values.
  const initialPlayer = applySubtypeBuffs(playerArmy);
  const initialEnemy = applySubtypeBuffs(enemyArmy);

  // 2. Identify which creatures are already dead from spells (or pre-existing damage) before combat resolution.
  const preDeadPlayer = initialPlayer.filter(c => {
    const toughness = parseInt(c.card.toughness || "1", 10);
    if (c.damage >= toughness) {
      const revived = processHydraLethalDamage(c, logs);
      if (revived) return false;
      return true;
    }
    return false;
  });
  const preDeadEnemy = initialEnemy.filter(c => {
    const toughness = parseInt(c.card.toughness || "1", 10);
    if (c.damage >= toughness) {
      const revived = processHydraLethalDamage(c, logs);
      if (revived) return false;
      return true;
    }
    return false;
  });

  // Log pre-combat spell deaths
  preDeadPlayer.forEach(c => {
    logs.push(`💀 Player's ${c.card.name} died from spells before combat!`);
  });
  preDeadEnemy.forEach(c => {
    logs.push(`💀 Sauron's ${c.card.name} died from spells before combat!`);
  });

  // 3. Filter living armies that will participate in combat (attacking/blocking)
  const livingPlayerArmy = playerArmy.filter(c => !preDeadPlayer.some(pd => pd.id === c.id));
  const livingEnemyArmy = enemyArmy.filter(c => !preDeadEnemy.some(pd => pd.id === c.id));

  // 4. Re-apply subtype buffs using ONLY the living creatures to ensure dead buff-givers don't affect survivors.
  let nextPlayer = applySubtypeBuffs(livingPlayerArmy);
  let nextEnemy = applySubtypeBuffs(livingEnemyArmy);

  nextPlayer.forEach(attacker => {
    if (!attacker.isAttacking) return;
    const isFrozen = attacker.activeSpells?.some(s => (typeof s === "string" ? s : s.name || "").toLowerCase() === "freeze");
    if (isFrozen) {
      logs.push(`❄️ Player's ${attacker.card.name} is Frozen and cannot deal damage!`);
      return;
    }

    const power = parseInt(attacker.card.power || "0", 10);
    const toughness = parseInt(attacker.card.toughness || "1", 10);

    const blockers = nextEnemy.filter(e => e.blockingId === attacker.id && !e.activeSpells?.some(s => (typeof s === "string" ? s : s.name || "").toLowerCase() === "freeze"));

    if (blockers.length === 0) {
      enemyDamage += power;
      const targetName = isQuestBattle ? "the Quest guardians" : "Sauron's Fortress";
      logs.push(`💥 Player's ${attacker.card.name} (${power}/${toughness}) is unblocked! Deals ${power} damage to ${targetName}.`);
    } else {
      if (hasTrample(attacker.card, attacker.activeSpells)) {
        let remainingPower = power;
        blockers.forEach(blocker => {
          const bPower = parseInt(blocker.card.power || "0", 10);
          const bToughness = parseInt(blocker.card.toughness || "1", 10);
          const lethalNeeded = Math.max(0, bToughness - blocker.damage);
          const damageToBlocker = Math.min(remainingPower, lethalNeeded);

          const attFirst = hasFirstStrike(attacker.card, attacker.activeSpells);
          const blockFirst = hasFirstStrike(blocker.card, blocker.activeSpells);

          const isAttMedusa = (attacker.card.name || "").toLowerCase().includes("medusa");
          const isBlkMedusa = (blocker.card.name || "").toLowerCase().includes("medusa");

          if (attFirst && !blockFirst) {
            // Attacker deals damage first
            blocker.damage += damageToBlocker;
            remainingPower -= damageToBlocker;
            if (blocker.damage < bToughness || isAttMedusa) {
              attacker.damage += bPower;
            }
          } else if (blockFirst && !attFirst) {
            // Blocker deals damage first
            attacker.damage += bPower;
            if (attacker.damage < toughness || isBlkMedusa) {
              blocker.damage += damageToBlocker;
              remainingPower -= damageToBlocker;
            } else {
              remainingPower = 0; // Attacker died, no excess damage
            }
          } else {
            // Simultaneous
            blocker.damage += damageToBlocker;
            attacker.damage += bPower;
            remainingPower -= damageToBlocker;
          }

          logs.push(
            `⚔️ Player's ${attacker.card.name} (${power}/${toughness}, Trample) fights blocker ${blocker.card.name} (${bPower}/${bToughness})! ` +
            `${attacker.card.name} takes ${bPower} damage. ` +
            `${blocker.card.name} takes ${damageToBlocker} damage (Total: ${blocker.damage}/${bToughness}).`
          );

          applyMedusaGazeIfNeeded(attacker, blocker, msg => logs.push(msg));
        });

        if (remainingPower > 0 && attacker.damage < toughness) {
          enemyDamage += remainingPower;
          const targetName = isQuestBattle ? "the Quest guardians" : "Sauron's Fortress";
          logs.push(`💥 Player's ${attacker.card.name} (${power}/${toughness}, Trample) trampled over blockers! Deals ${remainingPower} excess damage to ${targetName}.`);
        }
      } else {
        blockers.forEach(blocker => {
          const bPower = parseInt(blocker.card.power || "0", 10);
          const bToughness = parseInt(blocker.card.toughness || "1", 10);

          const attFirst = hasFirstStrike(attacker.card, attacker.activeSpells);
          const blockFirst = hasFirstStrike(blocker.card, blocker.activeSpells);
          const isAttMedusa = (attacker.card.name || "").toLowerCase().includes("medusa");
          const isBlkMedusa = (blocker.card.name || "").toLowerCase().includes("medusa");

          if (attFirst && !blockFirst) {
            blocker.damage += power;
            if (blocker.damage < bToughness || isAttMedusa) {
              attacker.damage += bPower;
            }
          } else if (blockFirst && !attFirst) {
            attacker.damage += bPower;
            if (attacker.damage < toughness || isBlkMedusa) {
              blocker.damage += power;
            }
          } else {
            attacker.damage += bPower;
            blocker.damage += power;
          }

          logs.push(
            `⚔️ Player's ${attacker.card.name} (${power}/${toughness}) fights blocker ${blocker.card.name} (${bPower}/${bToughness})! ` +
            `${attacker.card.name} takes ${bPower} damage (Total: ${attacker.damage}/${toughness}). ` +
            `${blocker.card.name} takes ${power} damage (Total: ${blocker.damage}/${bToughness}).`
          );

          applyMedusaGazeIfNeeded(attacker, blocker, msg => logs.push(msg));
        });
      }
    }
  });

  nextEnemy.forEach(attacker => {
    if (!attacker.isAttacking) return;
    const isFrozen = attacker.activeSpells?.some(s => (typeof s === "string" ? s : s.name || "").toLowerCase() === "freeze");
    if (isFrozen) {
      logs.push(`❄️ Sauron's ${attacker.card.name} is Frozen and cannot deal damage!`);
      return;
    }

    const power = parseInt(attacker.card.power || "0", 10);
    const toughness = parseInt(attacker.card.toughness || "1", 10);

    const blockers = nextPlayer.filter(p => p.blockingId === attacker.id && !p.activeSpells?.some(s => (typeof s === "string" ? s : s.name || "").toLowerCase() === "freeze"));

    if (blockers.length === 0) {
      playerDamage += power;
      logs.push(`💥 Sauron's ${attacker.card.name} (${power}/${toughness}) is unblocked! Deals ${power} damage to Your Tower.`);
    } else {
      if (hasTrample(attacker.card, attacker.activeSpells)) {
        let remainingPower = power;
        blockers.forEach(blocker => {
          const bPower = parseInt(blocker.card.power || "0", 10);
          const bToughness = parseInt(blocker.card.toughness || "1", 10);
          const lethalNeeded = Math.max(0, bToughness - blocker.damage);
          const damageToBlocker = Math.min(remainingPower, lethalNeeded);

          const attFirst = hasFirstStrike(attacker.card, attacker.activeSpells);
          const blockFirst = hasFirstStrike(blocker.card, blocker.activeSpells);
          const isAttMedusa = (attacker.card.name || "").toLowerCase().includes("medusa");
          const isBlkMedusa = (blocker.card.name || "").toLowerCase().includes("medusa");

          if (attFirst && !blockFirst) {
            blocker.damage += damageToBlocker;
            remainingPower -= damageToBlocker;
            if (blocker.damage < bToughness || isAttMedusa) {
              attacker.damage += bPower;
            }
          } else if (blockFirst && !attFirst) {
            attacker.damage += bPower;
            if (attacker.damage < toughness || isBlkMedusa) {
              blocker.damage += damageToBlocker;
              remainingPower -= damageToBlocker;
            } else {
              remainingPower = 0;
            }
          } else {
            blocker.damage += damageToBlocker;
            attacker.damage += bPower;
            remainingPower -= damageToBlocker;
          }

          logs.push(
            `⚔️ Sauron's ${attacker.card.name} (${power}/${toughness}, Trample) fights blocker ${blocker.card.name} (${bPower}/${bToughness})! ` +
            `${attacker.card.name} takes ${bPower} damage. ` +
            `${blocker.card.name} takes ${damageToBlocker} damage (Total: ${blocker.damage}/${bToughness}).`
          );

          applyMedusaGazeIfNeeded(attacker, blocker, msg => logs.push(msg));
        });

        if (remainingPower > 0 && attacker.damage < toughness) {
          playerDamage += remainingPower;
          logs.push(`💥 Sauron's ${attacker.card.name} (${power}/${toughness}, Trample) trampled over blockers! Deals ${remainingPower} excess damage to Your Tower.`);
        }
      } else {
        blockers.forEach(blocker => {
          const bPower = parseInt(blocker.card.power || "0", 10);
          const bToughness = parseInt(blocker.card.toughness || "1", 10);

          const attFirst = hasFirstStrike(attacker.card, attacker.activeSpells);
          const blockFirst = hasFirstStrike(blocker.card, blocker.activeSpells);
          const isAttMedusa = (attacker.card.name || "").toLowerCase().includes("medusa");
          const isBlkMedusa = (blocker.card.name || "").toLowerCase().includes("medusa");

          if (attFirst && !blockFirst) {
            blocker.damage += power;
            if (blocker.damage < bToughness || isAttMedusa) {
              attacker.damage += bPower;
            }
          } else if (blockFirst && !attFirst) {
            attacker.damage += bPower;
            if (attacker.damage < toughness || isBlkMedusa) {
              blocker.damage += power;
            }
          } else {
            attacker.damage += bPower;
            blocker.damage += power;
          }

          logs.push(
            `⚔️ Sauron's ${attacker.card.name} (${power}/${toughness}) fights blocker ${blocker.card.name} (${bPower}/${bToughness})! ` +
            `${attacker.card.name} takes ${bPower} damage (Total: ${attacker.damage}/${toughness}). ` +
            `${blocker.card.name} takes ${power} damage (Total: ${blocker.damage}/${bToughness}).`
          );

          applyMedusaGazeIfNeeded(attacker, blocker, msg => logs.push(msg));
        });
      }
    }
  });

  const deadMedusaIds = new Set<string>();

  const survivingPlayer = nextPlayer.filter(c => {
    const toughness = parseInt(c.card.toughness || "1", 10);
    if (c.damage >= toughness) {
      const revived = processHydraLethalDamage(c, logs);
      if (revived) return true;
      if ((c.card.name || "").toLowerCase().includes("medusa")) {
        deadMedusaIds.add(c.id);
      }
      logs.push(`💀 ${c.card.name} dies from lethal damage.`);
      return false;
    }
    return true;
  });

  const survivingEnemy = nextEnemy.filter(c => {
    const toughness = parseInt(c.card.toughness || "1", 10);
    if (c.damage >= toughness) {
      const revived = processHydraLethalDamage(c, logs);
      if (revived) return true;
      if ((c.card.name || "").toLowerCase().includes("medusa")) {
        deadMedusaIds.add(c.id);
      }
      logs.push(`💀 ${c.card.name} dies from lethal damage.`);
      return false;
    }
    return true;
  });

  const unfreezeDeadMedusaVictims = (creatures: MockFightCreature[]): MockFightCreature[] => {
    if (deadMedusaIds.size === 0) return creatures;
    return creatures.map(c => {
      if (!c.activeSpells || c.activeSpells.length === 0) return c;
      let unfreezeCount = 0;
      const updatedSpells = c.activeSpells.filter(s => {
        const sourceMedusaId = (s as any).sourceMedusaId;
        const sName = typeof s === "string" ? s : s?.name || "";
        if (sName.toLowerCase() === "freeze" && sourceMedusaId && deadMedusaIds.has(sourceMedusaId)) {
          unfreezeCount++;
          return false;
        }
        return true;
      });
      if (unfreezeCount > 0) {
        logs.push(`🐍 Medusa was slain! The petrifying gaze on ${c.card.name} is lifted.`);
      }
      return {
        ...c,
        activeSpells: updatedSpells
      };
    });
  };

  const finalSurvivingPlayer = unfreezeDeadMedusaVictims(survivingPlayer);
  const finalSurvivingEnemy = unfreezeDeadMedusaVictims(survivingEnemy);

  const finalPlayer = finalSurvivingPlayer.map(c => {
    const original = playerArmy.find(orig => orig.id === c.id);
    return {
      ...c,
      card: {
        ...c.card,
        power: original ? original.card.power : c.card.power,
        toughness: original ? original.card.toughness : c.card.toughness
      },
      isAttacking: false,
      blockingId: null
    };
  });

  const finalEnemy = finalSurvivingEnemy.map(c => {
    const original = enemyArmy.find(orig => orig.id === c.id);
    return {
      ...c,
      card: {
        ...c.card,
        power: original ? original.card.power : c.card.power,
        toughness: original ? original.card.toughness : c.card.toughness
      },
      isAttacking: false,
      blockingId: null
    };
  });

  return {
    playerCreatures: finalPlayer,
    enemyCreatures: finalEnemy,
    playerDamage,
    enemyDamage,
    logs
  };
};

const abilitySpellsCache = new Map<string, CardJSON>();

export const isManaSymbol = (s: string): boolean => {
  const clean = s.trim();
  if (clean.startsWith("{") && clean.endsWith("}")) return true;
  return /^[0-9RGWUBCAX]+$/i.test(clean) && clean.toUpperCase() !== "TAP";
};

export const formatManaSymbol = (s: string): string => {
  const clean = s.trim();
  if (clean.startsWith("{") && clean.endsWith("}")) return clean;
  return `{${clean.toUpperCase()}}`;
};

export const getOrCreateAbilitySpellCard = (creatureCard: CardJSON, ability: ActivatedAbility): CardJSON => {
  const cacheKey = `${creatureCard.name}-${ability.text}-${ability.cost.join(",")}`;
  if (abilitySpellsCache.has(cacheKey)) {
    return abilitySpellsCache.get(cacheKey)!;
  }

  // Parse mana cost: extract and format all parts in cost that look like mana symbols
  const manaCostSymbols = ability.cost.filter(isManaSymbol).map(formatManaSymbol);
  const manaCost = manaCostSymbols.join("");

  const resolvedIllustration = resolveIllustrationPath(creatureCard.type, creatureCard.illustration, creatureCard.name, creatureCard.cardSubType);

  const spellCard: CardJSON = {
    id: `ability-spell-${creatureCard.name.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: `${creatureCard.name} Ability`,
    manaCost: manaCost || "{0}",
    type: "Spell",
    cardSubType: "Battle",
    color: creatureCard.color,
    illustration: resolvedIllustration,
    rulesText: ability.text,
    customDescription: ability.text
  };

  abilitySpellsCache.set(cacheKey, spellCard);
  return spellCard;
};

export interface TurnLogGroup {
  turnNumber: number;
  logs: string[];
}

export const groupArenaLogsByTurn = (logs: string[]): TurnLogGroup[] => {
  const groups: TurnLogGroup[] = [];
  let currentTurn = 1;
  let currentLogs: string[] = [];

  for (const log of logs) {
    const match = log.match(/--- Turn (\d+) Started ---/i) || log.match(/--- Sandbox Battle Initialized: Turn (\d+) ---/i) || log.match(/Turn (\d+) Started/i);
    if (match) {
      if (currentLogs.length > 0) {
        groups.push({ turnNumber: currentTurn, logs: currentLogs });
        currentLogs = [];
      }
      currentTurn = parseInt(match[1], 10);
    } else if (log.match(/--- Turn \d+ Ended ---/i)) {
      continue;
    } else {
      currentLogs.push(log);
    }
  }

  if (currentLogs.length > 0 || groups.length === 0) {
    groups.push({ turnNumber: currentTurn, logs: currentLogs });
  }

  return groups;
};

export const isSpellArenaLog = (log: string): boolean => {
  if (!log) return false;
  const l = log.toLowerCase();
  if (l.startsWith("--- turn")) return false;
  if (l.includes("declares attack") || l.includes("declared attack") || l.includes("cancelled attacks")) return false;
  if (l.includes("side switched") || l.includes("combat phase") || l.includes("choosing attackers")) return false;
  if (l.includes("blocked ") || l.includes("blocks ")) return false;
  if (l.includes("is unblocked! deals") || l.includes("deals combat damage")) return false;
  if (l.includes("takes direct damage")) return false;
  if (l.includes("takes lethal damage") && !l.includes("poison") && !l.includes("spell") && !l.includes("died from")) return false;

  return (
    log.includes("🪄") ||
    log.includes("✨") ||
    log.includes("😈") ||
    log.includes("❄️") ||
    log.includes("☠️") ||
    log.includes("🌿") ||
    log.includes("🐍") ||
    l.includes("cast ") ||
    l.includes("casts ") ||
    l.includes("spell") ||
    l.includes("frozen") ||
    l.includes("freeze") ||
    l.includes("thawed") ||
    l.includes("poison") ||
    l.includes("regenerated") ||
    l.includes("disenchant") ||
    l.includes("summon demon") ||
    l.includes("clone") ||
    l.includes("fog") ||
    l.includes("petrifying gaze") ||
    l.includes("died from") ||
    l.includes("lost a life from")
  );
};

export const isWizardUnit = (card: CardJSON): boolean => {
  if (!card) return false;
  if (isWizardCard(card)) return true;
  const sub = (card.cardSubType || (card as any).subType || "").toLowerCase();
  const type = (card.type || "").toLowerCase();
  const name = (card.name || "").toLowerCase();
  return (
    sub.includes("wizard") ||
    sub.includes("grandmaster") ||
    type.includes("wizard") ||
    name.includes("mage") ||
    name.includes("warlock") ||
    name.includes("necromancer") ||
    name.includes("wizard")
  );
};

export const getSpellDamageAmount = (spellName: string, rulesText: string): number => {
  const name = spellName.toLowerCase();
  if (name === "lightning strike") return 2;
  if (name === "fireball") return 3;
  const match = (rulesText || "").toLowerCase().match(/deals?\s+(\d+)\s+damage/i);
  if (match) return parseInt(match[1], 10);
  if (name.includes("litch king") || name.includes("hellkite")) return 2;
  return 0;
};

export const evaluateBotSpellTargets = (
  spell: CardJSON,
  currentPlayer: MockFightCreature[],
  currentEnemy: MockFightCreature[]
): { targets: MockFightCreature[]; score: number } | null => {
  const spellName = (spell.name || "").toLowerCase();
  const rulesText = (spell.rulesText || "").toLowerCase();

  if (spellName.includes("counterspell") || (spell.type?.toLowerCase().includes("spell") && spellName.includes("counter"))) {
    return null;
  }

  const dmg = getSpellDamageAmount(spellName, rulesText);

  if (dmg > 0) {
    const killable = currentPlayer.filter(c => {
      const remainingHp = Math.max(1, parseInt(c.card.toughness || "1", 10) - c.damage);
      return dmg >= remainingHp;
    });
    if (killable.length > 0) {
      const sorted = [...killable].sort((a, b) => parseInt(b.card.power || "0", 10) - parseInt(a.card.power || "0", 10));
      return { targets: sorted, score: 1000 + parseInt(sorted[0].card.power || "0", 10) * 10 };
    }
    const sorted = [...currentPlayer].sort((a, b) => {
      const pDiff = parseInt(b.card.power || "0", 10) - parseInt(a.card.power || "0", 10);
      if (pDiff !== 0) return pDiff;
      return a.damage - b.damage;
    });
    return { targets: sorted, score: 400 + parseInt(sorted[0]?.card.power || "0", 10) * 5 };
  }

  if (spellName === "summon demon") {
    return { targets: [currentEnemy[0] || ({ id: "bot-summon-target", card: { name: "Enemy Army" } } as any)], score: 600 };
  }

  const attackingEnemy = currentEnemy.filter(c => c.isAttacking);

  if (spellName === "strength") {
    const atkTargets = attackingEnemy.filter(c => !c.activeSpells?.some(s => (typeof s === "string" ? s : s?.name || "").toLowerCase() === "strength"));
    if (atkTargets.length > 0) return { targets: atkTargets, score: 550 };
    const anyTargets = currentEnemy.filter(c => !c.activeSpells?.some(s => (typeof s === "string" ? s : s?.name || "").toLowerCase() === "strength"));
    if (anyTargets.length > 0) return { targets: anyTargets, score: 200 };
    return null;
  }

  if (spellName === "first strike") {
    const atkTargets = attackingEnemy.filter(c => !hasFirstStrike(c.card, c.activeSpells));
    if (atkTargets.length > 0) return { targets: atkTargets, score: 500 };
    const anyTargets = currentEnemy.filter(c => !hasFirstStrike(c.card, c.activeSpells));
    if (anyTargets.length > 0) return { targets: anyTargets, score: 180 };
    return null;
  }

  if (spellName === "trample") {
    const atkTargets = attackingEnemy.filter(c => !hasTrample(c.card, c.activeSpells));
    if (atkTargets.length > 0) return { targets: atkTargets, score: 500 };
    const anyTargets = currentEnemy.filter(c => !hasTrample(c.card, c.activeSpells));
    if (anyTargets.length > 0) return { targets: anyTargets, score: 180 };
    return null;
  }

  if (spellName === "regenerate") {
    const atkTargets = attackingEnemy.filter(c => !c.activeSpells?.some(s => (typeof s === "string" ? s : s?.name || "").toLowerCase() === "regenerate"));
    if (atkTargets.length > 0) return { targets: atkTargets, score: 480 };
    const dmgTargets = currentEnemy.filter(c => c.damage > 0);
    if (dmgTargets.length > 0) return { targets: dmgTargets, score: 250 };
    return null;
  }

  if (spellName === "freeze") {
    const eligible = currentPlayer.filter(c => !c.activeSpells?.some(s => (typeof s === "string" ? s : s?.name || "").toLowerCase() === "freeze"));
    if (eligible.length > 0) {
      const sorted = [...eligible].sort((a, b) => parseInt(b.card.power || "0", 10) - parseInt(a.card.power || "0", 10));
      return { targets: sorted, score: 350 + parseInt(sorted[0].card.power || "0", 10) * 5 };
    }
    return null;
  }

  if (spellName === "fear") {
    const eligible = currentPlayer.filter(c => !c.activeSpells?.some(s => (typeof s === "string" ? s : s?.name || "").toLowerCase() === "fear"));
    if (eligible.length > 0) return { targets: eligible, score: 300 };
    return null;
  }

  if (spellName === "poison") {
    const eligible = currentPlayer.filter(c => !c.activeSpells?.some(s => (typeof s === "string" ? s : s?.name || "").toLowerCase() === "poison"));
    if (eligible.length > 0) return { targets: eligible, score: 290 };
    return null;
  }

  if (spellName === "web") {
    const flyers = currentPlayer.filter(c => isFlying(c.card, c.activeSpells));
    if (flyers.length > 0) return { targets: flyers, score: 280 };
    return null;
  }

  if (spellName === "heal") {
    const damaged = currentEnemy.filter(c => c.damage > 0);
    if (damaged.length > 0) return { targets: damaged, score: 260 };
    return null;
  }

  if (spellName === "fog") {
    if (currentPlayer.some(p => p.isAttacking)) return { targets: currentPlayer, score: 340 };
    return null;
  }

  if (spellName === "clone") {
    if (currentEnemy.length > 0) {
      const sorted = [...currentEnemy].sort((a, b) => parseInt(b.card.power || "0", 10) - parseInt(a.card.power || "0", 10));
      return { targets: sorted, score: 320 };
    }
    return null;
  }

  if (spellName === "disenchant") {
    const enchantTargets = currentPlayer.filter(c => c.activeSpells && c.activeSpells.length > 0);
    if (enchantTargets.length > 0) return { targets: enchantTargets, score: 230 };
    return null;
  }

  if (rulesText.includes("enemy") || rulesText.includes("target creature") || rulesText.includes("opponent")) {
    return { targets: currentPlayer, score: 150 };
  }

  return { targets: currentEnemy, score: 100 };
};

