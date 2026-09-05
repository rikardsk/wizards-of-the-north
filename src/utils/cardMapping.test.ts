import { describe, it, expect } from "vitest";
import { mapCardJson, resolveIllustrationPath, isNonBattleSpell, isBattleSpell, isEnchantmentSpell, buildQuestTextFromLevel, resolveOpponentCard, resolveCardNameFromRef, isQuestOnlyNoCost, generateQuestOpponents, adjustQuestOpponentForDifficulty, getQuestInitialHp, resolveKeywordGrantForLevel, hasSpellReward, resolveSpellGrantForLevel, hasCompanionReward, resolveCompanionGrantForLevel, hasCardReward, resolveCardGrantForLevel, getXpRewardInfo, findCardsByRawId, getWizardLevelFromCard, getTowerLevelFromCard, isWizardCard, isQuestCard, isNoCostCreature, getPlayerQuestProgress, isReviveSpell, isReanimateSpell, hasMonsterUnlockReward, getMonsterUnlockManaCost, applyMonsterUnlockManaCost, getStructuredRewardsForLevel, getTowerLevelUpRequirements, checkTowerLevelUpEligibility, defaultTowerOfTerrorQuestData, canPlayerProduceSpellMana, getPlayerProducedColors, getTileLandColors, filterDefenderCreatures, generateDefenderArmyForTile, isBorderTileBetweenBiomes, isPlainOrForestTile, checkAndSpawnDefenderArmiesOnMap } from "./cardMapping";

