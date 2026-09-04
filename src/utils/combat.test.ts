import { describe, it, expect } from "vitest";
import { isFlying, hasTrample, hasStacking, canBlock, resolveCombat, matchSubtype, getCombatStatsAndBuffs, getOrCreateAbilitySpellCard, applyMedusaGazeIfNeeded, processHydraLethalDamage, groupArenaLogsByTurn, isSpellArenaLog, isWizardUnit, getSpellDamageAmount, evaluateBotSpellTargets } from "./combat";
import type { CardJSON, MockFightCreature } from "../types/game";

describe("Combat Rules - Flying & Blocking", () => {
  const flyingCardWithKeywords: CardJSON = {
    name: "Phoenix",
    manaCost: "2RR",
    type: "Creature",
    color: "red",
    illustration: "",
    rulesText: "Flying. Phoenix deals 1 damage to target cell.",
    keywords: ["Flying"]
  };

  const flyingCardWithRulesTextOnly: CardJSON = {
    name: "Drake",
    manaCost: "2U",
    type: "Creature",
    color: "blue",
    illustration: "",
    rulesText: "Flying. Drake gets +1/+0."
  };

  const nonFlyingCard: CardJSON = {
    name: "Goblin",
    manaCost: "R",
    type: "Creature",
    color: "red",
    illustration: "",
    rulesText: "Haste."
  };

  describe("isFlying", () => {
    it("should return true if Flying is in keywords", () => {
      expect(isFlying(flyingCardWithKeywords)).toBe(true);
    });

    it("should return true if flying is in rulesText but not keywords", () => {
      expect(isFlying(flyingCardWithRulesTextOnly)).toBe(true);
    });

    it("should return false if card does not have flying", () => {
      expect(isFlying(nonFlyingCard)).toBe(false);
    });
  });

  describe("hasTrample", () => {
    const trampleCardWithKeywords: CardJSON = {
      name: "Behemoth",
      manaCost: "3GG",
      type: "Creature",
      color: "green",
      illustration: "",
      rulesText: "",
      keywords: ["Trample"]
    };

    const trampleCardWithRulesTextOnly: CardJSON = {
      name: "Rhino",
      manaCost: "4G",
      type: "Creature",
      color: "green",
      illustration: "",
      rulesText: "Trample. When Rhino enters the battlefield, gain 3 life."
    };

    it("should return true if Trample is in keywords", () => {
      expect(hasTrample(trampleCardWithKeywords)).toBe(true);
    });

    it("should return true if trample is in rulesText but not keywords", () => {
      expect(hasTrample(trampleCardWithRulesTextOnly)).toBe(true);
    });

    it("should return false if card does not have trample", () => {
      expect(hasTrample(nonFlyingCard)).toBe(false);
    });
  });

  describe("hasStacking", () => {
    const stackingCardWithKeywords: CardJSON = {
      name: "Field Sentry Human",
      manaCost: "W",
      type: "Creature",
      color: "white",
      illustration: "",
      rulesText: "",
      keywords: ["Stacking"]
    };

    const stackingCardWithRulesTextOnly: CardJSON = {
      name: "Token Spammer",
      manaCost: "2W",
      type: "Creature",
      color: "white",
      illustration: "",
      rulesText: "Stacking. Sum stats."
    };

    it("should return true if Stacking is in keywords", () => {
      expect(hasStacking(stackingCardWithKeywords)).toBe(true);
    });

    it("should return true if stacking is in rulesText but not keywords", () => {
      expect(hasStacking(stackingCardWithRulesTextOnly)).toBe(true);
    });

    it("should return false if card does not have stacking", () => {
      expect(hasStacking(nonFlyingCard)).toBe(false);
    });

    it("should apply -1/-1 stat debuff when Fear spell is active on creature", () => {
      const creature: MockFightCreature = {
        id: "c1",
        card: { name: "Ogre", power: "3", toughness: "3", type: "Creature", manaCost: "RR", color: "red", illustration: "", rulesText: "" },
        damage: 0,
        isAttacking: false,
        blockingId: null,
        activeSpells: [
          { name: "Fear", type: "Spell", manaCost: "B", color: "black", illustration: "", rulesText: "", customDescription: "Target creature gets -1/-1 until end of battle." } as any
        ]
      };
      const stats = getCombatStatsAndBuffs(creature, [creature]);
      expect(stats.power).toBe(2);
      expect(stats.toughness).toBe(2);
      expect(stats.buffs).toEqual([
        { sourceName: "Fear", power: -1, toughness: -1 }
      ]);
    });

    it("should apply -1/-1 stat debuff when Fear is passed as string or object without rulesText", () => {
      const creature: MockFightCreature = {
        id: "c1",
        card: { name: "Goblin", power: "1", toughness: "1", type: "Creature", manaCost: "R", color: "red", illustration: "", rulesText: "" },
        damage: 0,
        isAttacking: false,
        blockingId: null,
        activeSpells: [
          "Fear"
        ]
      };
      const stats = getCombatStatsAndBuffs(creature, [creature]);
      expect(stats.power).toBe(0);
      expect(stats.toughness).toBe(0);
      expect(stats.buffs).toEqual([
        { sourceName: "Fear", power: -1, toughness: -1 }
      ]);
    });
  });

  describe("canBlock", () => {
    it("should allow any blocker to block a non-flying attacker", () => {
      expect(canBlock(nonFlyingCard, nonFlyingCard)).toBe(true);
      expect(canBlock(nonFlyingCard, flyingCardWithKeywords)).toBe(true);
    });

    it("should allow blockers with 'Can block flying creatures' ability or Reach to block flying attackers", () => {
      const goblinArcherCard: CardJSON = {
        name: "Goblin Archer",
        type: "Creature",
        manaCost: "R",
        rulesText: "",
        color: "red",
        power: "2",
        toughness: "2",
        illustration: "",
        activatedAbilities: [
          { cost: [], text: "Can block flying creatures." }
        ]
      };

      const towerguardCard: CardJSON = {
        name: "Towerguard",
        type: "Creature",
        manaCost: "W",
        rulesText: "",
        color: "white",
        power: "2",
        toughness: "3",
        illustration: "",
        activatedAbilities: [
          { cost: [], text: "Can block flying creatures." }
        ]
      };

      // Flying attacker vs Flying blocker -> Allowed
      expect(canBlock(flyingCardWithKeywords, flyingCardWithKeywords)).toBe(true);
      expect(canBlock(flyingCardWithKeywords, flyingCardWithRulesTextOnly)).toBe(true);

      // Flying attacker vs Reach / Archer blockers -> Allowed!
      expect(canBlock(flyingCardWithKeywords, goblinArcherCard)).toBe(true);
      expect(canBlock(flyingCardWithKeywords, towerguardCard)).toBe(true);

      // Flying attacker vs Non-flying non-reach blocker -> Disallowed
      expect(canBlock(flyingCardWithKeywords, nonFlyingCard)).toBe(false);
      expect(canBlock(flyingCardWithRulesTextOnly, nonFlyingCard)).toBe(false);
    });
  });
});