describe("cardMapping", () => {
  it("resolves companion card ID fallback for Guard Dog correctly", () => {
    expect(resolveCardNameFromRef("card_1787057762927")).toBe("Guard Dog");
  });
  it("resolves spell card ID fallback for Necromancer spell Summon Demon correctly", () => {
    expect(resolveCardNameFromRef("card_1787393804735")).toBe("Summon Demon");
  });
  it("returns 'Not Found' when an unknown card ID cannot be resolved", () => {
    expect(resolveCardNameFromRef("card_unknown_99999")).toBe("Not Found");
  });
  it("resolves opponent cards by ID or fallback name", () => {
    const cards = [
      { id: "card_1785165293355", name: "Necromancer", type: "Creature", color: "black", illustration: "Necromancer.jpg", rulesText: "" } as any
    ];
    const opponent = resolveOpponentCard("card_1785165293355", cards);
    expect(opponent.name).toBe("Necromancer");
  });
  it("resolves Nightmare opponent fallback with correct 2/8 stats, Trample, and Gain +6/+0 ability", () => {
    const nightmareOpp = resolveOpponentCard("Nightmare", []);
    expect(nightmareOpp.name).toBe("Nightmare");
    expect(nightmareOpp.power).toBe("2");
    expect(nightmareOpp.toughness).toBe("8");
    expect(nightmareOpp.keywords).toContain("Trample");
    expect(nightmareOpp.activatedAbilities?.[0].text).toBe("Gain +6/+0");
  });
  it("formats quest text from 3 description fields correctly", () => {
    const levelData = {
      questDescription: "Defeat the necromancer.",
      rewardsDescription: "Unlock all monsters.",
      opponentsDescription: "Necromancer and minions.",
    };
    const text = buildQuestTextFromLevel(levelData);
    expect(text).toBe("Quest: Defeat the necromancer.\n\nReward: Unlock all monsters.\n\nOpponents: Necromancer and minions.");
  });

  it("maps a multi-level quest card with Level X/Y subtype and level 1 description", () => {
    const questCardRaw = {
      cardName: "Tower of Terror Quest",
      cardType: "Quest",
      frameStyle: "gold",
    };
    const card = mapCardJson(questCardRaw);
    expect(card.type).toBe("Quest");
    expect(card.cardSubType).toBe("Level 1/5");
    expect(card.questLevel).toBe(0);
    expect(card.totalQuestLevels).toBe(5);
    expect(card.customDescription).toContain("Quest: Visit the ancient ruins of the Tower of Terror");
    expect(card.customDescription).toContain("Reward: Receive a monster card.");
  });
  it("maps a minified spell card without artBase64 correctly", () => {
    const minifiedCard = {
      cardName: "Fireball",
      frameStyle: "red",
      manaCost: ["R", "R"],
      cardType: "Spell",
      illustration: "Fireball_art.png",
      customDescription: "Deals 3 damage to target creature or structure.",
    };

    const card = mapCardJson(minifiedCard);
    expect(card.name).toBe("Fireball");
    expect(card.type).toBe("Spell");
    expect(card.color).toBe("red");
    expect(card.manaCost).toBe("RR");
    expect(card.illustration).toBe("/assets/spells/Fireball_art.png");
    expect(card.customDescription).toBe("Deals 3 damage to target creature or structure.");
    expect(card.power).toBeUndefined();
    expect(card.toughness).toBeUndefined();
  });

  it("resolves spell artwork paths dynamically if omitted in JSON", () => {
    const minifiedCard = {
      cardName: "Clone",
      frameStyle: "blue",
      manaCost: ["U", "U", "U"],
      cardType: "Spell",
    };

    const card = mapCardJson(minifiedCard);
    expect(card.name).toBe("Clone");
    expect(card.illustration).toBe("/assets/spells/Clone.jpg");
  });

  it("resolves creature artwork paths properly", () => {
    const minifiedCard = {
      name: "Ogre Sunderer",
      color: "red",
      manaCost: "RR",
      type: "Creature",
      illustration: "Ogre Sunderer.png",
      power: "2",
      toughness: "2",
    };

    const card = mapCardJson(minifiedCard);
    expect(card.illustration).toBe("/assets/creatures/Ogre Sunderer.jpg");
  });

  it("converts legacy 'creatures art' and 'spells art' paths automatically", () => {
    const legacyCreature = resolveIllustrationPath("Creature", "/assets/creatures art/Ogre Sunderer.png");
    const legacySpell = resolveIllustrationPath("Spell", "assets/spells art/Fireball_art.png");
    expect(legacyCreature).toBe("/assets/creatures/Ogre Sunderer.jpg");
    expect(legacySpell).toBe("/assets/spells/Fireball_art.png");
  });

  it("preserves external data URIs and absolute paths", () => {
    const dataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA";
    const path = resolveIllustrationPath("Creature", dataUri);
    expect(path).toBe(dataUri);
  });

  it("resolves quest and ability artwork paths to their dedicated folders", () => {
    const questPath = resolveIllustrationPath("Quest", "Tower of Terror Quest.png", "Tower of Terror Quest");
    const abilityPath = resolveIllustrationPath("Spell", "Wizard Ability.png", "Wizard L1 Ability");
    const towerAbilityPath = resolveIllustrationPath("Spell", "Tower Ability.png", "Tower L1 Ability");
    expect(questPath).toBe("/assets/quests/Tower of Terror Quest.png");
    expect(abilityPath).toBe("/assets/abilities/Wizard Ability.png");
    expect(towerAbilityPath).toBe("/assets/abilities/Tower Ability.png");
  });

  it("resolves creature ability artwork to creature card image (e.g. Litch King Ability / Lich King Ability)", () => {
    const litchPath = resolveIllustrationPath("Spell", "Litch King.jpg", "Litch King Ability", "Battle");
    const lichPath = resolveIllustrationPath("Spell", "", "Lich King Ability", "Battle");
    const hellkitePath = resolveIllustrationPath("Spell", "Hellkite Ancient Dragon.jpg", "Hellkite Ancient Dragon Ability", "Battle");
    const hellkiteAbilityRawPath = resolveIllustrationPath("Spell", "/assets/spells/Hellkite Ancient Dragon Ability.png", "Hellkite Ancient Dragon Ability", "Battle");
    const nightmareAbilityPath = resolveIllustrationPath("Spell", "Nightmare Ability.jpg", "Nightmare Ability", "Battle");
    const nightmareSpellTypePath = resolveIllustrationPath("Spell", "", "Nightmare", "Battle");
    const nightmareSpellRawPath = resolveIllustrationPath("Spell", "/assets/spells/Nightmare.png", "Nightmare Ability", "Battle");
    const balrogAbilityPath = resolveIllustrationPath("Spell", "", "Balrog Ability", "Battle");

    expect(litchPath).toBe("/assets/creatures/Litch King.jpg");
    expect(lichPath).toBe("/assets/creatures/Litch King.jpg");
    expect(hellkitePath).toBe("/assets/creatures/Hellkite Ancient Dragon.jpg");
    expect(hellkiteAbilityRawPath).toBe("/assets/creatures/Hellkite Ancient Dragon.jpg");
    expect(nightmareAbilityPath).toBe("/assets/creatures/Nightmare.jpg");
    expect(nightmareSpellTypePath).toBe("/assets/creatures/Nightmare.jpg");
    expect(nightmareSpellRawPath).toBe("/assets/creatures/Nightmare.jpg");
    expect(balrogAbilityPath).toBe("/assets/creatures/Balrog.jpg");
  });

  it("resolves wizard artwork paths to /assets/wizards/", () => {
    const wizard1 = resolveIllustrationPath("Creature", "Wizard L1.png", "Wizard L1");
    const wizard2 = resolveIllustrationPath("Creature", "Wizard L2.jpg", "Wizard L2");
    const wizard3 = resolveIllustrationPath("Creature", "Wizard L3.png", "Wizard Lv3");
    const wizard4 = resolveIllustrationPath("Creature", "Wizard L4.jpg", "Wizard Lv4");
    const victory = resolveIllustrationPath("Legendary Victory", "victory.png", "Ultimate Victory");

    expect(wizard1).toBe("/assets/wizards/Wizard L1.jpg");
    expect(wizard2).toBe("/assets/wizards/Wizard L2.jpg");
    expect(wizard3).toBe("/assets/wizards/Wizard L3.jpg");
    expect(wizard4).toBe("/assets/wizards/Wizard L4.jpg");
    expect(victory).toBe("/assets/wizards/Ultimate Victory.png");
  });

  it("heals incorrect paths stored in history or local storage for wizards", () => {
    const badWizardPath = resolveIllustrationPath("Creature", "/assets/creatures/Wizard L1.png", "Wizard L1");
    expect(badWizardPath).toBe("/assets/wizards/Wizard L1.jpg");
  });

  it("heals incorrect paths stored in history or local storage", () => {
    const badQuestPath = resolveIllustrationPath("Quest", "/assets/spells/Tower of Terror Quest.png", "Tower of Terror Quest");
    const badAbilityPath = resolveIllustrationPath("Spell", "/assets/spells/Wizard Ability.png", "Wizard L1 Ability");
    const badSpellPath = resolveIllustrationPath("Spell", "/assets/creatures/Fireball_art.png", "Fireball");
    expect(badQuestPath).toBe("/assets/quests/Tower of Terror Quest.png");
    expect(badAbilityPath).toBe("/assets/abilities/Wizard Ability.png");
    expect(badSpellPath).toBe("/assets/spells/Fireball_art.png");
  });

  it("correctly determines tower level and resolves tower artwork for levels 1-4", () => {
    const t1 = resolveIllustrationPath("Tower", "Wizards Tower L1.jpg", "Wizards Tower", "Level 1");
    const t2 = resolveIllustrationPath("Tower", "Wizards Tower L2.jpg", "Wizards Tower", "Level 2");
    const t3 = resolveIllustrationPath("Tower", "Wizards Tower L3.jpg", "Wizards Tower", "Level 3");
    const t4 = resolveIllustrationPath("Tower", "Wizards Tower L4.jpg", "Wizards Tower", "Level 4");
    expect(t1).toBe("/assets/towers/Wizards Tower L1.jpg");
    expect(t2).toBe("/assets/towers/Wizards Tower L2.jpg");
    expect(t3).toBe("/assets/towers/Wizards Tower L3.jpg");
    expect(t4).toBe("/assets/towers/Wizards Tower L4.jpg");

    expect(getTowerLevelFromCard({ name: "Wizards Tower", cardSubType: "Level 1" })).toBe(1);
    expect(getTowerLevelFromCard({ name: "Wizards Tower", cardSubType: "Level 2" })).toBe(2);
    expect(getTowerLevelFromCard({ name: "Wizards Tower", cardSubType: "Level 3" })).toBe(3);
    expect(getTowerLevelFromCard({ name: "Wizards Tower", cardSubType: "Level 4" })).toBe(4);
  });

  it("preserves tile artwork paths for Tower cards", () => {
    const towerPath = resolveIllustrationPath("Tower", "/assets/tiles/Wizards Tower L1.png", "Wizards Tower L1");
    expect(towerPath).toBe("/assets/tiles/Wizards Tower L1.png");
  });

  it("resolves hero artwork paths to /assets/heroes/", () => {
    const achillesPath = resolveIllustrationPath("Hero", "Achilles.jpg", "Achilles");
    const manhunterPath = resolveIllustrationPath("Creature", "Manhunter.jpg", "Manhunter");
    const rolandPath = resolveIllustrationPath("Creature", "", "Roland");
    expect(achillesPath).toBe("/assets/heroes/Achilles.jpg");
    expect(manhunterPath).toBe("/assets/heroes/Manhunter.jpg");
    expect(rolandPath).toBe("/assets/heroes/Roland.jpg");
  });

  it("resolves legend artwork paths to /assets/legends/", () => {
    const fafnirPath = resolveIllustrationPath("Legend", "Fafnir.jpg", "Fafnir");
    const frankensteinPath = resolveIllustrationPath("Creature", "Frankensteins Monster.jpg", "Frankensteins Monster");
    expect(fafnirPath).toBe("/assets/legends/Fafnir.jpg");
    expect(frankensteinPath).toBe("/assets/legends/Frankensteins Monster.jpg");
  });

  it("heals legacy/cached creature paths for hero and legend cards", () => {
    const badHeroPath = resolveIllustrationPath("Creature", "/assets/creatures/Achilles.jpg", "Achilles");
    const badLegendPath = resolveIllustrationPath("Creature", "/assets/creatures/Fafnir.jpg", "Fafnir");
    expect(badHeroPath).toBe("/assets/heroes/Achilles.jpg");
    expect(badLegendPath).toBe("/assets/legends/Fafnir.jpg");
  });

  describe("isNonBattleSpell", () => {
    it("returns true for non-battle spells like Destroy Land, Mana Drain, or Vision", () => {
      const destroyLand = { name: "Destroy Land", type: "Spell", manaCost: "RR", color: "red", illustration: "" } as any;
      const manaDrain = { name: "Mana Drain", type: "Spell", manaCost: "UU", color: "blue", illustration: "" } as any;
      const vision = { name: "Vision", type: "Spell", manaCost: "U", color: "blue", illustration: "" } as any;
      expect(isNonBattleSpell(destroyLand)).toBe(true);
      expect(isNonBattleSpell(manaDrain)).toBe(true);
      expect(isNonBattleSpell(vision)).toBe(true);
    });

    it("returns false for battle spells like Fireball, First Strike or Trample", () => {
      const fireball = { name: "Fireball", type: "Spell", manaCost: "RR", color: "red", illustration: "" } as any;
      const firstStrike = { name: "First Strike", type: "Spell", manaCost: "W", color: "white", illustration: "" } as any;
      const trample = { name: "Trample", type: "Spell", manaCost: "GG", color: "green", illustration: "" } as any;
      expect(isNonBattleSpell(fireball)).toBe(false);
      expect(isNonBattleSpell(firstStrike)).toBe(false);
      expect(isNonBattleSpell(trample)).toBe(false);
    });

    it("returns false for non-spell cards", () => {
      const creature = { name: "Ogre Sunderer", type: "Creature", manaCost: "RR", color: "red", illustration: "" } as any;
      expect(isNonBattleSpell(creature)).toBe(false);
    });
  });

  describe("isReviveSpell", () => {
    it("identifies Reincarnate, Revive, and Reanimate spells", () => {
      expect(isReviveSpell({ name: "Reincarnate" })).toBe(true);
      expect(isReviveSpell({ name: "Revive" })).toBe(true);
      expect(isReviveSpell({ name: "Reanimate" })).toBe(true);
      expect(isReviveSpell({ name: "Fireball" })).toBe(false);
      expect(isReviveSpell(null)).toBe(false);
    });
  });

  describe("isEnchantmentSpell", () => {
    it("identifies enchantment spells by subtype, type, or name", () => {
      expect(isEnchantmentSpell({ cardSubType: "Enchantment" })).toBe(true);
      expect(isEnchantmentSpell({ type: "Enchantment Spell" })).toBe(true);
      expect(isEnchantmentSpell({ name: "Land Enchantment" })).toBe(true);
      expect(isEnchantmentSpell({ name: "Fireball", type: "Spell", cardSubType: "Damage" })).toBe(false);
    });
  });

  describe("isQuestOnlyNoCost", () => {
    it("returns true for a quest card with empty or missing mana cost", () => {
      const q1 = { name: "Dragons Nest Quest", type: "Quest", manaCost: "", color: "gold", illustration: "" } as any;
      const q2 = { name: "Ancient Temple Ruins Quest", type: "Quest", color: "gold", illustration: "" } as any;
      expect(isQuestOnlyNoCost(q1)).toBe(true);
      expect(isQuestOnlyNoCost(q2)).toBe(true);
    });

    it("returns false for a quest card that has a mana cost", () => {
      const q = { name: "Mana Quest", type: "Quest", manaCost: "1W", color: "white", illustration: "" } as any;
      expect(isQuestOnlyNoCost(q)).toBe(false);
    });

    it("returns false for regular creature or spell cards without mana cost", () => {
      const creature = { name: "Token Creature", type: "Creature", manaCost: "", color: "red", illustration: "" } as any;
      const spell = { name: "Token Spell", type: "Spell", manaCost: "", color: "blue", illustration: "" } as any;
      expect(isQuestOnlyNoCost(creature)).toBe(false);
      expect(isQuestOnlyNoCost(spell)).toBe(false);
    });
  });

  describe("hasCardReward", () => {
    it("returns true when rewardCards or unlockCards are populated", () => {
      expect(hasCardReward({ rewardCards: ["card_123"] })).toBe(true);
      expect(hasCardReward({ unlockCards: ["card_456"] })).toBe(true);
    });

    it("returns true when rewardsDescription mentions Nightmare or Balrog or card", () => {
      expect(hasCardReward({ rewardsDescription: "Nightmare card" })).toBe(true);
      expect(hasCardReward({ rewardsDescription: "Balrog card & unlock monsters" })).toBe(true);
    });

    it("returns false when sections omits cardReward and no reward cards exist", () => {
      const level = {
        sections: ["questDesc", "keywordReward"],
        keywordReward: "Flying"
      } as any;
      expect(hasCardReward(level)).toBe(false);
    });

    it("returns false for empty level object or level without card reward", () => {
      expect(hasCardReward(undefined)).toBe(false);
      expect(hasCardReward({})).toBe(false);
    });
  });

  describe("Monster Unlock Rewards", () => {
    it("detects monster unlock reward correctly", () => {
      expect(hasMonsterUnlockReward({ monsterUnlock: true })).toBe(true);
      expect(hasMonsterUnlockReward({ sections: ["monsterUnlock"] })).toBe(true);
      expect(hasMonsterUnlockReward({ monsterUnlockManaCost: 3 })).toBe(true);
      expect(hasMonsterUnlockReward({ rewardsDescription: "Balrog & unlock all monsters" })).toBe(true);
      expect(hasMonsterUnlockReward(undefined)).toBe(false);
      expect(hasMonsterUnlockReward({})).toBe(false);
    });

    it("retrieves monster unlock mana cost correctly", () => {
      expect(getMonsterUnlockManaCost({ monsterUnlockManaCost: 4 })).toBe("4");
      expect(getMonsterUnlockManaCost({ monsterUnlockManaCost: "2R" })).toBe("2R");
      expect(getMonsterUnlockManaCost({})).toBe("2");
      expect(getMonsterUnlockManaCost(undefined)).toBe("2");
    });

    it("applies color-matched mana cost to Monster sub type cards (RR for red, BB for black, GG for green, WW for white)", () => {
      const cards = [
        { name: "Balrog", cardSubType: "Monster", color: "red", manaCost: "" },
        { name: "Nightmare", cardSubType: "Monster", color: "black", manaCost: "" },
        { name: "Forest Golem", cardSubType: "Monster", color: "green", manaCost: "" },
        { name: "Stone Golem", cardSubType: "Monster", color: "white", manaCost: "" },
        { name: "Elven Archer", cardSubType: "Elf", color: "green", manaCost: "G" },
      ] as any[];

      const updated = applyMonsterUnlockManaCost(cards, 3);
      expect(updated[0].manaCost).toBe("RRR");
      expect(updated[1].manaCost).toBe("BBB");
      expect(updated[2].manaCost).toBe("GGG");
      expect(updated[3].manaCost).toBe("WWW");
      expect(updated[4].manaCost).toBe("G");
    });

    it("sets Monster subtype and colored mana cost for raw monster cards matching by name", () => {
      const rawCards = [
        { name: "Balrog", type: "Creature", manaCost: "" },
        { name: "Nightmare", type: "Creature", manaCost: "" },
        { name: "Forest Golem", type: "Creature", manaCost: "" },
        { name: "Stone Golem", type: "Creature", manaCost: "" }
      ] as any[];

      const updated = applyMonsterUnlockManaCost(rawCards, 2);
      expect(updated[0].cardSubType).toBe("Monster");
      expect(updated[0].manaCost).toBe("RR");
      expect(updated[1].cardSubType).toBe("Monster");
      expect(updated[1].manaCost).toBe("BB");
      expect(updated[2].cardSubType).toBe("Monster");
      expect(updated[2].manaCost).toBe("GG");
      expect(updated[3].cardSubType).toBe("Monster");
      expect(updated[3].manaCost).toBe("WW");
    });

    it("includes Monster Unlock in getStructuredRewardsForLevel", () => {
      const level = {
        rewardsDescription: "Balrog card & unlock all monsters",
        monsterUnlock: true,
        monsterUnlockManaCost: 2,
        rewardCards: ["card_1784467369547"]
      };
      const rewards = getStructuredRewardsForLevel(level, 1, []);
      const unlockItem = rewards.find(r => r.type === "unlock");
      expect(unlockItem).toBeDefined();
      expect(unlockItem?.title).toBe("Unlock Monsters");
      expect(unlockItem?.description).toBe("Unlocks all monsters for summoning");
    });
  });

  describe("getXpRewardInfo", () => {
    it("returns configured bonus XP added to base XP", () => {
      expect(getXpRewardInfo({ xpReward: 50 }, 0)).toEqual({ baseXp: 10, bonusXp: 50, totalXp: 60 });
      expect(getXpRewardInfo({ xpAmount: 25 }, 1)).toEqual({ baseXp: 20, bonusXp: 25, totalXp: 45 });
      expect(getXpRewardInfo({ xp: 100 }, 2)).toEqual({ baseXp: 30, bonusXp: 100, totalXp: 130 });
    });

    it("defaults bonusXp to 0 and totalXp to base XP if no custom bonus XP is set", () => {
      expect(getXpRewardInfo(undefined, 0)).toEqual({ baseXp: 10, bonusXp: 0, totalXp: 10 });
      expect(getXpRewardInfo({}, 1)).toEqual({ baseXp: 20, bonusXp: 0, totalXp: 20 });
      expect(getXpRewardInfo({}, 2)).toEqual({ baseXp: 30, bonusXp: 0, totalXp: 30 });
    });
  });

  describe("generateQuestOpponents", () => {
    const cardPool = [
      { name: "Goblin Raider", type: "Creature", cardSubType: "Goblin", power: "3", toughness: "2" },
      { name: "Goblin King", type: "Creature", cardSubType: "Goblin", power: "5", toughness: "5" },
      { name: "Goliath", type: "Creature", cardSubType: "Giant", power: "10", toughness: "10" },
      { name: "Fireball", type: "Spell", manaCost: "R" },
    ] as any[];

    it("uses explicit opponents list if provided", () => {
      const level = {
        opponents: ["Goblin Raider"],
      };
      const result = generateQuestOpponents(level, cardPool);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Goblin Raider");
    });

    it("builds opponents randomly from candidates matching subtype without exceeding power limit", () => {
      const level = {
        army: { subType: "Goblin", power: 12 },
      };
      const result = generateQuestOpponents(level, cardPool);
      expect(result.length).toBeGreaterThan(0);
      
      let totalPower = 0;
      result.forEach(c => {
        expect(c.cardSubType).toBe("Goblin");
        totalPower += parseInt(c.power || "0", 10);
      });
      expect(totalPower).toBeLessThanOrEqual(12);
    });

    it("returns empty list if subtype candidate list is empty", () => {
      const level = {
        army: { subType: "Dragon", power: 20 },
      };
      const result = generateQuestOpponents(level, cardPool);
      expect(result).toHaveLength(0);
    });
  });

  describe("wizard card mapping modifications", () => {
    it("programmatically removes activated abilities from Wizard cards", () => {
      const rawWizard = {
        cardName: "Wizard L1",
        cardType: "Wizard",
        frameStyle: "blue",
        activatedAbilities: [
          {
            cost: ["C3"],
            text: "Add a mana of any color."
          }
        ]
      };
      const card = mapCardJson(rawWizard);
      expect(card.activatedAbilities).toEqual([]);
    });

    it("does not remove activated abilities from Wizard Ability spells", () => {
      const rawSpell = {
        cardName: "Wizard L1 Ability",
        cardType: "Spell",
        frameStyle: "blue",
        activatedAbilities: [
          {
            cost: ["C3"],
            text: "Add a mana of any color."
          }
        ]
      };
      const card = mapCardJson(rawSpell);
      expect(card.activatedAbilities).toHaveLength(1);
    });

    it("correctly identifies wizard cards and extracts levels from cardSubType", () => {
      const wizard1 = { cardName: "Wizard", cardType: "Wizard", cardSubType: "Level 1" };
      const wizard2 = { cardName: "Wizard", cardType: "Wizard", cardSubType: "Level 2" };
      const wizard3 = { cardName: "Wizard", cardType: "Wizard", cardSubType: "Level 3" };
      const wizard4 = { cardName: "Wizard", cardType: "Wizard", cardSubType: "Level 4" };

      expect(isWizardCard(wizard1)).toBe(true);
      expect(isWizardCard(wizard4)).toBe(true);
      expect(getWizardLevelFromCard(wizard1)).toBe(1);
      expect(getWizardLevelFromCard(wizard2)).toBe(2);
      expect(getWizardLevelFromCard(wizard3)).toBe(3);
      expect(getWizardLevelFromCard(wizard4)).toBe(4);
    });
  });

  describe("getQuestInitialHp", () => {
    it("returns armyQuestHp when specified in quest level", () => {
      const card: any = {
        name: "Demon Quest",
        questData: {
          name: "Demon Quest",
          levels: [
            { armyQuestHp: 15, armyPower: 15 }
          ]
        }
      };
      expect(getQuestInitialHp(card, 0)).toBe(15);
    });

    it("returns opponentsQuestHp or OpponentsQuestHp when specified in quest level", () => {
      const card1: any = {
        name: "Portal Quest",
        questData: {
          name: "Portal Quest",
          levels: [
            { opponentsQuestHp: 25 }
          ]
        }
      };
      const card2: any = {
        name: "Portal Quest 2",
        questData: {
          name: "Portal Quest 2",
          levels: [
            { OpponentsQuestHp: 30 }
          ]
        }
      };
      expect(getQuestInitialHp(card1, 0)).toBe(25);
      expect(getQuestInitialHp(card2, 0)).toBe(30);
    });

    it("falls back to default 10 if no quest HP property is present", () => {
      const card: any = {
        name: "Empty Quest",
        questData: {
          name: "Empty Quest",
          levels: [{}]
        }
      };
      expect(getQuestInitialHp(card, 0)).toBe(10);
    });

    it("resolves Dragons Nest Level 4 and Level 5 preset card rewards correctly", () => {
      const level4 = {
        rewardCardMode: "preset",
        rewardCards: ["card_1785760531046"]
      } as any;
      const res4 = resolveCardGrantForLevel(level4, []);
      expect(res4.cardToGrant?.name).toBe("Rick Dragonslayer");

      const level5 = {
        rewardCardMode: "preset",
        rewardCards: ["card_1786533684221"]
      } as any;
      const res5 = resolveCardGrantForLevel(level5, []);
      expect(res5.cardToGrant?.name).toBe("Gauntlet of might");
    });
  });

  describe("resolveKeywordGrantForLevel & buildQuestTextFromLevel", () => {
    it("handles choice keyword reward mode correctly", () => {
      const levelObj = {
        keywordRewardMode: "choice",
        keywordRewards: ["Flying", "Trample", "First Strike"]
      } as any;
      const res = resolveKeywordGrantForLevel(levelObj, []);
      expect(res.isChoice).toBe(true);

      const questText = buildQuestTextFromLevel(levelObj);
      expect(questText).toContain("Keyword: Any");
    });

    it("handles random keyword reward mode correctly", () => {
      const levelObj = {
        keywordRewardMode: "random",
        sections: ["questDesc", "keywordReward"]
      } as any;
      const res = resolveKeywordGrantForLevel(levelObj, ["Flying"]);
      expect(res.isChoice).toBe(false);
      expect(res.keywordToGrant).toBeDefined();
      expect(res.keywordToGrant).not.toBe("Flying");

      const questText = buildQuestTextFromLevel(levelObj);
      expect(questText).toContain("Wizard gains 1 Random Keyword Ability");
    });

    it("handles preset keyword reward mode correctly", () => {
      const levelObj = {
        keywordRewardMode: "preset",
        keywordReward: "Corruption",
        sections: ["questDesc", "keywordReward"]
      } as any;
      const res = resolveKeywordGrantForLevel(levelObj, []);
      expect(res.isChoice).toBe(false);
      expect(res.keywordToGrant).toBe("Corruption");

      const questText = buildQuestTextFromLevel(levelObj);
      expect(questText).toContain("Wizard gains Corruption");
    });

    it("enforces unique keyword grants when preset is already learned", () => {
      const levelObj = {
        keywordRewardMode: "preset",
        keywordReward: "Corruption",
        sections: ["questDesc", "keywordReward"]
      } as any;
      const res = resolveKeywordGrantForLevel(levelObj, ["Corruption"]);
      expect(res.isChoice).toBe(false);
      expect(res.keywordToGrant).toBeDefined();
      expect(res.keywordToGrant).not.toBe("Corruption");
    });

    it("does not include Stacking in available random keyword pool", () => {
      const levelObj = {
        keywordRewardMode: "random",
        sections: ["questDesc", "keywordReward"]
      } as any;
      // Sample random rewards multiple times to ensure Stacking is never granted
      for (let i = 0; i < 50; i++) {
        const res = resolveKeywordGrantForLevel(levelObj, []);
        expect(res.keywordToGrant).not.toBe("Stacking");
      }
    });
  });

  describe("resolveSpellGrantForLevel", () => {
    it("handles preset spell reward mode", () => {
      const levelObj = {
        learnSpellMode: "preset",
        learnSpell: "Fireball"
      } as any;
      expect(hasSpellReward(levelObj)).toBe(true);
      const res = resolveSpellGrantForLevel(levelObj);
      expect(res.isChoice).toBe(false);
      expect(res.spellToGrant).toBe("Fireball");
    });

    it("handles choice spell reward mode", () => {
      const levelObj = {
        learnSpellMode: "choice",
        learnSpells: ["Fireball", "Heal"]
      } as any;
      expect(hasSpellReward(levelObj)).toBe(true);
      const res = resolveSpellGrantForLevel(levelObj);
      expect(res.isChoice).toBe(true);
    });

    it("handles random spell reward mode", () => {
      const levelObj = {
        learnSpellMode: "random"
      } as any;
      const mockSpells = [
        { id: "s1", name: "Lightning Bolt", type: "Spell Ability" },
        { id: "s2", name: "Shield", type: "Spell Ability" }
      ] as any[];
      expect(hasSpellReward(levelObj)).toBe(true);
      const res = resolveSpellGrantForLevel(levelObj, [], mockSpells);
      expect(res.isChoice).toBe(false);
      expect(res.isRandom).toBe(true);
      expect(["Lightning Bolt", "Shield"]).toContain(res.spellToGrant);
    });

    it("resolves raw card ID in preset spell reward mode to actual card name", () => {
      const levelObj = {
        learnSpellMode: "preset",
        learnSpell: "card_1784506003132"
      } as any;
      const cardPool = [
        { id: "card_1784506003132", name: "Clone", type: "Spell", cardSubType: "battle" }
      ] as any[];
      const res = resolveSpellGrantForLevel(levelObj, [], cardPool);
      expect(res.isChoice).toBe(false);
      expect(res.spellToGrant).toBe("Clone");
    });

    it("correctly identifies Tower of Terror level 4 as a random spell reward", () => {
      expect(defaultTowerOfTerrorQuestData.levels.length).toBe(5);
      const level4 = defaultTowerOfTerrorQuestData.levels[3];
      expect(level4.learnSpellMode).toBe("random");
      expect(hasSpellReward(level4)).toBe(true);
      const res = resolveSpellGrantForLevel(level4);
      expect(res.isRandom).toBe(true);
    });

    it("filters random spell rewards by player produced mana colors", () => {
      const levelObj = { learnSpellMode: "random" } as any;
      const mockSpells = [
        { id: "s1", name: "Fireball", type: "Spell", manaCost: "2R", color: "red" },
        { id: "s2", name: "Counterspell Black", type: "Spell", manaCost: "BB", color: "black" },
        { id: "s3", name: "Clone", type: "Spell", manaCost: "3U", color: "blue" }
      ] as any[];

      // Player produces only Red mana
      const resRed = resolveSpellGrantForLevel(levelObj, [], mockSpells, ["red"]);
      expect(resRed.spellToGrant).toBe("Fireball");

      // Player produces only Blue mana
      const resBlue = resolveSpellGrantForLevel(levelObj, [], mockSpells, ["blue"]);
      expect(resBlue.spellToGrant).toBe("Clone");
    });

    it("canPlayerProduceSpellMana evaluates spell color compatibility correctly", () => {
      const redSpell = { name: "Fireball", manaCost: "2R", color: "red" } as any;
      const blackSpell = { name: "Dark Ritual", manaCost: "B", color: "black" } as any;
      const colorlessSpell = { name: "Sol Ring", manaCost: "1", color: "colorless" } as any;

      expect(canPlayerProduceSpellMana(redSpell, ["red"])).toBe(true);
      expect(canPlayerProduceSpellMana(redSpell, ["blue"])).toBe(false);
      expect(canPlayerProduceSpellMana(blackSpell, ["red", "blue"])).toBe(false);
      expect(canPlayerProduceSpellMana(blackSpell, ["black"])).toBe(true);
      expect(canPlayerProduceSpellMana(colorlessSpell, ["red"])).toBe(true);
    });
  });

  describe("isBattleSpell", () => {
    it("returns true for battle spells", () => {
      expect(isBattleSpell({ type: "Spell", cardSubType: "Battle", name: "Fireball" } as any)).toBe(true);
      expect(isBattleSpell({ type: "Spell", cardSubType: "Battle", name: "Clone" } as any)).toBe(true);
    });

    it("returns false for non-battle enchantment and map/economy spells", () => {
      expect(isBattleSpell({ type: "Spell", cardSubType: "Enchantment", name: "Upgrade Land", customDescription: "Upgrade target controlled territory level by 1." } as any)).toBe(false);
      expect(isBattleSpell({ type: "Spell", cardSubType: "Enchantment", name: "Mana Boost", customDescription: "Gain {G}{G}{G} extra mana." } as any)).toBe(false);
      expect(isBattleSpell({ type: "Spell", cardSubType: "Enchantment", name: "Draw Cards", customDescription: "Draw 2 cards from your deck." } as any)).toBe(false);
      expect(isBattleSpell({ type: "Spell", cardSubType: "Enchantment", name: "Claim Land", customDescription: "Claim target unowned adjacent tile as controlled territory." } as any)).toBe(false);
    });
  });

  describe("resolveCompanionGrantForLevel", () => {
    it("handles preset companion reward mode", () => {
      const levelObj = {
        companionRewardMode: "preset",
        companionReward: "Wolf Companion"
      } as any;
      expect(hasCompanionReward(levelObj)).toBe(true);
      const res = resolveCompanionGrantForLevel(levelObj);
      expect(res.isChoice).toBe(false);
      expect(res.companionToGrant).toBe("Wolf Companion");
    });

    it("resolves raw card ID in preset companion reward mode to actual card name", () => {
      const levelObj = {
        companionRewardMode: "preset",
        companionReward: "card_1782897244143"
      } as any;
      const cardPool = [
        { id: "card_1782897244143", name: "White Knight", type: "Creature", cardSubType: "Human Knight" }
      ] as any[];
      const res = resolveCompanionGrantForLevel(levelObj, [], cardPool);
      expect(res.isChoice).toBe(false);
      expect(res.companionToGrant).toBe("White Knight");
    });

    it("resolves companionRewards array in JSON file for preset companion", () => {
      const levelObj = {
        companionRewardMode: "preset",
        companionRewards: ["card_1782897244143"]
      } as any;
      const cardPool = [
        { id: "card_1782897244143", name: "White Knight", type: "Creature", cardSubType: "Human Knight" }
      ] as any[];
      expect(hasCompanionReward(levelObj)).toBe(true);
      const res = resolveCompanionGrantForLevel(levelObj, [], cardPool);
      expect(res.isChoice).toBe(false);
      expect(res.companionToGrant).toBe("White Knight");
    });

    it("handles choice companion reward mode", () => {
      const levelObj = {
        companionRewardMode: "choice",
        companionRewardList: ["Wolf", "Bear"]
      } as any;
      expect(hasCompanionReward(levelObj)).toBe(true);
      const res = resolveCompanionGrantForLevel(levelObj);
      expect(res.isChoice).toBe(true);
    });

    it("handles random companion reward mode with subType filter", () => {
      const levelObj = {
        companionRewardMode: "random",
        companionRewardRandomSubType: "Dragon"
      } as any;
      const mockCreatures = [
        { id: "c1", name: "Fire Dragon", type: "Creature", cardSubType: "Dragon" },
        { id: "c2", name: "Forest Wolf", type: "Creature", cardSubType: "Wolf" }
      ] as any[];
      expect(hasCompanionReward(levelObj)).toBe(true);
      const res = resolveCompanionGrantForLevel(levelObj, [], mockCreatures);
      expect(res.isChoice).toBe(false);
      expect(res.isRandom).toBe(true);
      expect(res.companionToGrant).toBe("Fire Dragon");
    });
  });

  describe("findCardsByRawId", () => {
    const mockPool = [
      { id: "card_1782853578674", name: "Skirk Prospector Goblin", type: "Creature", color: "red" },
      { id: "card_1784467664393", name: "Nightmare", type: "Creature", color: "black" },
      { id: "tmpl_fireball", name: "Fireball", type: "Spell", color: "red" }
    ] as any[];

    it("returns empty array for empty or whitespace query", () => {
      expect(findCardsByRawId("", mockPool)).toEqual([]);
      expect(findCardsByRawId("   ", mockPool)).toEqual([]);
    });

    it("finds exact card by raw id", () => {
      const found = findCardsByRawId("card_1782853578674", mockPool);
      expect(found).toHaveLength(1);
      expect(found[0].name).toBe("Skirk Prospector Goblin");
    });

    it("finds card by case-insensitive partial raw id or name", () => {
      const found = findCardsByRawId("FIREBALL", mockPool);
      expect(found).toHaveLength(1);
      expect(found[0].id).toBe("tmpl_fireball");
    });

    it("falls back to built-in opponent card if raw id starts with card_", () => {
      const found = findCardsByRawId("card_1784467369547", []);
      expect(found).toHaveLength(1);
      expect(found[0].name).toBe("Balrog");
    });
  });

  describe("buildQuestTextFromLevel", () => {
    it("formats attributeReward in buildQuestTextFromLevel output", () => {
      const levelObj = {
        questDescription: "Test objective",
        attributeReward: { power: 10, toughness: 10 }
      } as any;
      const text = buildQuestTextFromLevel(levelObj);
      expect(text).toContain("Reward: +10/+10 attribute reward");
    });

    it("resolves raw spell card ID and does not fall back to Nightmare", () => {
      const mockCards = [
        { id: "card_1784506003132", name: "Clone", type: "Spell", customDescription: "Clone" }
      ] as any[];
      const levelObj = {
        questDescription: "Learn clone",
        learnSpells: ["card_1784506003132"],
        learnSpellMode: "preset"
      } as any;
      const text = buildQuestTextFromLevel(levelObj, mockCards);
      expect(text).toContain("Reward: Spell: Clone");
      expect(text).not.toContain("Nightmare");
    });
  });

  describe("spells and companions mapping", () => {
    it("preserves spells and companions when mapping raw card JSON (e.g. Necromancer)", () => {
      const rawNecromancer = {
        id: "card_1785165293355",
        cardName: "Necromancer",
        cardType: "Creature",
        cardSubType: "Wizard",
        spells: ["card_1785957711575", "card_1785957947231"],
        companions: ["card_1782897244143"]
      };

      const mapped = mapCardJson(rawNecromancer);
      expect(mapped.spells).toEqual(["card_1785957711575", "card_1785957947231"]);
      expect(mapped.companions).toEqual(["card_1782897244143"]);
    });

    it("resolves raw spell IDs to human readable spell names", () => {
      const cardPool = [
        { id: "card_1785957711575", name: "Fear", type: "Spell" },
        { id: "card_1785957947231", name: "Regenerate", type: "Spell" }
      ] as any[];

      const spell1 = resolveOpponentCard("card_1785957711575", cardPool);
      const spell2 = resolveOpponentCard("card_1785957947231", cardPool);

      expect(spell1.name).toBe("Fear");
      expect(spell1.rulesText).toBe("Target creature gets -1/-1 until end of battle.");
      expect(spell1.manaCost).toBe("{B}");
      expect(spell1.color).toBe("black");
      expect(spell2.name).toBe("Regenerate");
      expect(spell2.rulesText).toBe("Target friendly creature gains Regenerate until end of battle.");
    });

    it("resolves Fear correctly even without cardPool", () => {
      const fear = resolveOpponentCard("card_1785957711575", []);
      expect(fear.name).toBe("Fear");
      expect(fear.type).toBe("Spell");
      expect(fear.cardSubType).toBe("Battle");
      expect(fear.rulesText).toBe("Target creature gets -1/-1 until end of battle.");
      expect(fear.manaCost).toBe("{B}");
      expect(fear.color).toBe("black");
    });

    it("resolves wizard spell IDs such as Lightning Strike, Fireball, and Counterspell variants", () => {
      const ls = resolveOpponentCard("card_1784504384559", []);
      const fb = resolveOpponentCard("card_1784504524412", []);
      const clone = resolveOpponentCard("card_1784506003132", []);
      const cs = resolveOpponentCard("card_1784541679387", []);
      const csRed = resolveOpponentCard("Counterspell Red", []);

      expect(ls.name).toBe("Lightning Strike");
      expect(fb.name).toBe("Fireball");
      expect(clone.name).toBe("Clone");
      expect(cs.name).toBe("Counterspell");
      expect(cs.manaCost).toBe("{U}{U}");
      expect(cs.color).toBe("blue");
      expect(csRed.name).toBe("Counterspell Red");
      expect(csRed.manaCost).toBe("{R}{R}");
      expect(csRed.color).toBe("red");
    });

    it("ensures Necromancer always has its spells (Fear & Regenerate) when resolved or mapped", () => {
      const oppByName = resolveOpponentCard("Necromancer", []);
      expect(oppByName.spells).toEqual(["card_1785957711575", "card_1785957947231"]);

      const oppById = resolveOpponentCard("card_1785165293355", []);
      expect(oppById.spells).toEqual(["card_1785957711575", "card_1785957947231"]);

      const mappedWithoutSpells = mapCardJson({ cardName: "Necromancer", cardType: "Creature" });
      expect(mappedWithoutSpells.spells).toEqual(["card_1785957711575", "card_1785957947231"]);
    });
  });

  describe("isReviveSpell & isReanimateSpell", () => {
    it("identifies Revive, Reincarnate, and Reanimate as revive spells", () => {
      expect(isReviveSpell({ name: "Revive" })).toBe(true);
      expect(isReviveSpell({ name: "Reincarnate" })).toBe(true);
      expect(isReviveSpell({ name: "Reanimate" })).toBe(true);
    });

    it("identifies Reanimate specifically", () => {
      expect(isReanimateSpell({ name: "Reanimate" })).toBe(true);
      expect(isReanimateSpell({ name: "Revive" })).toBe(false);
      expect(isReanimateSpell({ name: "Reincarnate" })).toBe(false);
    });
  });

  describe("getStructuredRewardsForLevel", () => {
    it("extracts card, keyword, spell, companion, mana, xp, unlock, and attribute rewards", () => {
      const levelObj = {
        rewardCards: ["card_1784467664393"],
        keywordRewardMode: "choice",
        learnSpellMode: "preset",
        learnSpell: "Fireball",
        companionRewardMode: "random",
        companionRewardRandomSubType: "Monster",
        manaReward: { amount: 10, mode: "choice" },
        xpReward: 25,
        monsterUnlock: true,
        attributeReward: { power: 2, toughness: 2 },
        rewardsDescription: "Complete mastery over dark magic."
      } as any;

      const items = getStructuredRewardsForLevel(levelObj, 0, []);
      const types = items.map(i => i.type);
      expect(types).toContain("card");
      expect(types).toContain("keyword");
      expect(types).toContain("spell");
      expect(types).toContain("companion");
      expect(types).toContain("mana");
      expect(types).toContain("xp");
      expect(types).toContain("unlock");
      expect(types).toContain("attribute");

      const spellItem = items.find(i => i.type === "spell");
      expect(spellItem?.title).toBe("Fireball");
      expect(spellItem?.rewardMode).toBe("preset");
      expect(spellItem?.modeIcon).toBe("fa-bookmark");

      const cardItem = items.find(i => i.type === "card");
      expect(cardItem?.title).toContain("Nightmare");
      expect(cardItem?.card?.name).toBe("Nightmare");

      const xpItem = items.find(i => i.type === "xp");
      expect(xpItem?.title).toBe("+35 XP");

      const manaItem = items.find(i => i.type === "mana");
      expect(manaItem?.rewardMode).toBe("choice");
      expect(manaItem?.modeIcon).toBe("fa-list-check");
    });

    it("lists individual card names for multiple reward cards instead of Cards(N)", () => {
      const levelObj = {
        rewardCards: ["card_1784467664393", "card_1784467369547"]
      } as any;
      const items = getStructuredRewardsForLevel(levelObj, 0, []);
      const cardItems = items.filter(i => i.type === "card");
      expect(cardItems.length).toBe(2);
      expect(cardItems[0].title).toBe("Card: Nightmare");
      expect(cardItems[1].title).toBe("Card: Balrog");
    });

    it("correctly extracts Level 5 Tower of Terror quest reward as Companion reward (Monster) with fa-user-group icon and random mode", () => {
      const level5Obj = defaultTowerOfTerrorQuestData.levels[4];
      const items = getStructuredRewardsForLevel(level5Obj, 4, []);
      const companionItem = items.find(i => i.type === "companion");
      expect(companionItem).toBeDefined();
      expect(companionItem?.title).toBe("Companion: Monster");
      expect(companionItem?.icon).toBe("fa-user-group");
      expect(companionItem?.rewardMode).toBe("random");
      expect(companionItem?.modeIcon).toBe("fa-dice");
      const cardItems = items.filter(i => i.type === "card");
      expect(cardItems.length).toBe(0);
    });

    it("correctly extracts Level 2 City of the Dead quest reward as a Random Skeleton Card reward", () => {
      const cityQuestLevel2 = {
        sections: ["questDesc", "rewardCards", "opponents"],
        rewardCardMode: "random",
        rewardCardRandomSubType: "Skeleton"
      } as any;
      const items = getStructuredRewardsForLevel(cityQuestLevel2, 1, []);
      const cardItem = items.find(i => i.type === "card");
      expect(cardItem).toBeDefined();
      expect(cardItem?.title).toBe("Card: Skeleton");
      expect(cardItem?.rewardMode).toBe("random");
      expect(cardItem?.modeIcon).toBe("fa-dice");
      expect(cardItem?.icon).toBe("fa-box-open");
    });

    it("returns Card: Goblin title for choice mode with Goblin subType (e.g. Goblin Camp Level 2)", () => {
      const goblinCampLevel2 = {
        sections: ["questDesc", "rewardCards", "opponents"],
        rewardCardMode: "choice",
        rewardCardRandomSubType: "Goblin"
      } as any;
      const items = getStructuredRewardsForLevel(goblinCampLevel2, 1, []);
      const cardItem = items.find(i => i.type === "card");
      expect(cardItem).toBeDefined();
      expect(cardItem?.title).toBe("Card: Goblin");
      expect(cardItem?.rewardMode).toBe("choice");
      expect(cardItem?.modeIcon).toBe("fa-list-check");
    });

    it("returns Spell: Battle title for random mode with Battle subType (e.g. Tower of Terror Level 4)", () => {
      const towerOfTerrorLevel4 = {
        sections: ["questDesc", "learnSpell", "army"],
        learnSpellMode: "random",
        learnSpellRandomSubType: "Battle"
      } as any;
      const items = getStructuredRewardsForLevel(towerOfTerrorLevel4, 3, []);
      const spellItem = items.find(i => i.type === "spell");
      expect(spellItem).toBeDefined();
      expect(spellItem?.title).toBe("Spell: Battle");
      expect(spellItem?.rewardMode).toBe("random");
      expect(spellItem?.modeIcon).toBe("fa-dice");
    });

    it("correctly maps card_1784467862209 to Forest Golem for Tower of Terror Level 2", () => {
      const oppCard = resolveOpponentCard("card_1784467862209", []);
      expect(oppCard.name).toBe("Forest Golem");

      const items = getStructuredRewardsForLevel(defaultTowerOfTerrorQuestData.levels[1], 1, []);
      const cardItem = items.find(i => i.type === "card");
      expect(cardItem).toBeDefined();
      expect(cardItem?.title).toBe("Card: Forest Golem");
    });
  });

  describe("checkTowerLevelUpEligibility", () => {
    it("returns correct requirements for levels 1, 2, and 3", () => {
      expect(getTowerLevelUpRequirements(1)).toEqual({ requiredLands: 20 });
      expect(getTowerLevelUpRequirements(2)).toEqual({ requiredLands: 30 });
      expect(getTowerLevelUpRequirements(3)).toEqual({ requiredLands: 40 });
      expect(getTowerLevelUpRequirements(4)).toBeNull();
    });

    it("rejects level 1 -> 2 upgrade if under 20 lands", () => {
      const cells19 = Array.from({ length: 19 }, () => ({ ownerId: 0, tileId: "Plains L1" }));
      const check1 = checkTowerLevelUpEligibility(cells19, 1, 0);
      expect(check1.eligible).toBe(false);
      expect(check1.reason).toContain("20 lands");
    });

    it("approves level 1 -> 2 upgrade when owning 20 lands regardless of land level", () => {
      const validCells = Array.from({ length: 20 }, () => ({ ownerId: 0, tileId: "Plains L1" }));
      const check = checkTowerLevelUpEligibility(validCells, 1, 0);
      expect(check.eligible).toBe(true);
    });

    it("approves level 2 -> 3 upgrade when owning 30 lands regardless of land level", () => {
      const validCells = Array.from({ length: 30 }, () => ({ ownerId: 0, tileId: "Swamp L1" }));
      const check = checkTowerLevelUpEligibility(validCells, 2, 0);
      expect(check.eligible).toBe(true);
    });

    it("approves level 3 -> 4 upgrade when owning 40 lands regardless of land level", () => {
      const validCells = Array.from({ length: 40 }, () => ({ ownerId: 0, tileId: "Plains L1" }));
      const check = checkTowerLevelUpEligibility(validCells, 3, 0);
      expect(check.eligible).toBe(true);
    });
  });

  describe("Quest Reward Matrix State & Counting", () => {
    it("starts with an empty collapse dictionary so all quests default to collapsed", () => {
      const collapsedQuestPanels: Record<string, boolean> = {};
      const questName = "Tower of Terror Quest";
      const isCollapsed = collapsedQuestPanels[questName] ?? true;
      expect(isCollapsed).toBe(true);
    });

    it("correctly identifies Vision as a non-battle spell that draws cards", () => {
      const visionCard = { name: "Vision", type: "Spell", cardSubType: "Enchantment", manaCost: "{U}", color: "blue", rulesText: "Draw 2 cards from your deck." };
      expect(isNonBattleSpell(visionCard as any)).toBe(true);
    });

    it("calculates extra 10 XP bonus when possessing Boots of Luck artifact", () => {
      const xpInfo = getXpRewardInfo({ xpReward: 20 }, 0);
      const bootsBonus = 10;
      const totalWithBoots = xpInfo.totalXp + bootsBonus;
      expect(totalWithBoots).toBe(40); // 10 base + 20 bonus + 10 boots = 40 XP
    });

    it("resolves Battlewand artifact correctly and includes Lightning Strike in spells", () => {
      const battlewand = resolveOpponentCard("Battlewand", []);
      expect(battlewand).toBeDefined();
      expect(battlewand.name).toBe("Battlewand");
      expect(battlewand.type).toBe("Artifact");
      expect(battlewand.spells).toEqual(["card_1784504384559"]);
    });

    it("resolves Poisoned dagger artifact correctly and includes Poison in keywords", () => {
      const dagger = resolveOpponentCard("Poisoned dagger", []);
      expect(dagger).toBeDefined();
      expect(dagger.name).toBe("Poisoned dagger");
      expect(dagger.type).toBe("Artifact");
      expect(dagger.keywords).toEqual(["Poison"]);
    });

    it("resolves preset card rewards correctly", () => {
      const level = { cardRewardMode: "preset" as const, rewardCards: ["card_1784467664393"] };
      const result = resolveCardGrantForLevel(level, []);
      expect(result.isChoice).toBe(false);
      expect(result.cardToGrant?.name).toBe("Nightmare");
    });

    it("resolves choice card rewards correctly", () => {
      const level = { cardRewardMode: "choice" as const, cardRewardList: ["card_1784467664393", "card_1784467369547"] };
      const result = resolveCardGrantForLevel(level, []);
      expect(result.isChoice).toBe(true);
      expect(result.choiceOptions?.length).toBeGreaterThanOrEqual(2);
    });

    it("resolves random card rewards correctly", () => {
      const level = { cardRewardMode: "random" as const };
      const dummyPool = [
        { id: "c1", name: "Fire Drake", type: "Creature", manaCost: "3R", color: "red" },
        { id: "c2", name: "Ice Elemental", type: "Creature", manaCost: "2U", color: "blue" }
      ] as any;
      const result = resolveCardGrantForLevel(level, dummyPool);
      expect(result.isRandom).toBe(true);
      expect(result.cardToGrant).toBeDefined();
    });

    it("resolves Gladiator School Quest Level 5 rewards correctly as Card rewards", () => {
      const level5 = {
        sections: ["questDesc", "rewardCards", "attributeReward", "opponents"],
        rewardCardMode: "preset",
        rewardCards: ["card_1786110500192", "card_1786015866699"]
      } as any;
      const items = getStructuredRewardsForLevel(level5, 4, []);
      const cardItems = items.filter(i => i.type === "card");
      expect(cardItems.length).toBe(2);
      expect(cardItems.some(c => c.title.includes("Bracelet of strength"))).toBe(true);
      expect(cardItems.some(c => c.title.includes("Spartacus"))).toBe(true);
      const spellItems = items.filter(i => i.type === "spell");
      expect(spellItems.length).toBe(0);
    });

    it("resolves Tower of Power Quest Level 4 rewards correctly as Spell Choice (Battle)", () => {
      const level4 = {
        sections: ["questDesc", "learnSpell", "manaReward", "army"],
        learnSpellMode: "choice",
        learnSpellRandomSubType: "Battle",
        manaReward: { amount: 5, mode: "choice" }
      } as any;
      const items = getStructuredRewardsForLevel(level4, 3, []);
      const spellItem = items.find(i => i.type === "spell");
      expect(spellItem).toBeDefined();
      expect(spellItem?.title).toBe("Spell: Battle");
      expect(spellItem?.rewardMode).toBe("choice");
      const manaItem = items.find(i => i.type === "mana");
      expect(manaItem).toBeDefined();
      expect(manaItem?.title).toBe("+5 Mana Pool");
      expect(manaItem?.rewardMode).toBe("choice");
    });
  });

  describe("getPlayerQuestProgress", () => {
    it("returns zero progress when player is null or has no quests", () => {
      expect(getPlayerQuestProgress(null)).toEqual({
        totalQuests: 0,
        completedQuests: 0,
        remainingQuests: 0,
        allCompleted: false
      });

      const playerNoQuests = {
        hand: [{ name: "Fireball", type: "Spell", manaCost: "R", color: "red", illustration: "", rulesText: "" }],
        deck: [],
        graveyard: []
      } as any;
      expect(getPlayerQuestProgress(playerNoQuests)).toEqual({
        totalQuests: 0,
        completedQuests: 0,
        remainingQuests: 0,
        allCompleted: false
      });
    });

    it("correctly identifies remaining quests when some are incomplete", () => {
      const playerWithQuests = {
        hand: [
          { name: "Forest Quest", type: "Quest", manaCost: "", color: "artifact", illustration: "", rulesText: "", completed: true },
          { name: "Mountain Quest", type: "Quest", manaCost: "", color: "artifact", illustration: "", rulesText: "", completed: false }
        ],
        deck: [
          { name: "Swamp Quest", type: "Quest", manaCost: "", color: "artifact", illustration: "", rulesText: "" }
        ],
        graveyard: []
      } as any;

      const progress = getPlayerQuestProgress(playerWithQuests);
      expect(progress.totalQuests).toBe(3);
      expect(progress.completedQuests).toBe(1);
      expect(progress.remainingQuests).toBe(2);
      expect(progress.allCompleted).toBe(false);
    });

    it("correctly triggers allCompleted when all quests are marked completed", () => {
      const playerAllCompleted = {
        hand: [
          { name: "Forest Quest", type: "Quest", manaCost: "", color: "artifact", illustration: "", rulesText: "", completed: true },
          { name: "Mountain Quest", type: "Quest", manaCost: "", color: "artifact", illustration: "", rulesText: "", completed: true }
        ],
        deck: [
          { name: "Swamp Quest", type: "Quest", manaCost: "", color: "artifact", illustration: "", rulesText: "", completed: true }
        ],
        graveyard: []
      } as any;

      const progress = getPlayerQuestProgress(playerAllCompleted);
      expect(progress.totalQuests).toBe(3);
      expect(progress.completedQuests).toBe(3);
      expect(progress.remainingQuests).toBe(0);
      expect(progress.allCompleted).toBe(true);
    });
  });

  describe("Card reward exclusions for choice and random modes", () => {
    const mockCardPool = [
      { id: "hero_1", name: "Sir Lancelot", type: "Hero", cardSubType: "Knight", illustration: "", rulesText: "" },
      { id: "artifact_1", name: "Ring of Power", type: "Artifact", cardSubType: "Equipment", illustration: "", rulesText: "" },
      { id: "portal_1", name: "Nether Portal", type: "Portal", cardSubType: "Portal", illustration: "", rulesText: "" },
      { id: "creature_1", name: "Gladiator", type: "Creature", cardSubType: "Gladiator", illustration: "", rulesText: "" },
      { id: "creature_2", name: "Demon Imp", type: "Creature", cardSubType: "Demon", illustration: "", rulesText: "" },
      { id: "spell_1", name: "Fireball", type: "Spell", cardSubType: "Battle", illustration: "", rulesText: "" }
    ] as any[];

    it("excludes Portal, Hero, and Artifact cards when card reward mode is choice", () => {
      const choiceLevel = {
        sections: ["questDesc", "rewardCards"],
        rewardCardMode: "choice"
      } as any;

      const grant = resolveCardGrantForLevel(choiceLevel, mockCardPool);
      expect(grant.isChoice).toBe(true);
      expect(grant.choiceOptions).toBeDefined();
      const optionNames = grant.choiceOptions!.map(c => c.name);
      expect(optionNames).not.toContain("Sir Lancelot");
      expect(optionNames).not.toContain("Ring of Power");
      expect(optionNames).not.toContain("Nether Portal");
      expect(optionNames).toContain("Gladiator");
    });

    it("excludes Portal, Hero, and Artifact cards when card reward mode is random", () => {
      const randomLevel = {
        sections: ["questDesc", "rewardCards"],
        rewardCardMode: "random"
      } as any;

      // Run multiple times to verify random selection never picks excluded cards
      for (let i = 0; i < 20; i++) {
        const grant = resolveCardGrantForLevel(randomLevel, mockCardPool);
        expect(grant.isRandom).toBe(true);
        expect(grant.cardToGrant).toBeDefined();
        const pickedName = grant.cardToGrant!.name;
        expect(pickedName).not.toBe("Sir Lancelot");
        expect(pickedName).not.toBe("Ring of Power");
        expect(pickedName).not.toBe("Nether Portal");
      }
    });

    it("allows Portal, Hero, and Artifact cards when card reward mode is preset", () => {
      const presetLevel = {
        sections: ["questDesc", "rewardCards"],
        rewardCardMode: "preset",
        rewardCards: ["artifact_1", "hero_1"]
      } as any;

      const grant = resolveCardGrantForLevel(presetLevel, mockCardPool);
      expect(grant.isChoice).toBe(false);
      expect(grant.isRandom).toBe(false);
      expect(grant.cardsToGrant).toBeDefined();
      const names = grant.cardsToGrant!.map(c => c.name);
      expect(names).toContain("Ring of Power");
      expect(names).toContain("Sir Lancelot");
    });
  });

  describe("isNoCostCreature", () => {
    it("identifies creatures with empty or missing mana cost as no-cost creatures", () => {
      const skeleton = {
        name: "Skeleton",
        type: "Creature",
        power: "1",
        toughness: "1",
        manaCost: ""
      } as any;
      expect(isNoCostCreature(skeleton)).toBe(true);

      const balrog = {
        name: "Balrog",
        type: "Creature",
        power: "6",
        toughness: "6",
        manaCost: "0"
      } as any;
      expect(isNoCostCreature(balrog)).toBe(true);
    });

    it("returns false for creatures with a mana cost", () => {
      const elvenArcher = {
        name: "Elven Archer",
        type: "Creature",
        power: "1",
        toughness: "1",
        manaCost: "G"
      } as any;
      expect(isNoCostCreature(elvenArcher)).toBe(false);
    });

    it("returns false for spells, artifacts, quests, heroes, and lands even if they have no mana cost", () => {
      const spell = { name: "Dark Ritual", type: "Spell", manaCost: "" } as any;
      const artifact = { name: "Ring of Power", type: "Artifact", manaCost: "" } as any;
      const quest = { name: "Dragons Nest Quest", type: "Quest", manaCost: "" } as any;
      const hero = { name: "Sir Lancelot", type: "Hero", manaCost: "" } as any;
      const land = { name: "Swamp", type: "Land", manaCost: "" } as any;

      expect(isNoCostCreature(spell)).toBe(false);
      expect(isNoCostCreature(artifact)).toBe(false);
      expect(isNoCostCreature(quest)).toBe(false);
      expect(isNoCostCreature(hero)).toBe(false);
      expect(isNoCostCreature(land)).toBe(false);
    });
  });

  describe("Opponent Spells and Companions Resolution", () => {
    it("resolves Archmage with First Strike, Strength and Guard Dog companion", () => {
      const archmage = resolveOpponentCard("Archmage", []);
      expect(archmage.name).toBe("Archmage");
      expect(archmage.spells).toContain("card_1784504232346"); // First Strike
      expect(archmage.spells).toContain("card_1785768764508"); // Strength
      expect(archmage.companions).toContain("card_1787057762927"); // Guard Dog
    });

    it("resolves Grandmaster Mage with 4 spells and Guard Dog companion", () => {
      const grandmaster = resolveOpponentCard("Grandmaster Mage", []);
      expect(grandmaster.name).toBe("Grandmaster Mage");
      expect(grandmaster.spells).toHaveLength(4);
      expect(grandmaster.companions).toContain("card_1787057762927");
    });

    it("resolves Battle Mage with Lightning Strike and Fireball", () => {
      const battleMage = resolveOpponentCard("Battle Mage", []);
      expect(battleMage.name).toBe("Battle Mage");
      expect(battleMage.spells).toContain("card_1784504384559"); // Lightning Strike
      expect(battleMage.spells).toContain("card_1784504524412"); // Fireball
    });

    it("resolves Fireball Archmage and Lightning Archmage with their signature spells", () => {
      const fbArch = resolveOpponentCard("Fireball Archmage", []);
      const lsArch = resolveOpponentCard("Lightning Archmage", []);
      expect(fbArch.spells).toContain("card_1784504524412");
      expect(lsArch.spells).toContain("card_1784504384559");
    });

    it("ensures all opponent wizards are card type Creature with cardSubType Wizard", () => {
      const archmage = resolveOpponentCard("Archmage", []);
      const grandmaster = resolveOpponentCard("Grandmaster Mage", []);
      const battleMage = resolveOpponentCard("Battle Mage", []);
      const fireballArch = resolveOpponentCard("Fireball Archmage", []);
      const lightningArch = resolveOpponentCard("Lightning Archmage", []);
      const warlock = resolveOpponentCard("Warlock", []);
      const necromancer = resolveOpponentCard("Necromancer", []);

      [archmage, grandmaster, battleMage, fireballArch, lightningArch, warlock, necromancer].forEach(wizard => {
        expect(wizard.type).toBe("Creature");
        expect(wizard.cardSubType).toBe("Wizard");
      });
    });

    it("generates wizard opponents for Tower of Power armySubTypes: ['Wizard'] as type Creature (sub type Wizard) and never type Wizard", () => {
      const cardPool = [
        { name: "Player Wizard L1", type: "Wizard", cardSubType: "Player Hero", power: "1", toughness: "1", manaCost: "", color: "blue", illustration: "", rulesText: "" },
        { name: "Archmage", type: "Creature", cardSubType: "Wizard", power: "2", toughness: "2", manaCost: "3U", color: "blue", illustration: "", rulesText: "" },
        { name: "Battle Mage", type: "Creature", cardSubType: "Wizard", power: "2", toughness: "1", manaCost: "2R", color: "red", illustration: "", rulesText: "" },
        { name: "Goblin Archer", type: "Creature", cardSubType: "Goblin", power: "1", toughness: "1", manaCost: "R", color: "red", illustration: "", rulesText: "" }
      ] as any[];

      const levelObj = {
        armySubTypes: ["Wizard"],
        armyPower: 4
      } as any;

      const opps = generateQuestOpponents(levelObj, cardPool);
      expect(opps.length).toBeGreaterThan(0);
      opps.forEach(opp => {
        expect(opp.type).toBe("Creature");
        expect(opp.cardSubType).toBe("Wizard");
        expect(opp.name).not.toBe("Player Wizard L1");
      });
    });

    it("resolves opponent fallback spells with cardSubType Battle and isBattleSpell true", () => {
      const fireballSpell = resolveOpponentCard("card_1784504524412", []);
      expect(fireballSpell.name).toBe("Fireball");
      expect(fireballSpell.type).toBe("Spell");
      expect(fireballSpell.cardSubType).toBe("Battle");
      expect(isBattleSpell(fireballSpell)).toBe(true);

      const freezeSpell = resolveOpponentCard("card_1785768547724", []);
      expect(freezeSpell.name).toBe("Freeze");
      expect(freezeSpell.type).toBe("Spell");
      expect(freezeSpell.cardSubType).toBe("Battle");
      expect(isBattleSpell(freezeSpell)).toBe(true);
    });
  });

  describe("adjustQuestOpponentForDifficulty", () => {
    const baseCreature = {
      name: "Goblin Raider",
      power: "3",
      toughness: "3",
      type: "Creature"
    } as any;

    it("leaves stats unchanged for medium difficulty", () => {
      const adjusted = adjustQuestOpponentForDifficulty(baseCreature, "medium");
      expect(adjusted.power).toBe("3");
      expect(adjusted.toughness).toBe("3");
    });

    it("reduces stats by 1 (min 1) for easy difficulty", () => {
      const adjusted = adjustQuestOpponentForDifficulty(baseCreature, "easy");
      expect(adjusted.power).toBe("2");
      expect(adjusted.toughness).toBe("2");

      const weakCreature = { name: "Weakling", power: "1", toughness: "1", type: "Creature" } as any;
      const adjustedWeak = adjustQuestOpponentForDifficulty(weakCreature, "easy");
      expect(adjustedWeak.power).toBe("1");
      expect(adjustedWeak.toughness).toBe("1");
    });

    it("increases stats by +1/+1 for hard difficulty", () => {
      const adjusted = adjustQuestOpponentForDifficulty(baseCreature, "hard");
      expect(adjusted.power).toBe("4");
      expect(adjusted.toughness).toBe("4");
    });
  });

  describe("Defender Armies", () => {
    it("resolves land colors for Plain and Forest tiles", () => {
      expect(getTileLandColors("Plain L1")).toContain("white");
      expect(getTileLandColors("Forrest L2")).toContain("green");
    });

    it("identifies border tiles between Plain/Forest and Swamp/Mountain/Crypt/Forge biomes", () => {
      const mockMap: any[][] = [
        [{ col: 0, row: 0, tileId: "Swamp L1" }, { col: 0, row: 1, tileId: "Plain L1" }],
        [{ col: 1, row: 0, tileId: "Forrest L1" }, { col: 1, row: 1, tileId: "Grass" }]
      ];
      const plainBorderCell = mockMap[0][1];
      const grassInlandCell = mockMap[1][1];
      expect(isBorderTileBetweenBiomes(plainBorderCell, mockMap)).toBe(true);
      expect(isBorderTileBetweenBiomes(grassInlandCell, mockMap)).toBe(false);
    });

    it("generates defender army with combined power between 10 and 20", () => {
      const pool: any[] = [
        { id: "c1", name: "Elven Scout", type: "Creature", color: "green", power: "3", toughness: "3" },
        { id: "c2", name: "Centaur Warrior", type: "Creature", color: "green", power: "5", toughness: "4" }
      ];
      const result = generateDefenderArmyForTile(pool, ["Green"]);
      expect(result).not.toBeNull();
      const army = result!.questArmy;
      const totalPower = army.reduce((sum, c) => sum + parseInt(c.power || "0", 10), 0);
      expect(totalPower).toBeGreaterThanOrEqual(10);
      expect(result!.occupant.isDefenderArmy).toBe(true);
    });

    it("spawns defender armies at 100% on border Plain/Forest tiles, but skips Swamp/Mountain tiles", () => {
      expect(isPlainOrForestTile("Plain L1")).toBe(true);
      expect(isPlainOrForestTile("Forrest L2")).toBe(true);
      expect(isPlainOrForestTile("Swamp L1")).toBe(false);
      expect(isPlainOrForestTile("Mountain L2")).toBe(false);

      const mockMap: any[][] = [
        [{ col: 0, row: 0, ownerId: 0, tileId: "Tower of Power" }, { col: 0, row: 1, ownerId: null, tileId: "Plain L1" }],
        [{ col: 1, row: 0, ownerId: null, tileId: "Swamp L1" }, { col: 1, row: 1, ownerId: null, tileId: "Mountain L1" }]
      ];
      const pool: any[] = [
        { id: "c1", name: "Knight", type: "Creature", color: "white", power: "4", toughness: "4" }
      ];
      const { map } = checkAndSpawnDefenderArmiesOnMap(mockMap, pool, ["White", "Green"]);
      // Plain L1 (col 0, row 1) should spawn defender army
      expect(map[0][1].occupant).not.toBeNull();
      // Swamp L1 (col 1, row 0) should NOT spawn defender army
      expect(map[1][0].occupant).toBeUndefined();
    });

    it("works identically when player starts on the right side of the map", () => {
      const mockMapRight: any[][] = [
        [{ col: 0, row: 0, ownerId: 1, tileId: "Tower of Power" }, { col: 0, row: 1, ownerId: null, tileId: "Plain L1" }],
        [{ col: 1, row: 0, ownerId: null, tileId: "Plain L1" }, { col: 1, row: 1, ownerId: 0, tileId: "Wizards Tower L1" }]
      ];
      const pool: any[] = [
        { id: "c1", name: "Knight", type: "Creature", color: "white", power: "4", toughness: "4" }
      ];
      const { map } = checkAndSpawnDefenderArmiesOnMap(mockMapRight, pool, ["White", "Green"]);
      // Plain L1 adjacent to player at (col 1, row 1) is at (col 0, row 1)
      expect(map[0][1].occupant).not.toBeNull();
      expect((map[0][1].occupant as any).isDefenderArmy).toBe(true);
    });
  });
});