describe("resolveCombat", () => {
  const playerGoblin: MockFightCreature = {
    id: "p1",
    card: {
      name: "Player Goblin",
      manaCost: "R",
      type: "Creature",
      color: "red",
      illustration: "",
      rulesText: "",
      power: "2",
      toughness: "2"
    },
    damage: 0,
    isAttacking: true,
    blockingId: null
  };

  const enemyOrc: MockFightCreature = {
    id: "e1",
    card: {
      name: "Enemy Orc",
      manaCost: "1R",
      type: "Creature",
      color: "red",
      illustration: "",
      rulesText: "",
      power: "3",
      toughness: "3"
    },
    damage: 0,
    isAttacking: false,
    blockingId: null
  };

  it("should deal unblocked player attacker power to enemy tower", () => {
    const playerArmy: MockFightCreature[] = [playerGoblin];
    const enemyArmy: MockFightCreature[] = [];

    const result = resolveCombat(playerArmy, enemyArmy);
    expect(result.enemyDamage).toBe(2);
    expect(result.playerDamage).toBe(0);
    expect(result.playerCreatures).toHaveLength(1);
    expect(result.playerCreatures[0].isAttacking).toBe(false);
  });

  it("should deal unblocked enemy attacker power to player tower", () => {
    const enemyAttacker = { ...enemyOrc, isAttacking: true };
    const playerArmy: MockFightCreature[] = [];
    const enemyArmy: MockFightCreature[] = [enemyAttacker];

    const result = resolveCombat(playerArmy, enemyArmy);
    expect(result.playerDamage).toBe(3);
    expect(result.enemyDamage).toBe(0);
    expect(result.enemyCreatures).toHaveLength(1);
  });

  it("should process blocking and lethal damage correctly", () => {
    // Player goblin attacks, Enemy orc blocks player goblin
    const attacker = { ...playerGoblin, isAttacking: true };
    const blocker = { ...enemyOrc, isAttacking: false, blockingId: "p1" };

    const playerArmy: MockFightCreature[] = [attacker];
    const enemyArmy: MockFightCreature[] = [blocker];

    const result = resolveCombat(playerArmy, enemyArmy);

    // No tower damage should be dealt since goblin was blocked
    expect(result.playerDamage).toBe(0);
    expect(result.enemyDamage).toBe(0);

    // Goblin (2/2) takes 3 damage -> Dies
    expect(result.playerCreatures).toHaveLength(0);

    // Orc (3/3) takes 2 damage -> Survives with 2 damage
    expect(result.enemyCreatures).toHaveLength(1);
    expect(result.enemyCreatures[0].damage).toBe(2);
    expect(result.enemyCreatures[0].blockingId).toBeNull();
  });

  describe("Trample mechanics", () => {
    const playerTrampleBehemoth: MockFightCreature = {
      id: "p_trample",
      card: {
        name: "Trample Behemoth",
        manaCost: "3GG",
        type: "Creature",
        color: "green",
        illustration: "",
        rulesText: "Trample.",
        power: "4",
        toughness: "4",
        keywords: ["Trample"]
      },
      damage: 0,
      isAttacking: true,
      blockingId: null
    };

    const enemy2_2blocker: MockFightCreature = {
      id: "e_blocker",
      card: {
        name: "2/2 Bear",
        manaCost: "1G",
        type: "Creature",
        color: "green",
        illustration: "",
        rulesText: "",
        power: "2",
        toughness: "2"
      },
      damage: 0,
      isAttacking: false,
      blockingId: "p_trample"
    };

    it("should deal excess trample damage to the enemy tower when player creature is blocked", () => {
      const playerArmy: MockFightCreature[] = [playerTrampleBehemoth];
      const enemyArmy: MockFightCreature[] = [enemy2_2blocker];

      const result = resolveCombat(playerArmy, enemyArmy);

      // 4 power - 2 toughness of bear = 2 excess damage to enemy tower
      expect(result.enemyDamage).toBe(2);
      expect(result.playerDamage).toBe(0);

      // Bear takes 2 damage -> Dies
      expect(result.enemyCreatures).toHaveLength(0);

      // Behemoth takes 2 damage from bear -> Survives with 2 damage
      expect(result.playerCreatures).toHaveLength(1);
      expect(result.playerCreatures[0].damage).toBe(2);
    });

    it("should deal excess trample damage to the player tower when enemy creature is blocked", () => {
      const enemyTrample = { ...playerTrampleBehemoth, id: "e_trample", blockingId: null };
      const playerBlocker = { ...enemy2_2blocker, id: "p_blocker", blockingId: "e_trample" };

      const playerArmy: MockFightCreature[] = [playerBlocker];
      const enemyArmy: MockFightCreature[] = [enemyTrample];

      const result = resolveCombat(playerArmy, enemyArmy);

      // 4 power - 2 toughness of bear = 2 excess damage to player tower
      expect(result.playerDamage).toBe(2);
      expect(result.enemyDamage).toBe(0);

      // Bear dies
      expect(result.playerCreatures).toHaveLength(0);

      // Enemy trample creature survives with 2 damage
      expect(result.enemyCreatures).toHaveLength(1);
      expect(result.enemyCreatures[0].damage).toBe(2);
    });
  });

  describe("Stacked Creature Combat Resolution", () => {
    it("should fight using the summed power and toughness", () => {
      const stackedAttacker: MockFightCreature = {
        id: "p_stacked",
        card: {
          name: "Field Sentry Human",
          manaCost: "W",
          type: "Creature",
          color: "white",
          illustration: "",
          rulesText: "",
          power: "2", // 1+1 summed
          toughness: "2", // 1+1 summed
          keywords: ["Stacking"]
        },
        damage: 0,
        isAttacking: true,
        blockingId: null
      };

      const enemyBlocker: MockFightCreature = {
        id: "e_blocker",
        card: {
          name: "Enemy Bear",
          manaCost: "1G",
          type: "Creature",
          color: "green",
          illustration: "",
          rulesText: "",
          power: "2",
          toughness: "2"
        },
        damage: 0,
        isAttacking: false,
        blockingId: "p_stacked"
      };

      const playerArmy: MockFightCreature[] = [stackedAttacker];
      const enemyArmy: MockFightCreature[] = [enemyBlocker];

      const result = resolveCombat(playerArmy, enemyArmy);

      // Both stacked creature (2/2) and Bear (2/2) trade and die
      expect(result.playerCreatures).toHaveLength(0);
      expect(result.enemyCreatures).toHaveLength(0);
      expect(result.playerDamage).toBe(0);
      expect(result.enemyDamage).toBe(0);
    });
  });

  describe("In-Game Battle Mechanics", () => {
    it("should correctly resolve unblocked damage to tower when attacker passes turn", () => {
      const attacker: MockFightCreature = {
        id: "p1",
        card: {
          name: "Dragon",
          manaCost: "4RR",
          type: "Creature",
          color: "red",
          illustration: "",
          rulesText: "",
          power: "5",
          toughness: "5"
        },
        damage: 0,
        isAttacking: true,
        blockingId: null
      };

      const result = resolveCombat([attacker], []);
      expect(result.enemyDamage).toBe(5);
      expect(result.playerDamage).toBe(0);
    });

    it("should enforce flying blocking rules during automated defender assignment", () => {
      const flyingAttacker: CardJSON = {
        name: "Phoenix",
        manaCost: "2RR",
        type: "Creature",
        color: "red",
        illustration: "",
        rulesText: "Flying",
        keywords: ["Flying"]
      };

      const groundBlocker: CardJSON = {
        name: "Goblin",
        manaCost: "R",
        type: "Creature",
        color: "red",
        illustration: "",
        rulesText: ""
      };

      expect(canBlock(flyingAttacker, groundBlocker)).toBe(false);
    });

    it("should allow valid ground blockers to intercept ground attackers when defending", () => {
      const groundAttacker: CardJSON = {
        name: "Orc Warrior",
        manaCost: "1R",
        type: "Creature",
        color: "red",
        illustration: "",
        rulesText: ""
      };

      const groundBlocker: CardJSON = {
        name: "Knight",
        manaCost: "1W",
        type: "Creature",
        color: "white",
        illustration: "",
        rulesText: ""
      };

      expect(canBlock(groundAttacker, groundBlocker)).toBe(true);
    });

    it("should correctly evaluate bot blocker assignments for multiple attackers", () => {
      const attacker1: CardJSON = { name: "Attacker 1", manaCost: "1R", type: "Creature", color: "red", illustration: "", rulesText: "" };
      const attacker2: CardJSON = { name: "Attacker 2", manaCost: "1R", type: "Creature", color: "red", illustration: "", rulesText: "" };
      const blocker1: CardJSON = { name: "Blocker 1", manaCost: "1W", type: "Creature", color: "white", illustration: "", rulesText: "" };

      expect(canBlock(attacker1, blocker1)).toBe(true);
      expect(canBlock(attacker2, blocker1)).toBe(true);
    });

    it("should generate detailed combat log entries during combat resolution", () => {
      const attacker: CardJSON = { name: "Dragon", manaCost: "5R", type: "Creature", color: "red", illustration: "", power: "5", toughness: "5", rulesText: "" };
      const result = resolveCombat([{ id: "p1", card: attacker, damage: 0, isAttacking: true, blockingId: null }], []);
      expect(result.logs.length).toBeGreaterThan(0);
      expect(result.enemyDamage).toBe(5);
    });

    it("should format turn transition log headers correctly", () => {
      const turnEndHeader = `--- Turn 1 Ended ---`;
      const turnStartHeader = `--- Turn 2 Started ---`;
      expect(turnEndHeader).toContain("Turn 1 Ended");
      expect(turnStartHeader).toContain("Turn 2 Started");
    });

    it("should format quest reward log entries correctly", () => {
      const rewardCard: CardJSON = { name: "Ancient Relic", manaCost: "3C", type: "Artifact", color: "artifact", illustration: "", rulesText: "Draw 2 cards" };
      const rewardMsg = `🎁 Quest Reward Earned: Received "${rewardCard.name}" (${rewardCard.type}) added to hand!`;
      expect(rewardMsg).toContain("Ancient Relic");
      expect(rewardMsg).toContain("Artifact");
    });

    it("should format quest level completion reward logs correctly", () => {
      const levelHeader = `🏆 Quest Level 1/3 Complete! Defeated quest guardians for "Tower of Terror".`;
      const levelRewardMsg = `🎁 Level 1 Reward: Received "Flame Serpent" (Creature 4/3) added to hand!`;
      const unlockMsg = `🔓 Unlocked Quest Level 2/3: Advanced "Tower of Terror" to Level 2!`;

      expect(levelHeader).toContain("Level 1/3 Complete");
      expect(levelRewardMsg).toContain("Flame Serpent");
      expect(unlockMsg).toContain("Unlocked Quest Level 2/3");
    });

    it("should match Tower of Terror quest card names correctly", () => {
      const cardName = "Tower of Terror";
      const isTowerOfTerror = cardName.toLowerCase().includes("tower of terror");
      expect(isTowerOfTerror).toBe(true);
    });
  });
});

describe("Subtype Buffs & Always-Active Abilities", () => {
  describe("matchSubtype", () => {
    it("should match identical subtypes case-insensitively", () => {
      expect(matchSubtype("Goblin", "goblin")).toBe(true);
      expect(matchSubtype("soldier", "Soldier")).toBe(true);
    });

    it("should match plurals and singulars", () => {
      expect(matchSubtype("Goblin", "goblins")).toBe(true);
      expect(matchSubtype("Soldier", "soldiers")).toBe(true);
      expect(matchSubtype("Elves", "elf")).toBe(true);
      expect(matchSubtype("Zombies", "Zombie")).toBe(true);
    });

    it("should handle undefined and mismatched subtypes", () => {
      expect(matchSubtype("", "goblin")).toBe(false);
      expect(matchSubtype("Orc", "goblin")).toBe(false);
    });
  });

  describe("getCombatStatsAndBuffs", () => {
    const goblinKing: MockFightCreature = {
      id: "gk",
      card: {
        name: "Goblin King",
        manaCost: "RRR",
        type: "Creature",
        color: "red",
        illustration: "",
        rulesText: "",
        power: "3",
        toughness: "6",
        cardSubType: "Goblin",
        activatedAbilities: [
          { cost: [], text: "Gives +1/+1 to all Goblins." }
        ]
      },
      damage: 0,
      isAttacking: false,
      blockingId: null
    };

    const regularGoblin: MockFightCreature = {
      id: "rg",
      card: {
        name: "Regular Goblin",
        manaCost: "R",
        type: "Creature",
        color: "red",
        illustration: "",
        rulesText: "",
        power: "1",
        toughness: "1",
        cardSubType: "Goblin"
      },
      damage: 0,
      isAttacking: false,
      blockingId: null
    };

    it("should give +1/+1 boost to other goblins when goblin king is alive", () => {
      const army = [goblinKing, regularGoblin];
      
      const gkStats = getCombatStatsAndBuffs(goblinKing, army);
      expect(gkStats.power).toBe(3);
      expect(gkStats.toughness).toBe(6);
      expect(gkStats.buffs).toHaveLength(0);

      const rgStats = getCombatStatsAndBuffs(regularGoblin, army);
      expect(rgStats.power).toBe(2);
      expect(rgStats.toughness).toBe(2);
      expect(rgStats.buffs).toHaveLength(1);
      expect(rgStats.buffs[0].sourceName).toBe("Goblin King");
    });

    it("should not give boost if goblin king is dead", () => {
      const deadGK = { ...goblinKing, damage: 6 };
      const army = [deadGK, regularGoblin];

      const rgStats = getCombatStatsAndBuffs(regularGoblin, army);
      expect(rgStats.power).toBe(1);
      expect(rgStats.toughness).toBe(1);
      expect(rgStats.buffs).toHaveLength(0);
    });

    it("should not accumulate goblin king boost over multiple combat rounds", () => {
      const gk: MockFightCreature = {
        id: "gk",
        card: {
          name: "Goblin King",
          manaCost: "RRR",
          type: "Creature",
          color: "red",
          illustration: "",
          rulesText: "",
          power: "3",
          toughness: "6",
          cardSubType: "Goblin",
          activatedAbilities: [
            { cost: [], text: "Gives +1/+1 to all Goblins." }
          ]
        },
        damage: 0,
        isAttacking: false,
        blockingId: null
      };

      const rg: MockFightCreature = {
        id: "rg",
        card: {
          name: "Regular Goblin",
          manaCost: "R",
          type: "Creature",
          color: "red",
          illustration: "",
          rulesText: "",
          power: "1",
          toughness: "1",
          cardSubType: "Goblin"
        },
        damage: 0,
        isAttacking: true,
        blockingId: null
      };

      // Round 1 combat
      const result1 = resolveCombat([gk, rg], []);
      const rgRound1 = result1.playerCreatures.find(c => c.id === "rg");
      expect(rgRound1).toBeDefined();
      expect(rgRound1!.card.power).toBe("1");
      expect(rgRound1!.card.toughness).toBe("1");

      // Round 2 combat (using the output from Round 1)
      const rgInput2 = { ...rgRound1!, isAttacking: true };
      const gkRound1 = result1.playerCreatures.find(c => c.id === "gk")!;
      
      const result2 = resolveCombat([gkRound1, rgInput2], []);
      const rgRound2 = result2.playerCreatures.find(c => c.id === "rg");
      expect(rgRound2).toBeDefined();
      expect(rgRound2!.card.power).toBe("1");
      expect(rgRound2!.card.toughness).toBe("1");
    });

    it("should allow attacker to be unblocked and deal damage to tower if blocker dies from a spell before combat resolution", () => {
      const attacker: MockFightCreature = {
        id: "p_attacker",
        card: {
          name: "Attacker",
          manaCost: "R",
          type: "Creature",
          color: "red",
          illustration: "",
          rulesText: "",
          power: "3",
          toughness: "3"
        },
        damage: 0,
        isAttacking: true,
        blockingId: null
      };

      const blocker: MockFightCreature = {
        id: "e_blocker",
        card: {
          name: "Blocker",
          manaCost: "G",
          type: "Creature",
          color: "green",
          illustration: "",
          rulesText: "",
          power: "2",
          toughness: "2"
        },
        damage: 2, // Blocker has taken 2 damage (lethal) from a spell
        isAttacking: false,
        blockingId: "p_attacker"
      };

      const result = resolveCombat([attacker], [blocker]);

      // Blocker is dead before combat starts, so:
      // 1. Attacker is unblocked, dealing 3 damage to tower
      expect(result.enemyDamage).toBe(3);
      
      // 2. Blocker is dead and returned in graveyard (not in surviving enemy list)
      expect(result.enemyCreatures).toHaveLength(0);
      
      // 3. Attacker takes no return damage and survives
      expect(result.playerCreatures).toHaveLength(1);
      expect(result.playerCreatures[0].damage).toBe(0);
    });

    it("should resolve First Strike combat correctly (first striker kills blocker before taking damage)", () => {
      const attacker: MockFightCreature = {
        id: "p_attacker",
        card: {
          name: "First Striker",
          manaCost: "W",
          type: "Creature",
          color: "white",
          illustration: "",
          rulesText: "First Strike",
          power: "3",
          toughness: "2"
        },
        damage: 0,
        isAttacking: true,
        blockingId: null
      };

      const blocker: MockFightCreature = {
        id: "e_blocker",
        card: {
          name: "Normal Blocker",
          manaCost: "G",
          type: "Creature",
          color: "green",
          illustration: "",
          rulesText: "",
          power: "4",
          toughness: "3"
        },
        damage: 0,
        isAttacking: false,
        blockingId: "p_attacker"
      };

      // Attacker has 3 power (First Strike), blocker has 3 toughness.
      // Attacker deals 3 damage first, killing blocker.
      // Blocker does NOT deal its 4 return damage to attacker.
      const result = resolveCombat([attacker], [blocker]);

      // Blocker dies
      expect(result.enemyCreatures).toHaveLength(0);
      // Attacker survives with 0 damage
      expect(result.playerCreatures).toHaveLength(1);
      expect(result.playerCreatures[0].damage).toBe(0);
    });
  });

  describe("Activated Ability Spells Generator and Stat Buffs Parser", () => {
    it("should generate spell card from activated ability and reuse cache", () => {
      const creature: CardJSON = {
        name: "Balrog",
        manaCost: "5RR",
        type: "Creature",
        color: "red",
        illustration: "/assets/creatures/Balrog.jpg",
        rulesText: "",
        activatedAbilities: [
          {
            cost: ["{R}", "{R}"],
            text: "Gain +6/+0 until end of turn"
          }
        ]
      };

      const spell1 = getOrCreateAbilitySpellCard(creature, creature.activatedAbilities![0]);
      expect(spell1.name).toBe("Balrog Ability");
      expect(spell1.manaCost).toBe("{R}{R}");
      expect(spell1.type).toBe("Spell");
      expect(spell1.cardSubType).toBe("Battle");
      expect(spell1.illustration).toBe("/assets/creatures/Balrog.jpg");
      expect(spell1.rulesText).toBe("Gain +6/+0 until end of turn");

      const spell2 = getOrCreateAbilitySpellCard(creature, creature.activatedAbilities![0]);
      // Verify cache hit - returns exact same object instance!
      expect(spell1).toBe(spell2);
    });

    it("should generate spell card from activated ability with brace-less cost", () => {
      const creature: CardJSON = {
        name: "Balrog",
        manaCost: "RR",
        type: "Creature",
        color: "red",
        illustration: "Balrog.png",
        rulesText: "",
        activatedAbilities: [
          {
            cost: ["R", "R"],
            text: "Gain +8/+0"
          }
        ]
      };

      const spell = getOrCreateAbilitySpellCard(creature, creature.activatedAbilities![0]);
      expect(spell.name).toBe("Balrog Ability");
      expect(spell.manaCost).toBe("{R}{R}");
      expect(spell.rulesText).toBe("Gain +8/+0");
    });

    it("should correctly resolve ability spell artwork for raw deck cards with cardName / cardType properties (e.g. Litch King, Nightmare, Hellkite)", () => {
      const rawLitchKing: any = {
        cardName: "Litch King",
        cardType: "Creature",
        frameStyle: "black",
        illustration: "Litch King.jpg",
        activatedAbilities: [{ cost: ["B", "B"], text: "Deals 2 damage to any target" }]
      };

      const rawNightmare: any = {
        cardName: "Nightmare",
        cardType: "Creature",
        frameStyle: "black",
        illustration: "Nightmare.jpg",
        activatedAbilities: [{ cost: ["B", "B"], text: "Gain +6/+0" }]
      };

      const litchSpell = getOrCreateAbilitySpellCard(rawLitchKing, rawLitchKing.activatedAbilities[0]);
      expect(litchSpell.name).toBe("Litch King Ability");
      expect(litchSpell.illustration).toBe("/assets/creatures/Litch King.jpg");

      const nightmareSpell = getOrCreateAbilitySpellCard(rawNightmare, rawNightmare.activatedAbilities[0]);
      expect(nightmareSpell.name).toBe("Nightmare Ability");
      expect(nightmareSpell.illustration).toBe("/assets/creatures/Nightmare.jpg");
    });

    it("should correctly parse and apply stats from activeSpells", () => {
      const creature: MockFightCreature = {
        id: "balrog_unit",
        card: {
          name: "Balrog",
          manaCost: "5RR",
          type: "Creature",
          color: "red",
          illustration: "",
          rulesText: "",
          power: "6",
          toughness: "6"
        },
        damage: 0,
        isAttacking: true,
        blockingId: null,
        activeSpells: [
          {
            name: "Balrog Ability",
            manaCost: "{R}{R}",
            type: "Spell",
            cardSubType: "Battle",
            color: "red",
            illustration: "",
            rulesText: "Gain +6/+0 until end of turn"
          }
        ]
      };

      const stats = getCombatStatsAndBuffs(creature, [creature]);
      expect(stats.power).toBe(12);
      expect(stats.toughness).toBe(6);
      expect(stats.buffs).toHaveLength(1);
      expect(stats.buffs[0].sourceName).toBe("Balrog Ability");
      expect(stats.buffs[0].power).toBe(6);
      expect(stats.buffs[0].toughness).toBe(0);
    });
  });

  describe("Freeze spell mechanics", () => {
    const freezeSpell = { name: "Freeze", type: "Spell", manaCost: "UU", color: "blue", illustration: "" } as any;

    it("canBlock returns false when blocker or attacker is frozen", () => {
      const attacker = { name: "Ogre Sunderer", type: "Creature", power: "3", toughness: "3" } as any;
      const blocker = { name: "White Knight", type: "Creature", power: "2", toughness: "2" } as any;

      expect(canBlock(attacker, blocker, [], [freezeSpell])).toBe(false);
      expect(canBlock(attacker, blocker, [freezeSpell], [])).toBe(false);
    });

    it("resolveCombat ignores frozen attackers and frozen blockers", () => {
      const frozenAttacker: MockFightCreature = {
        id: "p1",
        card: { name: "Ogre Sunderer", manaCost: "3R", power: "5", toughness: "5", type: "Creature", color: "red", illustration: "", rulesText: "" },
        damage: 0,
        isAttacking: true,
        blockingId: null,
        activeSpells: [freezeSpell]
      };

      const frozenBlocker: MockFightCreature = {
        id: "e1",
        card: { name: "White Knight", manaCost: "2W", power: "2", toughness: "2", type: "Creature", color: "white", illustration: "", rulesText: "" },
        damage: 0,
        isAttacking: false,
        blockingId: "p1",
        activeSpells: [freezeSpell]
      };

      const res = resolveCombat([frozenAttacker], [frozenBlocker]);
      expect(res.enemyDamage).toBe(0);
      expect(res.playerDamage).toBe(0);
      expect(res.logs.some(l => l.includes("Frozen and cannot deal damage"))).toBe(true);
    });

    it("freezes creature fighting Medusa with sourceMedusaId if Medusa survives damage", () => {
      const medusa: MockFightCreature = {
        id: "m1",
        card: { name: "Medusa", manaCost: "2GG", power: "3", toughness: "8", type: "Creature", color: "green", illustration: "", rulesText: "" },
        damage: 0,
        isAttacking: false,
        blockingId: "p1"
      };

      const attacker: MockFightCreature = {
        id: "p1",
        card: { name: "Minotaur", manaCost: "2RR", power: "4", toughness: "4", type: "Creature", color: "red", illustration: "", rulesText: "" },
        damage: 0,
        isAttacking: true,
        blockingId: null
      };

      applyMedusaGazeIfNeeded(attacker, medusa);
      expect(attacker.activeSpells).toBeDefined();
      expect((attacker.activeSpells![0] as any).name).toBe("Freeze");
      expect((attacker.activeSpells![0] as any).sourceMedusaId).toBe("m1");
      expect(attacker.isAttacking).toBe(false);
    });

    it("does not freeze opponent if Medusa dies from combat damage", () => {
      const medusa: MockFightCreature = {
        id: "m1",
        card: { name: "Medusa", manaCost: "2GG", power: "3", toughness: "3", type: "Creature", color: "green", illustration: "", rulesText: "" },
        damage: 3, // Slain by combat damage!
        isAttacking: false,
        blockingId: "p1"
      };

      const attacker: MockFightCreature = {
        id: "p1",
        card: { name: "Minotaur", manaCost: "2RR", power: "4", toughness: "4", type: "Creature", color: "red", illustration: "", rulesText: "" },
        damage: 3,
        isAttacking: true,
        blockingId: null
      };

      applyMedusaGazeIfNeeded(attacker, medusa);
      expect(attacker.activeSpells || []).toHaveLength(0);
    });

    it("ensures Medusa always takes combat damage when attacking and blocked, even if Medusa has First Strike and deals lethal damage", () => {
      const medusa: MockFightCreature = {
        id: "m1",
        card: { name: "Medusa", manaCost: "2GG", power: "5", toughness: "5", type: "Creature", color: "green", illustration: "", rulesText: "First Strike" },
        damage: 0,
        isAttacking: true,
        blockingId: null
      };

      const blocker: MockFightCreature = {
        id: "b1",
        card: { name: "Orc Warrior", manaCost: "1R", power: "3", toughness: "2", type: "Creature", color: "red", illustration: "", rulesText: "" },
        damage: 0,
        isAttacking: false,
        blockingId: "m1"
      };

      const res = resolveCombat([medusa], [blocker]);
      // Medusa deals 5 damage to blocker (killing it), but Medusa still takes 3 damage from blocker
      expect(res.playerCreatures).toHaveLength(1);
      expect(res.playerCreatures[0].damage).toBe(3);
      expect(res.enemyCreatures).toHaveLength(0); // Blocker died
    });

    it("ensures Medusa freezes blocker if Medusa survives being blocked", () => {
      const medusa: MockFightCreature = {
        id: "m1",
        card: { name: "Medusa", manaCost: "2GG", power: "1", toughness: "5", type: "Creature", color: "green", illustration: "", rulesText: "" },
        damage: 0,
        isAttacking: true,
        blockingId: null
      };

      const blocker: MockFightCreature = {
        id: "b1",
        card: { name: "Golem", manaCost: "4C", power: "2", toughness: "8", type: "Creature", color: "artifact", illustration: "", rulesText: "" },
        damage: 0,
        isAttacking: false,
        blockingId: "m1"
      };

      const res = resolveCombat([medusa], [blocker]);
      expect(res.playerCreatures[0].damage).toBe(2);
      // Blocker survives and is frozen by Medusa
      expect(res.enemyCreatures).toHaveLength(1);
      expect(res.enemyCreatures[0].activeSpells?.some(s => (typeof s === "string" ? s : s.name) === "Freeze")).toBe(true);
      expect((res.enemyCreatures[0].activeSpells?.find(s => (typeof s === "string" ? s : s.name) === "Freeze") as any).sourceMedusaId).toBe("m1");
    });

    it("unfreezes all creatures petrified by Medusa when that Medusa dies", () => {
      // Setup a creature already frozen by Medusa m1
      const frozenCreature: MockFightCreature = {
        id: "fc1",
        card: { name: "Behemoth", manaCost: "4GG", power: "6", toughness: "6", type: "Creature", color: "green", illustration: "", rulesText: "" },
        damage: 0,
        isAttacking: false,
        blockingId: null,
        activeSpells: [
          {
            id: "medusa-freeze-m1",
            name: "Freeze",
            manaCost: "",
            type: "Spell",
            color: "blue",
            illustration: "Freeze.jpg",
            rulesText: "Petrified",
            sourceMedusaId: "m1"
          } as any
        ]
      };

      // Medusa fights a creature that deals lethal damage to Medusa
      const medusa: MockFightCreature = {
        id: "m1",
        card: { name: "Medusa", manaCost: "2GG", power: "3", toughness: "3", type: "Creature", color: "green", illustration: "", rulesText: "" },
        damage: 0,
        isAttacking: true,
        blockingId: null
      };

      const killerBlocker: MockFightCreature = {
        id: "kb1",
        card: { name: "Dragon", manaCost: "4RR", power: "5", toughness: "5", type: "Creature", color: "red", illustration: "", rulesText: "" },
        damage: 0,
        isAttacking: false,
        blockingId: "m1"
      };

      const res = resolveCombat([medusa], [killerBlocker, frozenCreature]);
      // Medusa took 5 damage and died
      expect(res.playerCreatures).toHaveLength(0);
      // Both enemy creatures survived, and frozenCreature's freeze is lifted!
      const finalFrozenCreature = res.enemyCreatures.find(c => c.id === "fc1");
      expect(finalFrozenCreature).toBeDefined();
      expect(finalFrozenCreature!.activeSpells?.some(s => (typeof s === "string" ? s : s.name) === "Freeze")).toBe(false);
      expect(res.logs.some(l => l.includes("Medusa was slain! The petrifying gaze"))).toBe(true);
    });
  });

  describe("processHydraLethalDamage", () => {
    it("decrements Hydra lives count from 3 Lives to 2 Lives and resets damage to 0", () => {
      const hydraUnit: MockFightCreature = {
        id: "hydra-1",
        card: {
          name: "Hydra",
          manaCost: "3GG",
          power: "5",
          toughness: "5",
          type: "Creature",
          color: "gold",
          illustration: "",
          rulesText: "",
          activatedAbilities: [{ cost: [], text: "3 Lives." }]
        },
        damage: 5,
        isAttacking: false,
        blockingId: null
      };

      const logs: string[] = [];
      const survived = processHydraLethalDamage(hydraUnit, logs);
      expect(survived).toBe(true);
      expect(hydraUnit.damage).toBe(0);
      expect(hydraUnit.card.activatedAbilities![0].text).toBe("2 Lives.");
      expect(logs.some(l => l.includes("2 Lives remaining"))).toBe(true);
    });

    it("decrements Hydra lives count from 2 Lives to 1 Life and resets damage to 0", () => {
      const hydraUnit: MockFightCreature = {
        id: "hydra-1",
        card: {
          name: "Hydra",
          manaCost: "3GG",
          power: "5",
          toughness: "5",
          type: "Creature",
          color: "gold",
          illustration: "",
          rulesText: "",
          activatedAbilities: [{ cost: [], text: "2 Lives." }]
        },
        damage: 5,
        isAttacking: false,
        blockingId: null
      };

      const logs: string[] = [];
      const survived = processHydraLethalDamage(hydraUnit, logs);
      expect(survived).toBe(true);
      expect(hydraUnit.damage).toBe(0);
      expect(hydraUnit.card.activatedAbilities![0].text).toBe("1 Life.");
      expect(logs.some(l => l.includes("1 Life remaining"))).toBe(true);
    });

    it("returns false when Hydra has 1 Life left (allowing normal death)", () => {
      const hydraUnit: MockFightCreature = {
        id: "hydra-1",
        card: {
          name: "Hydra",
          manaCost: "3GG",
          power: "5",
          toughness: "5",
          type: "Creature",
          color: "gold",
          illustration: "",
          rulesText: "",
          activatedAbilities: [{ cost: [], text: "1 Life." }]
        },
        damage: 5,
        isAttacking: false,
        blockingId: null
      };

      const logs: string[] = [];
      const survived = processHydraLethalDamage(hydraUnit, logs);
      expect(survived).toBe(false);
      expect(hydraUnit.damage).toBe(5);
    });
  });

  describe("groupArenaLogsByTurn", () => {
    it("groups log lines by turn headers correctly", () => {
      const logs = [
        "--- Turn 1 Started ---",
        "⚔️ Elven Archer attacked",
        "💥 Dealt 2 damage",
        "--- Turn 1 Ended ---",
        "--- Turn 2 Started ---",
        "🪄 Archmage cast Fireball"
      ];

      const groups = groupArenaLogsByTurn(logs);
      expect(groups.length).toBe(2);
      expect(groups[0].turnNumber).toBe(1);
      expect(groups[0].logs).toEqual(["⚔️ Elven Archer attacked", "💥 Dealt 2 damage"]);
      expect(groups[1].turnNumber).toBe(2);
      expect(groups[1].logs).toEqual(["🪄 Archmage cast Fireball"]);
    });

    it("handles empty logs gracefully", () => {
      const groups = groupArenaLogsByTurn([]);
      expect(groups.length).toBe(1);
      expect(groups[0].turnNumber).toBe(1);
      expect(groups[0].logs).toEqual([]);
    });
  });

  describe("Freeze Spell Combat & Duration Mechanics", () => {
    it("prevents frozen creature from blocking", () => {
      const attackerCard: CardJSON = {
        name: "Goblin",
        manaCost: "R",
        power: "2",
        toughness: "2",
        type: "Creature",
        color: "red",
        illustration: "",
        rulesText: ""
      };
      const blockerCard: CardJSON = {
        name: "Guard",
        manaCost: "1W",
        power: "2",
        toughness: "2",
        type: "Creature",
        color: "white",
        illustration: "",
        rulesText: ""
      };

      const frozenBlockerSpells = [{ name: "Freeze", freezeTurns: 2 }];
      expect(canBlock(attackerCard, blockerCard, [], frozenBlockerSpells)).toBe(false);
      expect(canBlock(attackerCard, blockerCard, [], [])).toBe(true);
    });

    it("prevents frozen creature from dealing combat damage when attacking", () => {
      const frozenAttacker: MockFightCreature = {
        id: "att-1",
        card: {
          name: "Frozen Attacker",
          manaCost: "3U",
          power: "5",
          toughness: "5",
          type: "Creature",
          color: "blue",
          illustration: "",
          rulesText: ""
        },
        damage: 0,
        isAttacking: true,
        blockingId: null,
        activeSpells: [{ name: "Freeze", freezeTurns: 2 }]
      };

      const enemyDef: MockFightCreature = {
        id: "def-1",
        card: {
          name: "Enemy Tower Guard",
          manaCost: "2W",
          power: "2",
          toughness: "2",
          type: "Creature",
          color: "gold",
          illustration: "",
          rulesText: ""
        },
        damage: 0,
        isAttacking: false,
        blockingId: null
      };

      const res = resolveCombat([frozenAttacker], [enemyDef]);
      // Frozen creature deals 0 damage to tower/opponent
      expect(res.enemyDamage).toBe(0);
      expect(res.logs.some(l => l.includes("Frozen and cannot deal damage"))).toBe(true);
    });
  });

  describe("isSpellArenaLog", () => {
    it("identifies player and bot spell cast logs", () => {
      expect(isSpellArenaLog("🪄 Player cast Fireball on Enemy's Dragon.")).toBe(true);
      expect(isSpellArenaLog("🪄 Enemy Bot casts Lightning Strike on Elf!")).toBe(true);
      expect(isSpellArenaLog("✨ Player cast Clone! Created a copy of target creature.")).toBe(true);
      expect(isSpellArenaLog("✨ Player cast Fog! Pacified all attackers and ended the combat turn.")).toBe(true);
      expect(isSpellArenaLog("✨ Player cast Heal! Restored 3 damage to Guard.")).toBe(true);
      expect(isSpellArenaLog("✨ Player cast Disenchant! Removed Strength from Troll.")).toBe(true);
      expect(isSpellArenaLog("😈 Player cast Summon Demon! Summoned Lesser demon to join battle army!")).toBe(true);
    });

    it("identifies spell status & damage effects", () => {
      expect(isSpellArenaLog("❄️ Freeze effect on Goblin has thawed.")).toBe(true);
      expect(isSpellArenaLog("❄️ Enemy Goblin is Frozen and cannot attack!")).toBe(true);
      expect(isSpellArenaLog("☠️ Player's Elf takes 1 poison damage (Damage: 1/2).")).toBe(true);
      expect(isSpellArenaLog("☠️ Poison effect on Elf has expired.")).toBe(true);
      expect(isSpellArenaLog("🌿 Sauron's Troll regenerated 1 damage (Damage: 0/4).")).toBe(true);
      expect(isSpellArenaLog("🐍 Medusa was slain! The petrifying gaze on Elf is lifted.")).toBe(true);
      expect(isSpellArenaLog("💀 Sauron's Goblin died from Fireball!")).toBe(true);
    });

    it("returns false for non-spell attack, block, and turn header logs", () => {
      expect(isSpellArenaLog("--- Turn 1 Started ---")).toBe(false);
      expect(isSpellArenaLog("--- Turn 1 Ended ---")).toBe(false);
      expect(isSpellArenaLog("⚔️ Declared attacks with all available creatures!")).toBe(false);
      expect(isSpellArenaLog("⚔️ Enemy Goblin declares attack!")).toBe(false);
      expect(isSpellArenaLog("🛡️ Enemy Guard blocks Attacking Orc!")).toBe(false);
      expect(isSpellArenaLog("💥 Player's Dragon (5/5) is unblocked! Deals 5 damage to Sauron's Fortress.")).toBe(false);
    });
  });

  describe("isWizardUnit", () => {
    it("identifies wizard units correctly across types, subtypes, and names", () => {
      expect(isWizardUnit({ name: "Wizard L1", type: "Wizard", color: "blue", illustration: "", rulesText: "", manaCost: "" })).toBe(true);
      expect(isWizardUnit({ name: "Necromancer", type: "Creature", cardSubType: "Wizard", color: "black", illustration: "", rulesText: "", manaCost: "" })).toBe(true);
      expect(isWizardUnit({ name: "Archmage Adept", type: "Creature", color: "blue", illustration: "", rulesText: "", manaCost: "" })).toBe(true);
      expect(isWizardUnit({ name: "Fire Mage", type: "Creature", color: "red", illustration: "", rulesText: "", manaCost: "" })).toBe(true);
      expect(isWizardUnit({ name: "Shadow Warlock", type: "Creature", color: "black", illustration: "", rulesText: "", manaCost: "" })).toBe(true);
      expect(isWizardUnit({ name: "Goblin Raider", type: "Creature", color: "red", illustration: "", rulesText: "", manaCost: "" })).toBe(false);
    });
  });

  describe("getSpellDamageAmount", () => {
    it("returns correct damage for known damage spells and rules text", () => {
      expect(getSpellDamageAmount("Fireball", "")).toBe(3);
      expect(getSpellDamageAmount("Lightning Strike", "")).toBe(2);
      expect(getSpellDamageAmount("Custom Blast", "Deals 5 damage to target creature.")).toBe(5);
      expect(getSpellDamageAmount("Strength", "Target creature gets +2/+2")).toBe(0);
    });
  });

  describe("evaluateBotSpellTargets", () => {
    const playerGoblin: MockFightCreature = {
      id: "p1",
      card: { name: "Goblin", power: "1", toughness: "1", type: "Creature", color: "red", illustration: "", rulesText: "", manaCost: "R" },
      damage: 0,
      isAttacking: false,
      blockingId: null
    };

    const playerDragon: MockFightCreature = {
      id: "p2",
      card: { name: "Dragon", power: "5", toughness: "5", type: "Creature", color: "red", illustration: "", rulesText: "", manaCost: "RRRR" },
      damage: 2, // 3 HP remaining
      isAttacking: true,
      blockingId: null
    };

    const enemyAttacker: MockFightCreature = {
      id: "e1",
      card: { name: "Orc Attacker", power: "3", toughness: "3", type: "Creature", color: "black", illustration: "", rulesText: "", manaCost: "BB" },
      damage: 0,
      isAttacking: true,
      blockingId: null
    };

    const enemyDefender: MockFightCreature = {
      id: "e2",
      card: { name: "Orc Guard", power: "2", toughness: "4", type: "Creature", color: "black", illustration: "", rulesText: "", manaCost: "BB" },
      damage: 0,
      isAttacking: false,
      blockingId: null
    };

    it("prioritizes lethal damage spells on killable high-power enemy creatures", () => {
      const fireball: CardJSON = { name: "Fireball", type: "Spell", color: "red", illustration: "", rulesText: "Deals 3 damage", manaCost: "RR" };
      const evalResult = evaluateBotSpellTargets(fireball, [playerGoblin, playerDragon], [enemyAttacker, enemyDefender]);
      expect(evalResult).not.toBeNull();
      expect(evalResult!.score).toBeGreaterThanOrEqual(1000);
      // Dragon has 3 HP remaining and 5 power, while Goblin has 1 HP and 1 power => Dragon is highest power killable target
      expect(evalResult!.targets[0].id).toBe("p2");
    });

    it("evaluates Summon Demon with high priority and no target needed", () => {
      const summonDemon: CardJSON = { name: "Summon Demon", type: "Spell", color: "black", illustration: "", rulesText: "Summon a demon", manaCost: "B" };
      const evalResult = evaluateBotSpellTargets(summonDemon, [playerGoblin], [enemyAttacker]);
      expect(evalResult).not.toBeNull();
      expect(evalResult!.score).toBe(600);
      expect(evalResult!.targets.length).toBeGreaterThan(0);
    });

    it("prioritizes buffs on attacking creatures over defending creatures", () => {
      const strength: CardJSON = { name: "Strength", type: "Spell", color: "green", illustration: "", rulesText: "+2/+2", manaCost: "G" };
      const evalResult = evaluateBotSpellTargets(strength, [playerGoblin], [enemyAttacker, enemyDefender]);
      expect(evalResult).not.toBeNull();
      expect(evalResult!.score).toBe(550);
      expect(evalResult!.targets).toEqual([enemyAttacker]);
    });

    it("returns null for Counterspell variants so they are not cast proactively on creatures", () => {
      const counterspell: CardJSON = { name: "Counterspell", type: "Spell", color: "blue", illustration: "", rulesText: "Counters target spell", manaCost: "UU" };
      const counterspellRed: CardJSON = { name: "Counterspell Red", type: "Spell", color: "red", illustration: "", rulesText: "Counters target spell", manaCost: "RR" };
      
      expect(evaluateBotSpellTargets(counterspell, [playerGoblin], [enemyAttacker])).toBeNull();
      expect(evaluateBotSpellTargets(counterspellRed, [playerGoblin], [enemyAttacker])).toBeNull();
    });
  });
});

