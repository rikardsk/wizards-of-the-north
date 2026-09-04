import type { CardJSON, ActivatedAbility } from "../types/game";

export const cardNameMap: Record<string, string> = {
  "Skirk Prospector Goblin": "Skirk Prospector Goblin.png",
  "Ogre Sunderer": "Ogre Sunderer.png",
  "Magma Rifter Elemental": "Magma Rifter Elemental.png",
  "Hellkite Ancient Dragon": "Hellkite Ancient Dragon.png",
  "Field Sentry Human": "Field Sentry Human.png",
  "White Knight": "White Knight.png",
  "Leonin Sun-Stalker": "Leonin Sun-Stalker.png",
  "Archon of Grace": "Archon of Grace.png",
  "Leaf-Crowned Elf Scout": "Leaf-Crowned Elf Scout.png",
  "Rootwalla Lizard": "Rootwalla Lizard.png",
  "Heartwood Dryad": "Heartwood Dryad.png",
  "Sylvan Primordial": "Sylvan Primordial.png",
  "Festering Bog-Rot Human Zombie": "Festering Bog-Rot Human Zombie.jpg",
  "Carrion Crow Swarm": "Carrion Crow Swarm.png",
  "Fen Haunt Spirit": "Fen Haunt Spirit.png",
  "Litch King": "Litch King.png",
  "Wizard Lv1": "Wizard L1.jpg",
  "Wizard Lv2": "Wizard L2.jpg",
  "Wizard Lv3": "Wizard L3.jpg",
  "Wizard Lv4": "Wizard L4.jpg",
  "Wizard L1": "Wizard L1.jpg",
  "Wizard L2": "Wizard L2.jpg",
  "Wizard L3": "Wizard L3.jpg",
  "Wizard L4": "Wizard L4.jpg",
  "Balrog": "Balrog.jpg",
  "Nightmare": "Nightmare.jpg",
  "Forest Golem": "Forest Golem.jpg",
  "Stone Golem": "Stone Golem.jpg",
  "Clone": "Clone.jpg",
  "Counterspell": "Counterspell.jpg",
  "Counterspell Red": "Counterspell Red.jpg",
  "Counterspell White": "Counterspell White.jpg",
  "Counterspell Green": "Counterspell Green.jpg",
  "Counterspell Black": "Counterspell Black.jpg",
  "Create Land": "Create Land.jpg",
  "Destroy Land": "Destroy Land.jpg",
  "Downgrade Land": "Downgrade Land.jpg",
  "Fireball": "Fireball.jpg",
  "First Strike": "First Strike.jpg",
  "Lightning Strike": "Lightning Strike.jpg",
  "Mana Boost": "Mana Boost.jpg",
  "Mana Drain": "Mana Drain.jpg",
  "Trample": "Trample.jpg",
  "Upgrade Land": "Upgrade Land.jpg",
  "Vision": "Vision.jpg",
  "Tower Ability": "Tower Ability.png",
  "Wizard Ability": "Wizard Ability.png",
  "Tower L1 Ability": "Tower Ability.png",
  "Tower L2 Ability": "Tower Ability.png",
  "Tower L3 Ability": "Tower Ability.png",
  "Tower L4 Ability": "Tower Ability.png",
  "Wizard L1 Ability": "Wizard Ability.png",
  "Wizard L2 Ability": "Wizard Ability.png",
  "Wizard L3 Ability": "Wizard Ability.png",
  "Wizard L4 Ability": "Wizard Ability.png",
  "Tower of Terror Quest": "Tower of Terror Quest.png",
  "Dragons Lair Quest": "Dragons Lair Quest.jpg",
  "Tower of Power Quest": "Tower of Power Quest.jpg",
  "Wizards Tower L1": "Wizards Tower L1.jpg",
  "Wizards Tower L2": "Wizards Tower L2.jpg",
  "Wizards Tower L3": "Wizards Tower L3.jpg",
  "Wizards Tower L4": "Wizards Tower L4.jpg",
  "Achilles": "Achilles.jpg",
  "Keni Queen": "Keni Queen.jpg",
  "Manhunter": "Manhunter.jpg",
  "Rick Dragonslayer": "Rick Dragonslayer.jpg",
  "Roland": "Roland.jpg",
  "Two Heavens": "Two Heavens.jpg",
  "Fafnir": "Fafnir.jpg",
  "Frankensteins Monster": "Frankensteins Monster.jpg",
  "Frankenstein's Monster": "Frankensteins Monster.jpg",
  "Sol Ring": "Sol Ring.jpg",
  "Planar Portal": "Planar Portal.jpg",
  "Bracelet of strength": "Bracelet of strength.jpg",
  "Poisined dagger": "Poisined dagger.jpg",
  "Ring of power": "Ring of power.jpg",
  "Ringmail of protection": "Ringmail of protection.jpg",
  "Scepter of doom": "Scepter of doom.jpg",
  "Sword of glory": "Sword of glory.jpg",
  "Bracelet of Strength": "Bracelet of strength.jpg",
  "Poisined Dagger": "Poisined dagger.jpg",
  "Ring of Power": "Ring of power.jpg",
  "Ringmail of Protection": "Ringmail of protection.jpg",
  "Scepter of Doom": "Scepter of doom.jpg",
  "Sword of Glory": "Sword of glory.jpg",
};

export const oldFilesMap: Record<string, string> = {
  "Wizard creature L1.png": "Wizard L1.png",
  "Wizard creature L2.png": "Wizard L2.png",
  "Wizard creature L3.png": "Wizard L3.png",
  "Wizard creature L4.png": "Wizard L4.png",
  "Forrest creature L1.png": "Leaf-Crowned Elf Scout.png",
  "Forrest creature L2.png": "Rootwalla Lizard.png",
  "Forrest creature L3.png": "Heartwood Dryad.png",
  "Forrest creature L4.png": "Sylvan Primordial.png",
  "Swamp creature L1.png": "Festering Bog-Rot Human Zombie.png",
  "Swamp creature L2.png": "Carrion Crow Swarm.png",
  "Swamp creature L3.png": "Fen Haunt Spirit.png",
  "Swamp creature L4.png": "Litch King.png",
  "Mountain creature L1.png": "Skirk Prospector Goblin.png",
  "Mountain creature L2.png": "Ogre Sunderer.png",
  "Mountain creature L3.png": "Magma Rifter Elemental.png",
  "Mountain creature L4.png": "Balrog.png",
  "Plain creature L1.png": "Field Sentry Human.png",
  "Plain creature L2.png": "White Knight.png",
  "Plain creature L3.png": "Leonin Sun-Stalker.png",
  "Plain creature L4.png": "Archon of Grace.png"
};

const isExternalOrAbsolutePath = (path: string): boolean => {
  if (!path) return false;
  return (
    path.startsWith("/") ||
    path.startsWith("data:") ||
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:")
  );
};

const HERO_NAMES = [
  "achilles",
  "keni queen",
  "manhunter",
  "rick dragonslayer",
  "roland",
  "two heavens",
];

const LEGEND_NAMES = [
  "fafnir",
  "frankenstein",
  "frankensteins monster",
  "frankenstein's monster",
];

const isHero = (typeLower: string, nameLower: string, fileLower: string, subTypeLower: string): boolean => {
  if (typeLower.includes("hero") || subTypeLower.includes("hero")) return true;
  return HERO_NAMES.some((h) => nameLower.includes(h) || fileLower.includes(h));
};

const isLegend = (typeLower: string, nameLower: string, fileLower: string, subTypeLower: string): boolean => {
  if (typeLower.includes("legend") || subTypeLower.includes("legend")) return true;
  return LEGEND_NAMES.some((l) => nameLower.includes(l) || fileLower.includes(l));
};

export const getWizardLevelFromCard = (card: { name?: string; cardName?: string; type?: string; cardType?: string; cardSubType?: string; subType?: string } | null | undefined): number => {
  if (!card) return 1;
  const subTypeLower = (card.cardSubType || card.subType || "").toLowerCase();
  const subTypeMatch = subTypeLower.match(/level\s*(\d+)/i) || subTypeLower.match(/\bl(\d+)\b/i);
  if (subTypeMatch) return parseInt(subTypeMatch[1], 10);

  const nameLower = (card.name || card.cardName || "").toLowerCase();
  const nameMatch = nameLower.match(/wizard\s*l(\d+)/i) || nameLower.match(/wizard\s*lv(\d+)/i);
  if (nameMatch) return parseInt(nameMatch[1], 10);

  if (nameLower === "grand archmage") return 4;
  if (nameLower === "archmage adept") return 3;
  if (nameLower === "wizard mage") return 2;
  return 1;
};

export const getTowerLevelFromCard = (card: { name?: string; cardName?: string; type?: string; cardType?: string; cardSubType?: string; subType?: string; illustration?: string } | null | undefined): number => {
  if (!card) return 1;
  const subTypeLower = (card.cardSubType || card.subType || "").toLowerCase();
  const subTypeMatch = subTypeLower.match(/level\s*(\d+)/i) || subTypeLower.match(/\bl(\d+)\b/i);
  if (subTypeMatch) return parseInt(subTypeMatch[1], 10);

  const nameLower = (card.name || card.cardName || "").toLowerCase();
  const nameMatch = nameLower.match(/tower\s*l(\d+)/i) || nameLower.match(/tower\s*lv(\d+)/i);
  if (nameMatch) return parseInt(nameMatch[1], 10);

  const illLower = (card.illustration || "").toLowerCase();
  const illMatch = illLower.match(/wizards tower\s*l(\d+)/i) || illLower.match(/tower\s*l(\d+)/i);
  if (illMatch) return parseInt(illMatch[1], 10);

  return 1;
};

export const isWizardCard = (card: { name?: string; cardName?: string; type?: string; cardType?: string; cardSubType?: string; subType?: string } | null | undefined): boolean => {
  if (!card) return false;
  const nameLower = (card.name || card.cardName || "").toLowerCase();
  const typeLower = (card.type || card.cardType || "").toLowerCase();
  const subTypeLower = (card.cardSubType || card.subType || "").toLowerCase();
  if (nameLower.endsWith("ability") || typeLower.includes("ability") || subTypeLower.includes("ability")) return false;
  return (
    typeLower === "legendary wizard avatar" ||
    typeLower === "wizard" ||
    nameLower === "wizard" ||
    nameLower.startsWith("wizard l") ||
    nameLower.startsWith("wizard lv") ||
    nameLower === "wizard mage" ||
    nameLower === "archmage adept" ||
    nameLower === "grand archmage"
  );
};

export const isHeroCard = (card: { name?: string; cardName?: string; type?: string; cardType?: string; cardSubType?: string; subType?: string } | null | undefined): boolean => {
  if (!card) return false;
  const typeLower = (card.type || card.cardType || "").toLowerCase();
  const subTypeLower = (card.cardSubType || card.subType || "").toLowerCase();
  return (typeLower.includes("hero") || subTypeLower.includes("hero")) && !typeLower.includes("quest");
};

export const isArtifactCard = (card: { name?: string; cardName?: string; type?: string; cardType?: string; cardSubType?: string; subType?: string } | null | undefined): boolean => {
  if (!card) return false;
  const typeLower = (card.type || card.cardType || "").toLowerCase();
  const subTypeLower = (card.cardSubType || card.subType || "").toLowerCase();
  if (typeLower.includes("tower") || typeLower.includes("wizard") || isWizardCard(card)) {
    return false;
  }
  return typeLower.includes("artifact") || subTypeLower.includes("artifact");
};

export const isPortalCard = (card: { name?: string; cardName?: string; type?: string; cardType?: string; cardSubType?: string; subType?: string } | null | undefined): boolean => {
  if (!card) return false;
  const typeLower = (card.type || card.cardType || "").toLowerCase();
  const subTypeLower = (card.cardSubType || card.subType || "").toLowerCase();
  return typeLower.includes("portal") || subTypeLower.includes("portal");
};

export const isSpecialRewardExcludedCard = (card: CardJSON | null | undefined): boolean => {
  if (!card) return true;
  const nameLower = (card.name || (card as any).cardName || "").toLowerCase();
  if (nameLower.startsWith("card_")) return true;
  if (nameLower.endsWith("ability")) return true;
  if (nameLower === "ultimate victory") return true;
  if (isWizardCard(card)) return true;
  if (isQuestCard(card)) return true;
  if (isHeroCard(card)) return true;
  if (isArtifactCard(card)) return true;
  if (isPortalCard(card)) return true;
  return false;
};

export const isNoCostCreature = (card: CardJSON | null | undefined): boolean => {
  if (!card) return false;
  if (isSpecialRewardExcludedCard(card)) return false;
  const typeLower = (card.type || (card as any).cardType || "").toLowerCase();
  const subTypeLower = (card.cardSubType || (card as any).subType || "").toLowerCase();
  if (typeLower.includes("spell") || typeLower.includes("territory") || typeLower.includes("land")) {
    return false;
  }
  const isCreature = typeLower.includes("creature") || 
                     subTypeLower.includes("creature") || 
                     (card.power !== undefined && card.toughness !== undefined);
  if (!isCreature) return false;
  const mana = (card.manaCost || "").trim();
  return mana === "" || mana === "0" || mana === "{0}";
};

export const isQuestCard = (card?: { name?: string; type?: string; questData?: any } | null): boolean => {
  if (!card) return false;
  const nameLower = (card.name || "").toLowerCase();
  const typeLower = (card.type || "").toLowerCase();
  return typeLower.includes("quest") || nameLower.includes("quest") || !!card.questData;
};

export interface PlayerQuestProgress {
  totalQuests: number;
  completedQuests: number;
  remainingQuests: number;
  allCompleted: boolean;
}

export const getPlayerQuestProgress = (
  player: { hand?: CardJSON[]; deck?: CardJSON[]; graveyard?: CardJSON[] } | undefined | null
): PlayerQuestProgress => {
  if (!player) {
    return { totalQuests: 0, completedQuests: 0, remainingQuests: 0, allCompleted: false };
  }
  const allCards = [...(player.hand || []), ...(player.deck || []), ...(player.graveyard || [])];
  const questCards = allCards.filter(isQuestCard);
  const totalQuests = questCards.length;
  const completedQuests = questCards.filter(q => q.completed).length;
  const remainingQuests = questCards.filter(q => !q.completed).length;
  const allCompleted = totalQuests > 0 && remainingQuests === 0;

  return { totalQuests, completedQuests, remainingQuests, allCompleted };
};

export const isReviveSpell = (card: { name?: string; cardName?: string; type?: string; cardType?: string } | null | undefined): boolean => {
  if (!card) return false;
  const nameLower = (card.name || card.cardName || "").toLowerCase();
  return nameLower === "revive" || nameLower === "reincarnate" || nameLower === "reanimate";
};

export const isReanimateSpell = (card: { name?: string; cardName?: string; type?: string; cardType?: string } | null | undefined): boolean => {
  if (!card) return false;
  const nameLower = (card.name || card.cardName || "").toLowerCase();
  return nameLower === "reanimate";
};

const getTargetFolder = (
  typeLower: string,
  nameLower: string,
  fileLower: string,
  subTypeLower: string = ""
): "quests" | "abilities" | "spells" | "towers" | "heroes" | "legends" | "creatures" | "artifacts" | "portals" | "wizards" => {
  if (typeLower.includes("quest") || nameLower.includes("quest") || fileLower.includes("quest")) {
    return "quests";
  }
  if (typeLower.includes("ability") || nameLower.includes("ability") || fileLower.includes("ability")) {
    return "abilities";
  }
  if (typeLower === "tower" || nameLower.includes("wizards tower") || fileLower.includes("wizards tower")) {
    return "towers";
  }
  if (
    nameLower === "ultimate victory" ||
    fileLower === "victory.png" ||
    fileLower === "ultimate victory.png" ||
    typeLower === "wizard" ||
    typeLower === "legendary wizard avatar" ||
    nameLower === "wizard" ||
    nameLower.startsWith("wizard l") ||
    nameLower.startsWith("wizard lv") ||
    fileLower.startsWith("wizard l") ||
    fileLower.startsWith("wizard lv")
  ) {
    return "wizards";
  }
  if (typeLower.includes("artifact") || nameLower.includes("artifact") || fileLower.includes("artifact")) {
    return "artifacts";
  }
  if (typeLower.includes("portal") || nameLower.includes("portal") || fileLower.includes("portal") || nameLower.includes("sol ring") || fileLower.includes("sol ring")) {
    return "portals";
  }
  if (typeLower.includes("spell") || fileLower.includes("_art")) {
    return "spells";
  }
  if (isHero(typeLower, nameLower, fileLower, subTypeLower)) {
    return "heroes";
  }
  if (isLegend(typeLower, nameLower, fileLower, subTypeLower)) {
    return "legends";
  }
  return "creatures";
};

export function getAssetUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("data:") || path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const baseUrl = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : "/";
  return baseUrl.endsWith("/") ? `${baseUrl}${cleanPath}` : `${baseUrl}/${cleanPath}`;
}

export const resolveIllustrationPath = (type: string, rawIllusion: string, name?: string, subType?: string): string => {
  let file = rawIllusion || (name ? cardNameMap[name] : "") || "";
  const nameLower = (name || "").toLowerCase();
  const subTypeLower = (subType || "").toLowerCase();
  const typeLower = (type || "").toLowerCase();

  if (!file && nameLower === "wizard" && subTypeLower) {
    const match = subTypeLower.match(/level\s*(\d+)/i) || subTypeLower.match(/\bl(\d+)\b/i);
    if (match) {
      file = `Wizard L${match[1]}.jpg`;
    }
  }

  const isTower = typeLower === "tower" || nameLower.includes("wizards tower") || nameLower === "tower";
  if (isTower && subTypeLower) {
    const match = subTypeLower.match(/level\s*(\d+)/i) || subTypeLower.match(/\bl(\d+)\b/i);
    if (match) {
      file = `Wizards Tower L${match[1]}.jpg`;
    }
  }

  if (!file) return "";

  const fileLower = file.toLowerCase();

  // Override for Ultimate Victory
  if (nameLower === "ultimate victory" || fileLower === "victory.png" || fileLower === "ultimate victory.png") {
    file = "Ultimate Victory.png";
  }

  const isAbility = typeLower.includes("ability") || nameLower.includes("ability") || fileLower.includes("ability");
  const isQuest = typeLower.includes("quest") || nameLower.includes("quest") || fileLower.includes("quest");
  const isTowerCard = typeLower === "tower" || nameLower.includes("wizards tower") || fileLower.includes("wizards tower");

  const isTile = (!isAbility && !isQuest && !isTowerCard && (
    typeLower.includes("territory") ||
    typeLower.includes("land")
  )) || fileLower.includes("/assets/tiles/") || fileLower.includes("assets/tiles/");
  if (isTile) return getAssetUrl(file);

  if (oldFilesMap[file]) file = oldFilesMap[file];

  let filename = file;
  if (file.includes("/")) {
    filename = file.substring(file.lastIndexOf("/") + 1);
  }

  const targetFolder = getTargetFolder(typeLower, nameLower, fileLower, subTypeLower);

  if (isExternalOrAbsolutePath(file)) {
    if (file.includes("/assets/") || file.includes("assets/")) {
      if (nameLower.includes("ability") && (file.includes("assets/creatures/") || file.includes("assets/heroes/") || file.includes("assets/legends/"))) {
        return getAssetUrl(file);
      }
      const folder = isTowerCard ? "towers" : targetFolder;
      const isJpgTarget = isTowerCard || folder === "wizards" || folder === "creatures" || nameLower.includes("festering bog-rot human zombie") || fileLower.includes("festering bog-rot human zombie");
      const resolvedFilename = isJpgTarget && filename !== "Ultimate Victory.png"
        ? filename.replace(/\.png$/i, ".jpg")
        : filename;
      return getAssetUrl(`assets/${folder}/${resolvedFilename}`);
    }
    return file;
  }

  const isJpgTarget = isTowerCard || targetFolder === "wizards" || targetFolder === "creatures" || nameLower.includes("festering bog-rot human zombie") || fileLower.includes("festering bog-rot human zombie");
  const finalFilename = isJpgTarget && filename !== "Ultimate Victory.png"
    ? filename.replace(/\.png$/i, ".jpg")
    : filename;
  return getAssetUrl(`assets/${targetFolder}/${finalFilename}`);
};

export interface QuestLevelJSON {
  description?: string;
  questDescription?: string;
  rewardsDescription?: string;
  opponentsDescription?: string;
  rewardCards?: string[];
  unlockCards?: string[];
  cardRewardMode?: "preset" | "choice" | "random";
  cardRewardList?: string[];
  opponents?: string[];
  collapsed?: boolean;
  army?: { subType: string; power: number; questHp?: number; hp?: number };
  armySubTypes?: string[];
  armyPower?: number;
  armyQuestHp?: number;
  opponentsPower?: number;
  opponentsQuestHp?: number;
  OpponentsQuestHp?: number;
  OpponentsHp?: number;
  ArmyQuestHp?: number;
  ArmyHp?: number;
  questHp?: number;
  hp?: number;
  questHP?: number;
  armyHp?: number;
  opponentsHp?: number;
  keywordReward?: string;
  keywordRewards?: string[];
  keywordRewardMode?: "preset" | "choice" | "random";
  keywordRewardList?: string[];
  sections?: string[];
  keyword?: string;
  keywordAbility?: string;
  learnSpellMode?: "preset" | "choice" | "random";
  learnSpell?: string;
  learnSpells?: string[];
  learnSpellRandomSubType?: string;
  rewardCardRandomSubType?: string;
  rewardCardMode?: "preset" | "choice" | "random";
  companionRewardMode?: "preset" | "choice" | "random";
  companionReward?: string;
  companion?: string;
  companionRewardRandomSubType?: string;
  manaRewardMode?: "choice" | "all" | "player_choice" | "all_colors";
  manaRewardAmount?: number;
  manaAmount?: number;
  manaReward?: {
    mode?: "choice" | "all" | "player_choice" | "all_colors";
    amount?: number;
  } | string;
  xpReward?: number;
  xpAmount?: number;
  xp?: number;
  xpRewardAmount?: number;
  monsterUnlock?: boolean;
  monsterUnlockManaCost?: number | string;
  attributeReward?: { power?: number; toughness?: number };
  armyManaPool?: number;
  opponentsManaPool?: number;
  armySpells?: number;
  opponentsSpells?: number;
  [key: string]: any;
}

export interface QuestDataJSON {
  id?: string;
  cardId?: string;
  name: string;
  levels: QuestLevelJSON[];
}

export interface XpRewardInfo {
  baseXp: number;
  bonusXp: number;
  totalXp: number;
}

export const getXpRewardInfo = (levelObj?: QuestLevelJSON | null, levelIndex: number = 0): XpRewardInfo => {
  const baseXp = (levelIndex + 1) * 10;
  let bonusXp = 0;

  if (levelObj) {
    const rawXp = levelObj.xpReward ?? 
                  levelObj.xpAmount ?? 
                  levelObj.xp ?? 
                  levelObj.xpRewardAmount;

    if (typeof rawXp === "number" && !isNaN(rawXp) && rawXp > 0) {
      bonusXp = rawXp;
    } else if (typeof rawXp === "string") {
      const parsed = parseInt(rawXp, 10);
      if (!isNaN(parsed) && parsed > 0) bonusXp = parsed;
    }
  }

  return {
    baseXp,
    bonusXp,
    totalXp: baseXp + bonusXp
  };
};

export const getManaRewardInfo = (levelObj?: QuestLevelJSON | null) => {
  if (!levelObj) return null;
  let rawMode: string | undefined = levelObj.manaRewardMode;
  let rawAmount: number | undefined = levelObj.manaRewardAmount ?? levelObj.manaAmount;

  if (typeof levelObj.manaReward === "object" && levelObj.manaReward) {
    rawMode = rawMode || levelObj.manaReward.mode;
    rawAmount = rawAmount ?? levelObj.manaReward.amount;
  } else if (typeof levelObj.manaReward === "string") {
    rawMode = rawMode || levelObj.manaReward;
  } else if (typeof levelObj.manaReward === "number") {
    rawAmount = rawAmount ?? levelObj.manaReward;
    rawMode = rawMode || "choice";
  }

  if (!rawMode && (levelObj as any).sections?.includes("manaReward")) {
    rawMode = "choice";
  }

  if (!rawMode) return null;
  const modeLower = rawMode.toLowerCase();
  const isAll = modeLower.includes("all");
  const isChoice = modeLower.includes("choice");

  if (!isAll && !isChoice) return null;
  const amount = typeof rawAmount === "number" && rawAmount > 0 ? rawAmount : 1;

  return {
    mode: isAll ? ("all" as const) : ("choice" as const),
    amount
  };
};

export const getCompanionRawList = (levelObj: any): string[] => {
  if (!levelObj) return [];
  const candidates = [
    levelObj.companionRewards,
    levelObj.companionRewardList,
    levelObj.companionReward,
    levelObj.companionList,
    levelObj.companions,
    levelObj.companion
  ];
  for (const item of candidates) {
    if (Array.isArray(item)) {
      const filtered = item.map(x => String(x).trim()).filter(Boolean);
      if (filtered.length > 0) return filtered;
    } else if (typeof item === "string" && item.trim()) {
      return [item.trim()];
    }
  }
  return [];
};

export const getSpellRawList = (levelObj: any): string[] => {
  if (!levelObj) return [];
  const candidates = [
    levelObj.learnSpells,
    levelObj.learnSpellList,
    levelObj.learnSpell,
    levelObj.spellRewards,
    levelObj.spellReward,
    levelObj.spells
  ];
  for (const item of candidates) {
    if (Array.isArray(item)) {
      const filtered = item.map(x => String(x).trim()).filter(Boolean);
      if (filtered.length > 0) return filtered;
    } else if (typeof item === "string" && item.trim()) {
      return [item.trim()];
    }
  }
  return [];
};

export const getKeywordRawList = (levelObj: any): string[] => {
  if (!levelObj) return [];
  const candidates = [
    levelObj.keywordRewards,
    levelObj.keywordRewardList,
    levelObj.keywordReward,
    levelObj.keywordAbility,
    levelObj.keyword
  ];
  for (const item of candidates) {
    if (Array.isArray(item)) {
      const filtered = item.map(x => String(x).trim()).filter(Boolean);
      if (filtered.length > 0) return filtered;
    } else if (typeof item === "string" && item.trim()) {
      return [item.trim()];
    }
  }
  return [];
};

export const hasKeywordReward = (levelObj: QuestLevelJSON | undefined): boolean => {
  if (!levelObj) return false;
  if (levelObj.sections && levelObj.sections.includes("keywordReward")) return true;
  if (levelObj.keywordRewardMode) return true;
  return getKeywordRawList(levelObj).length > 0;
};

export const hasSpellReward = (levelObj?: QuestLevelJSON | null): boolean => {
  if (!levelObj) return false;
  if (levelObj.sections && (levelObj.sections.includes("learnSpell") || levelObj.sections.includes("spellReward"))) return true;
  if (levelObj.learnSpellMode || (levelObj as any).spellRewardMode) return true;
  return getSpellRawList(levelObj).length > 0;
};

export const hasCompanionReward = (levelObj?: QuestLevelJSON | null): boolean => {
  if (!levelObj) return false;
  if (levelObj.sections && levelObj.sections.includes("companionReward")) return true;
  if (levelObj.companionRewardMode || (levelObj as any).companionMode) return true;
  if (levelObj.companionRewardRandomSubType) return true;
  return getCompanionRawList(levelObj).length > 0;
};

export const getCardRewardRawList = (levelObj: any): string[] => {
  if (!levelObj) return [];
  const candidates = [
    levelObj.cardRewardList,
    levelObj.cardRewards,
    levelObj.rewardCards,
    levelObj.unlockCards,
    levelObj.cardReward,
    levelObj.rewardCard
  ];
  for (const item of candidates) {
    if (Array.isArray(item)) {
      const filtered = item.map(x => String(x).trim()).filter(Boolean);
      if (filtered.length > 0) return filtered;
    } else if (typeof item === "string" && item.trim()) {
      return [item.trim()];
    }
  }
  return [];
};

export const getCardRewardMode = (levelObj?: QuestLevelJSON | null): string => {
  if (!levelObj) return "";
  return (
    levelObj.cardRewardMode ||
    (levelObj as any).rewardCardMode ||
    (levelObj as any).cardMode ||
    ""
  ).toLowerCase();
};

export const hasCardReward = (levelObj?: QuestLevelJSON | null): boolean => {
  if (!levelObj) return false;
  if (getCardRewardMode(levelObj)) return true;
  if (getCardRewardRawList(levelObj).length > 0) return true;
  if (levelObj.sections && Array.isArray(levelObj.sections)) {
    const hasCardSection = levelObj.sections.some((s: string) =>
      ["cardReward", "rewardCards", "unlockCards", "card"].includes(s)
    );
    if (hasCardSection) return true;
  }
  if (levelObj.rewardsDescription) {
    const descLower = levelObj.rewardsDescription.toLowerCase();
    if (descLower.includes("card") || descLower.includes("nightmare") || descLower.includes("balrog")) {
      return true;
    }
  }
  return false;
};

export const hasMonsterUnlockReward = (levelObj?: QuestLevelJSON | null): boolean => {
  if (!levelObj) return false;
  if (levelObj.monsterUnlock === true) return true;
  if (levelObj.sections && Array.isArray(levelObj.sections) && levelObj.sections.includes("monsterUnlock")) return true;
  if (levelObj.monsterUnlockManaCost !== undefined && levelObj.monsterUnlockManaCost !== null) return true;
  if (levelObj.rewardsDescription) {
    const desc = levelObj.rewardsDescription.toLowerCase();
    if (desc.includes("unlock") && desc.includes("monster")) return true;
  }
  return false;
};

export const getMonsterUnlockManaCost = (levelObj?: QuestLevelJSON | null): string => {
  if (!levelObj) return "2";
  const cost = levelObj.monsterUnlockManaCost;
  if (cost !== undefined && cost !== null && String(cost).trim() !== "") {
    return String(cost).trim();
  }
  return "2";
};

export const getColoredManaForCard = (colorStr: string, count: number): string => {
  const c = (colorStr || "").toLowerCase();
  let symbol = "";
  if (c.includes("black") || c === "b") symbol = "B";
  else if (c.includes("green") || c === "g") symbol = "G";
  else if (c.includes("red") || c === "r") symbol = "R";
  else if (c.includes("white") || c === "w") symbol = "W";
  else if (c.includes("blue") || c === "u") symbol = "U";

  if (symbol && count > 0) {
    return symbol.repeat(count);
  }
  return String(count);
};

export const applyMonsterUnlockManaCost = (cards: CardJSON[], manaCost: string | number): CardJSON[] => {
  const rawCostStr = String(manaCost || "2").trim();
  const numericCount = parseInt(rawCostStr, 10);
  const isNumeric = !isNaN(numericCount) && numericCount > 0;

  if (!cards || cards.length === 0) return [];
  return cards.map(card => {
    const subType = (card.cardSubType || (card as any).subType || "").toLowerCase();
    const nameLower = (card.name || (card as any).cardName || "").toLowerCase();
    const isMonster = subType === "monster" || nameLower.includes("balrog") || nameLower.includes("nightmare") || nameLower.includes("golem");

    if (isMonster) {
      let finalCost = rawCostStr;
      if (isNumeric) {
        let cardColor = card.color || (card as any).frameStyle || "";
        if (!cardColor || cardColor === "gold" || cardColor === "colorless") {
          if (nameLower.includes("nightmare")) cardColor = "black";
          else if (nameLower.includes("forest golem")) cardColor = "green";
          else if (nameLower.includes("balrog")) cardColor = "red";
          else if (nameLower.includes("stone golem")) cardColor = "white";
        }
        finalCost = getColoredManaForCard(cardColor, numericCount);
      }
      return { ...card, cardSubType: "Monster", manaCost: finalCost };
    }
    return card;
  });
};

export const resolveKeywordGrantForLevel = (
  levelObj: QuestLevelJSON | undefined,
  currentWizardKeywords: string[] = []
): { keywordToGrant?: string; isChoice: boolean; isRandom: boolean } => {
  if (!levelObj || !hasKeywordReward(levelObj)) return { isChoice: false, isRandom: false };

  const mode = (levelObj.keywordRewardMode || "").toLowerCase();
  const rawList = getKeywordRawList(levelObj);
  const isChoice = mode === "choice" || rawList.length > 1;

  if (isChoice) {
    return { isChoice: true, isRandom: false };
  }

  const allKeywords = ["Flying", "First Strike", "Trample", "Regenerate", "Fear"];
  const currentLower = currentWizardKeywords.map(k => k.toLowerCase());
  const presetKw = rawList.length > 0 ? rawList[0] : undefined;
  const isRandom = mode === "random" || (!mode && levelObj.sections?.includes("keywordReward") && !presetKw);

  if (isRandom || !presetKw) {
    const unlearned = allKeywords.filter(k => !currentLower.includes(k.toLowerCase()));
    const pool = unlearned.length > 0 ? unlearned : allKeywords;
    const randomKw = pool[Math.floor(Math.random() * pool.length)];
    return { keywordToGrant: randomKw, isChoice: false, isRandom: true };
  }

  const trimmed = presetKw.trim();
  if (!currentLower.includes(trimmed.toLowerCase())) {
    return { keywordToGrant: trimmed, isChoice: false, isRandom: false };
  }
  const unlearned = allKeywords.filter(k => !currentLower.includes(k.toLowerCase()));
  if (unlearned.length > 0) {
    return { keywordToGrant: unlearned[0], isChoice: false, isRandom: false };
  }
  return { keywordToGrant: trimmed, isChoice: false, isRandom: false };
};

export const isBattleSpell = (card: CardJSON | null | undefined): boolean => {
  if (!card) return false;
  const typeStr = (card.type || (card as any).cardType || "").toLowerCase();
  if (!typeStr.includes("spell")) return false;

  const nameStr = (card.name || (card as any).cardName || "").toLowerCase();
  if (nameStr.startsWith("card_")) return false;
  if (nameStr.endsWith("ability")) return false;

  const subType = (card.cardSubType || "").toLowerCase();
  if (
    subType === "non-battle" ||
    subType === "nonbattle" ||
    subType === "map" ||
    subType === "land" ||
    subType === "enchantment" ||
    subType.includes("enchantment") ||
    subType.includes("non-battle")
  ) {
    return false;
  }

  const desc = ((card.customDescription || card.rulesText || "") as string).toLowerCase();
  if (
    desc.includes("territory") ||
    desc.includes("adjacent tile") ||
    desc.includes("mana pool") ||
    desc.includes("draw 2 cards") ||
    desc.includes("extra mana")
  ) {
    return false;
  }

  const nonBattleNames = [
    "destroy land",
    "create land",
    "upgrade land",
    "downgrade land",
    "claim land",
    "mana boost",
    "mana drain",
    "vision"
  ];
  if (nonBattleNames.some(nb => nameStr.includes(nb))) return false;

  return true;
};

export const isEnchantmentSpell = (card: CardJSON | null | undefined): boolean => {
  if (!card) return false;
  const subType = (card.cardSubType || "").toLowerCase();
  const typeStr = (card.type || (card as any).cardType || "").toLowerCase();
  const nameStr = (card.name || (card as any).cardName || "").toLowerCase();
  return subType.includes("enchantment") || typeStr.includes("enchantment") || nameStr.includes("enchantment");
};

export const isNonBattleSpell = (card: CardJSON | null | undefined): boolean => {
  if (!card) return false;
  const typeStr = (card.type || (card as any).cardType || "").toLowerCase();
  if (!typeStr.includes("spell")) return false;
  return !isBattleSpell(card);
};

export const resolveCardNameFromRef = (ref: string, cardPool: CardJSON[] = []): string => {
  if (!ref || typeof ref !== "string") return "";
  const trimmed = ref.trim();
  if (!trimmed) return "";

  const found = cardPool.find(c =>
    c.id === trimmed ||
    (c as any).cardId === trimmed ||
    c.name === trimmed ||
    (c.id && c.id.toLowerCase() === trimmed.toLowerCase()) ||
    ((c as any).cardId && String((c as any).cardId).toLowerCase() === trimmed.toLowerCase()) ||
    (c.name && c.name.toLowerCase() === trimmed.toLowerCase())
  );
  if (found) {
    if (found.name && !found.name.toLowerCase().startsWith("card_")) {
      return found.name;
    }
    if (found.customDescription && !found.customDescription.toLowerCase().startsWith("card_")) {
      return found.customDescription;
    }
    if (found.rulesText && !found.rulesText.toLowerCase().startsWith("card_")) {
      return found.rulesText;
    }
  }

  // Check known spell/companion ID fallbacks
  const knownSpellMap: Record<string, string> = {
    "card_1784504232346": "First Strike",
    "card_1784504384559": "Lightning Strike",
    "card_1784504524412": "Fireball",
    "card_1784506003132": "Clone",
    "card_1785768715146": "Disenchant",
    "card_1785768764508": "Strength",
    "card_1785768811757": "Fog",
    "card_1785957814891": "Heal",
    "card_1785957711575": "Fear",
    "card_1785957947231": "Regenerate",
    "card_1787057762927": "Guard Dog",
    "card_1787393804735": "Summon Demon",
    "card_1785768547724": "Freeze",
    "card_1784541679387": "Counterspell"
  };
  if (knownSpellMap[trimmed]) return knownSpellMap[trimmed];

  if (trimmed.toLowerCase().startsWith("card_")) {
    return "Not Found";
  }

  return trimmed || "Not Found";
};

export const resolveSpellGrantForLevel = (
  levelObj: QuestLevelJSON | undefined,
  currentWizardSpells: string[] = [],
  availableSpellCards: CardJSON[] = []
): { spellToGrant?: string; isChoice: boolean; isRandom: boolean } => {
  if (!levelObj || !hasSpellReward(levelObj)) return { isChoice: false, isRandom: false };

  const mode = (levelObj.learnSpellMode || (levelObj as any).spellRewardMode || "").toLowerCase();
  const rawList = getSpellRawList(levelObj);

  const isChoice = mode === "choice" || rawList.length > 1;
  if (isChoice) {
    return { isChoice: true, isRandom: false };
  }

  const rawPreset = rawList.length > 0 ? rawList[0] : undefined;
  const resolvedPreset = rawPreset ? resolveCardNameFromRef(rawPreset, availableSpellCards) : undefined;
  const isRandom = mode === "random" || (!mode && (levelObj.sections?.includes("learnSpell") || levelObj.sections?.includes("spellReward")) && !resolvedPreset);

  if (resolvedPreset && !resolvedPreset.toLowerCase().startsWith("card_") && mode !== "random") {
    return { spellToGrant: resolvedPreset, isChoice: false, isRandom: false };
  }

  if (isRandom || !resolvedPreset || resolvedPreset.toLowerCase().startsWith("card_")) {
    const subType = (
      levelObj.learnSpellRandomSubType ||
      (levelObj as any).spellRewardRandomSubType ||
      (levelObj as any).learnSpellSubType ||
      ""
    ).toLowerCase();

    let pool = availableSpellCards.filter(c => (c.type || "").toLowerCase().includes("spell"));
    if (subType) {
      const subTypePool = pool.filter(c => 
        (c.cardSubType || "").toLowerCase().includes(subType) ||
        (c.subType || "").toLowerCase().includes(subType) ||
        c.name.toLowerCase().includes(subType)
      );
      if (subTypePool.length > 0) pool = subTypePool;
    }
    if (pool.length === 0) {
      pool = availableSpellCards.filter(c => isBattleSpell(c));
    }
    if (pool.length === 0) {
      pool = [
        { id: "tmpl_fireball", name: "Fireball", type: "Spell", cardSubType: "battle" },
        { id: "tmpl_lightning", name: "Lightning Strike", type: "Spell", cardSubType: "battle" },
        { id: "tmpl_counterspell_red", name: "Counterspell Red", type: "Spell", cardSubType: "battle" },
        { id: "tmpl_counterspell_white", name: "Counterspell White", type: "Spell", cardSubType: "battle" },
        { id: "tmpl_counterspell_green", name: "Counterspell Green", type: "Spell", cardSubType: "battle" },
        { id: "tmpl_counterspell_black", name: "Counterspell Black", type: "Spell", cardSubType: "battle" },
        { id: "tmpl_clone", name: "Clone", type: "Spell", cardSubType: "battle" }
      ] as CardJSON[];
    }
    const currentLower = currentWizardSpells.map(s => s.toLowerCase());
    const unlearned = pool.filter(c => !currentLower.includes(c.name.toLowerCase()));
    const candidates = unlearned.length > 0 ? unlearned : pool;

    if (candidates.length > 0) {
      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      return { spellToGrant: picked.name, isChoice: false, isRandom: true };
    }
    return { isChoice: false, isRandom: true };
  }

  return { spellToGrant: resolvedPreset, isChoice: false, isRandom: false };
};

export const resolveCompanionGrantForLevel = (
  levelObj: QuestLevelJSON | undefined,
  currentWizardCompanions: string[] = [],
  availableCards: CardJSON[] = []
): { companionToGrant?: string; isChoice: boolean; isRandom: boolean } => {
  if (!levelObj || !hasCompanionReward(levelObj)) return { isChoice: false, isRandom: false };

  const mode = (levelObj.companionRewardMode || (levelObj as any).companionMode || "").toLowerCase();
  const rawList = getCompanionRawList(levelObj);

  const isChoice = mode === "choice" || rawList.length > 1;
  if (isChoice) {
    return { isChoice: true, isRandom: false };
  }

  const rawPreset = rawList.length > 0 ? rawList[0] : undefined;
  const resolvedPreset = typeof rawPreset === "string" ? resolveCardNameFromRef(rawPreset, availableCards) : undefined;
  const isRandom = mode === "random" || (!mode && levelObj.sections?.includes("companionReward") && !resolvedPreset);

  if (resolvedPreset && !resolvedPreset.toLowerCase().startsWith("card_") && mode !== "random") {
    return { companionToGrant: resolvedPreset, isChoice: false, isRandom: false };
  }

  if (isRandom || !resolvedPreset || resolvedPreset.toLowerCase().startsWith("card_")) {
    const subType = levelObj.companionRewardRandomSubType;
    const creaturePool = availableCards.filter(c => {
      if (!c.type.toLowerCase().includes("creature")) return false;
      if (c.type.toLowerCase().includes("wizard") || c.type.toLowerCase().includes("hero")) return false;
      if (c.name.toLowerCase().startsWith("card_")) return false;
      if (subType && !(c.cardSubType || "").toLowerCase().includes(subType.toLowerCase())) return false;
      return true;
    });

    const currentLower = currentWizardCompanions.map(comp => comp.toLowerCase());
    const unlearned = creaturePool.filter(c => !currentLower.includes(c.name.toLowerCase()));
    let candidates = unlearned.length > 0 ? unlearned : creaturePool;

    if (candidates.length === 0) {
      const defaultCompanions = [
        { id: "tmpl_balrog", name: "Balrog", type: "Creature", cardSubType: "Monster" },
        { id: "tmpl_nightmare", name: "Nightmare", type: "Creature", cardSubType: "Monster" },
        { id: "tmpl_forest_golem", name: "Forest Golem", type: "Creature", cardSubType: "Monster" },
        { id: "tmpl_stone_golem", name: "Stone Golem", type: "Creature", cardSubType: "Monster" }
      ];
      let pool = defaultCompanions;
      if (subType) {
        const subPool = pool.filter(c => c.cardSubType.toLowerCase().includes(subType.toLowerCase()) || c.name.toLowerCase().includes(subType.toLowerCase()));
        if (subPool.length > 0) pool = subPool;
      }
      const unlearnedDef = pool.filter(c => !currentLower.includes(c.name.toLowerCase()));
      candidates = (unlearnedDef.length > 0 ? unlearnedDef : pool) as any;
    }

    if (candidates.length > 0) {
      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      return { companionToGrant: picked.name, isChoice: false, isRandom: true };
    }
    return { isChoice: false, isRandom: true };
  }

  return { companionToGrant: resolvedPreset, isChoice: false, isRandom: false };
};

export const resolveCardGrantForLevel = (
  levelObj: QuestLevelJSON | undefined,
  cardPool: CardJSON[] = []
): { cardToGrant?: CardJSON; cardsToGrant?: CardJSON[]; isChoice: boolean; isRandom: boolean; choiceOptions?: CardJSON[] } => {
  if (!levelObj || !hasCardReward(levelObj)) return { isChoice: false, isRandom: false };

  const mode = getCardRewardMode(levelObj);
  const rawList = getCardRewardRawList(levelObj);

  const isChoice = mode === "choice";
  if (isChoice) {
    let choiceOptions: CardJSON[] = [];
    if (rawList.length >= 2) {
      choiceOptions = rawList
        .map(ref => resolveOpponentCard(ref, cardPool))
        .filter((c): c is CardJSON => Boolean(c) && !c.name.toLowerCase().startsWith("card_"));
    }
    if (choiceOptions.length < 3) {
      const subType = (
        levelObj.rewardCardRandomSubType ||
        (levelObj as any).cardRewardRandomSubType ||
        (levelObj as any).rewardCardSubType ||
        (levelObj as any).rewardCardRandomCategory ||
        ""
      ).toLowerCase();

      let remainingPool = cardPool.filter(c => !isSpecialRewardExcludedCard(c));

      if (subType) {
        const filteredBySubType = remainingPool.filter(c => 
          (c.cardSubType || "").toLowerCase().includes(subType) ||
          (c.type || "").toLowerCase().includes(subType) ||
          (c.name || "").toLowerCase().includes(subType)
        );
        if (filteredBySubType.length > 0) {
          remainingPool = filteredBySubType;
        }
      }

      const existingNames = choiceOptions.map(o => o.name.toLowerCase());
      const available = remainingPool.filter(c => !existingNames.includes(c.name.toLowerCase()));
      const shuffled = [...available].sort(() => 0.5 - Math.random());
      choiceOptions = [...choiceOptions, ...shuffled].slice(0, 3);
    }
    return { isChoice: true, isRandom: false, choiceOptions };
  }

  const isRandom = mode === "random" || (!mode && rawList.length === 0 && (levelObj.sections?.includes("cardReward") || levelObj.sections?.includes("rewardCards")));

  if (isRandom) {
    const subType = (
      levelObj.rewardCardRandomSubType ||
      (levelObj as any).cardRewardRandomSubType ||
      (levelObj as any).rewardCardSubType ||
      (levelObj as any).rewardCardRandomCategory ||
      ""
    ).toLowerCase();

    let pool = cardPool.filter(c => !isSpecialRewardExcludedCard(c));

    if (subType) {
      const filteredBySubType = pool.filter(c => 
        (c.cardSubType || "").toLowerCase().includes(subType) ||
        (c.type || "").toLowerCase().includes(subType)
      );
      if (filteredBySubType.length > 0) {
        pool = filteredBySubType;
      }
    }

    if (pool.length > 0) {
      const randomCard = pool[Math.floor(Math.random() * pool.length)];
      const copy = JSON.parse(JSON.stringify(randomCard));
      copy.id = `quest_reward_${Date.now()}_${Math.random()}`;
      return { cardToGrant: copy, cardsToGrant: [copy], isChoice: false, isRandom: true };
    }
  }

  if (rawList.length > 0) {
    const cardsToGrant: CardJSON[] = [];
    rawList.forEach((rawPreset, idx) => {
      let foundCard: CardJSON | null = resolveOpponentCard(rawPreset, cardPool);
      if (!foundCard && levelObj.rewardsDescription) {
        const descLower = levelObj.rewardsDescription.toLowerCase();
        if (descLower.includes("nightmare")) {
          foundCard = resolveOpponentCard("card_1784467664393", cardPool);
        } else if (descLower.includes("balrog")) {
          foundCard = resolveOpponentCard("card_1784467369547", cardPool);
        }
      }

      if (foundCard && !foundCard.name.toLowerCase().startsWith("card_")) {
        const copy = JSON.parse(JSON.stringify(foundCard));
        copy.id = `quest_reward_${Date.now()}_${idx}_${Math.random()}`;
        cardsToGrant.push(copy);
      }
    });

    if (cardsToGrant.length > 0) {
      return {
        cardToGrant: cardsToGrant[0],
        cardsToGrant,
        isChoice: false,
        isRandom: false
      };
    }
  }

  return { isChoice: false, isRandom: false };
};

export const buildQuestTextFromLevel = (level: QuestLevelJSON, cardPool: CardJSON[] = []): string => {
  const parts: string[] = [];
  const mainDesc = level.questDescription || level.description;
  if (mainDesc) {
    parts.push(`Quest: ${mainDesc}`);
  }

  const rewardParts: string[] = [];

  const attr = level.attributeReward || (level as any).attribute;
  if (attr && (attr.power || attr.toughness)) {
    const p = attr.power || 0;
    const t = attr.toughness || 0;
    const signP = p >= 0 ? `+${p}` : `${p}`;
    const signT = t >= 0 ? `+${t}` : `${t}`;
    rewardParts.push(`${signP}/${signT} attribute reward`);
  }

  if (hasKeywordReward(level)) {
    const grant = resolveKeywordGrantForLevel(level);
    if (grant.isChoice) {
      rewardParts.push("Keyword: Any");
    } else if (grant.isRandom || level.keywordRewardMode === "random") {
      rewardParts.push("Wizard gains 1 Random Keyword Ability");
    } else if (grant.keywordToGrant) {
      rewardParts.push(`Wizard gains ${grant.keywordToGrant}`);
    }
  }

  if (hasSpellReward(level)) {
    const grant = resolveSpellGrantForLevel(level, [], cardPool);
    if (grant.isChoice) {
      rewardParts.push("1 Spell Ability Choice");
    } else if (grant.isRandom || level.learnSpellMode === "random") {
      rewardParts.push("1 Random Spell Ability");
    } else if (grant.spellToGrant) {
      rewardParts.push(`Spell: ${grant.spellToGrant}`);
    }
  }

  if (hasCompanionReward(level)) {
    const grant = resolveCompanionGrantForLevel(level, [], cardPool);
    if (grant.isChoice) {
      rewardParts.push("1 Companion Choice");
    } else if (grant.isRandom || level.companionRewardMode === "random") {
      const subType = level.companionRewardRandomSubType;
      rewardParts.push(subType ? `Companion: ${subType}` : "Companion: Random");
    } else if (grant.companionToGrant) {
      rewardParts.push(`Companion: ${grant.companionToGrant}`);
    }
  }

  if (hasCardReward(level) && !hasSpellReward(level) && !hasCompanionReward(level)) {
    const mode = getCardRewardMode(level);
    if (mode === "choice") {
      const subType = level.rewardCardRandomSubType || (level as any).cardRewardRandomSubType || (level as any).rewardCardSubType || (level as any).rewardCardRandomCategory;
      rewardParts.push(subType ? `Card: ${subType}` : "Card: Choice");
    } else if (mode === "random") {
      const subType = level.rewardCardRandomSubType || (level as any).cardRewardRandomSubType || (level as any).rewardCardSubType || (level as any).rewardCardRandomCategory;
      rewardParts.push(subType ? `Card: ${subType}` : "Card: Random");
    } else {
      const grant = resolveCardGrantForLevel(level, cardPool);
      if (grant.cardToGrant) {
        rewardParts.push(`${grant.cardToGrant.name} Card`);
      }
    }
  }

  const manaInfo = getManaRewardInfo(level);
  if (manaInfo && !level.rewardsDescription?.toLowerCase().includes("mana")) {
    rewardParts.push(`+${manaInfo.amount} Mana (${manaInfo.mode === "all" ? "All Colors" : "Player Choice"})`);
  }

  const xpInfo = getXpRewardInfo(level);
  if (xpInfo.bonusXp > 0 && !level.rewardsDescription?.toLowerCase().includes("xp")) {
    rewardParts.push(`+${xpInfo.bonusXp} Bonus XP`);
  }

  if (hasMonsterUnlockReward(level) && !level.rewardsDescription?.toLowerCase().includes("unlock")) {
    rewardParts.push(`Unlock Monsters`);
  }

  const rewardExtra = rewardParts.join(", ");
  if (rewardExtra) {
    if (level.rewardsDescription) {
      parts.push(`Reward: ${level.rewardsDescription}, ${rewardExtra}`);
    } else {
      parts.push(`Reward: ${rewardExtra}`);
    }
  } else if (level.rewardsDescription) {
    parts.push(`Reward: ${level.rewardsDescription}`);
  }
  if (level.opponentsDescription) {
    parts.push(`Opponents: ${level.opponentsDescription}`);
  } else {
    let subType = "";
    let limit = 0;
    if (level.army) {
      subType = level.army.subType;
      limit = level.army.power;
    } else if (level.armySubTypes && level.armySubTypes.length > 0) {
      subType = level.armySubTypes[0];
      limit = level.armyPower || 0;
    }
    if (subType) {
      parts.push(`Opponents: Random ${subType}s (Max Power: ${limit})`);
    }
  }
  return parts.join("\n\n");
};

export interface StructuredRewardItem {
  type: "card" | "keyword" | "spell" | "companion" | "mana" | "xp" | "unlock" | "attribute" | "custom";
  title: string;
  description?: string;
  icon: string;
  color: string;
  card?: CardJSON;
  cards?: CardJSON[];
  rewardMode?: "preset" | "choice" | "random" | "all";
  modeIcon?: string;
}

const extractCardRewards = (level: QuestLevelJSON, cardPool: CardJSON[]): StructuredRewardItem[] => {
  if (!hasCardReward(level)) return [];
  const mode = getCardRewardMode(level);
  
  if (mode === "choice") {
    const subType = level.rewardCardRandomSubType || (level as any).cardRewardRandomSubType || (level as any).rewardCardSubType || (level as any).rewardCardRandomCategory;
    return [{
      type: "card",
      title: subType ? `Card: ${subType}` : "Card Choice",
      description: subType ? `Choose 1 ${subType} Card for your hand` : "Choose 1 Card Reward for your hand",
      icon: "fa-clone",
      color: "#38bdf8",
      rewardMode: "choice",
      modeIcon: "fa-list-check"
    }];
  }
  if (mode === "random") {
    const subType = level.rewardCardRandomSubType || (level as any).cardRewardRandomSubType || (level as any).rewardCardSubType || (level as any).rewardCardRandomCategory;
    return [{
      type: "card",
      title: subType ? `Card: ${subType}` : "Card: Random",
      description: subType ? `Gain 1 Random ${subType} Card` : "Random card added to your hand",
      icon: "fa-box-open",
      color: "#38bdf8",
      rewardMode: "random",
      modeIcon: "fa-dice"
    }];
  }

  const rawList = getCardRewardRawList(level);
  if (rawList.length > 0) {
    const resolvedCards = rawList
      .map((ref) => resolveOpponentCard(ref, cardPool))
      .filter((c): c is CardJSON => Boolean(c) && !c.name.toLowerCase().startsWith("card_"));
    if (resolvedCards.length > 0) {
      return resolvedCards.map((c) => ({
        type: "card",
        title: `Card: ${c.name}`,
        description: c.rulesText || c.name,
        icon: "fa-box-open",
        color: "#38bdf8",
        cards: [c],
        card: c,
        rewardMode: "preset",
        modeIcon: "fa-bookmark"
      }));
    }
  }

  const grant = resolveCardGrantForLevel(level, cardPool);
  if (grant.cardsToGrant && grant.cardsToGrant.length > 0) {
    return grant.cardsToGrant.map((c) => ({
      type: "card",
      title: `Card: ${c.name}`,
      description: c.rulesText || c.name,
      icon: "fa-box-open",
      color: "#38bdf8",
      cards: [c],
      card: c,
      rewardMode: "preset",
      modeIcon: "fa-bookmark"
    }));
  }

  return [];
};

const extractKeywordReward = (level: QuestLevelJSON): StructuredRewardItem | null => {
  if (!hasKeywordReward(level)) return null;
  const grant = resolveKeywordGrantForLevel(level);
  if (grant.isChoice) {
    return { type: "keyword", title: "Keyword: Any", description: "Choose 1 Keyword Ability for Wizard", icon: "fa-shield-halved", color: "#facc15", rewardMode: "choice", modeIcon: "fa-list-check" };
  }
  if (grant.isRandom || level.keywordRewardMode === "random") {
    return { type: "keyword", title: "Random Keyword", description: "Wizard gains 1 Random Keyword Ability", icon: "fa-shield-halved", color: "#facc15", rewardMode: "random", modeIcon: "fa-dice" };
  }
  if (grant.keywordToGrant) {
    return { type: "keyword", title: `Keyword: ${grant.keywordToGrant}`, description: `Wizard gains ${grant.keywordToGrant}`, icon: "fa-shield-halved", color: "#facc15", rewardMode: "preset", modeIcon: "fa-bookmark" };
  }
  return null;
};

const extractSpellReward = (level: QuestLevelJSON, cardPool: CardJSON[]): StructuredRewardItem | null => {
  if (!hasSpellReward(level)) return null;
  const grant = resolveSpellGrantForLevel(level, [], cardPool);
  const subType = level.learnSpellRandomSubType || (level as any).spellRewardRandomSubType || (level as any).learnSpellSubType;
  if (grant.isChoice) {
    return { type: "spell", title: subType ? `Spell: ${subType}` : "Spell Choice", description: subType ? `Choose 1 ${subType} Spell Ability for Wizard` : "Choose 1 Spell Ability for Wizard", icon: "fa-wand-magic-sparkles", color: "#c084fc", rewardMode: "choice", modeIcon: "fa-list-check" };
  }
  if (grant.isRandom || level.learnSpellMode === "random") {
    return { type: "spell", title: subType ? `Spell: ${subType}` : "Random Spell", description: subType ? `Learn 1 Random ${subType} Spell Ability` : "Learn 1 Random Spell Ability", icon: "fa-wand-magic-sparkles", color: "#c084fc", rewardMode: "random", modeIcon: "fa-dice" };
  }
  if (grant.spellToGrant) {
    return { type: "spell", title: grant.spellToGrant, description: `Learn ${grant.spellToGrant} Spell`, icon: "fa-wand-magic-sparkles", color: "#c084fc", rewardMode: "preset", modeIcon: "fa-bookmark" };
  }
  return null;
};

const extractCompanionReward = (level: QuestLevelJSON, cardPool: CardJSON[]): StructuredRewardItem | null => {
  if (!hasCompanionReward(level)) return null;
  const grant = resolveCompanionGrantForLevel(level, [], cardPool);
  if (grant.isChoice) {
    return { type: "companion", title: "Companion Choice", description: "Choose 1 Companion creature", icon: "fa-user-group", color: "#4ade80", rewardMode: "choice", modeIcon: "fa-list-check" };
  }
  if (grant.isRandom || level.companionRewardMode === "random") {
    const subType = level.companionRewardRandomSubType;
    return { type: "companion", title: subType ? `Companion: ${subType}` : "Companion: Random", description: `Gain 1 Random ${subType || "Creature"} Companion`, icon: "fa-user-group", color: "#4ade80", rewardMode: "random", modeIcon: "fa-dice" };
  }
  if (grant.companionToGrant) {
    return { type: "companion", title: `Companion: ${grant.companionToGrant}`, description: `Gain ${grant.companionToGrant} Companion`, icon: "fa-user-group", color: "#4ade80", rewardMode: "preset", modeIcon: "fa-bookmark" };
  }
  return null;
};

const extractStatRewards = (level: QuestLevelJSON, levelIndex: number): StructuredRewardItem[] => {
  const items: StructuredRewardItem[] = [];
  const manaInfo = getManaRewardInfo(level);
  if (manaInfo) {
    const isAll = manaInfo.mode === "all";
    items.push({
      type: "mana",
      title: `+${manaInfo.amount} Mana Pool`,
      description: isAll ? "All colors" : "Player choice of color",
      icon: "fa-bolt",
      color: "#fb923c",
      rewardMode: isAll ? "all" : "choice",
      modeIcon: isAll ? "fa-layer-group" : "fa-list-check"
    });
  }
  const attr = level.attributeReward || (level as any).attribute;
  if (attr && (attr.power || attr.toughness)) {
    const p = attr.power || 0;
    const t = attr.toughness || 0;
    const signP = p >= 0 ? `+${p}` : `${p}`;
    const signT = t >= 0 ? `+${t}` : `${t}`;
    items.push({ type: "attribute", title: `Buff ${signP}/${signT}`, description: `Permanent ${signP}/${signT} power & toughness buff to Wizard`, icon: "fa-dumbbell", color: "#f43f5e" });
  }
  if (hasMonsterUnlockReward(level)) {
    items.push({ type: "unlock", title: "Unlock Monsters", description: "Unlocks all monsters for summoning", icon: "fa-lock-open", color: "#e879f9" });
  }
  const xpInfo = getXpRewardInfo(level, levelIndex);
  items.push({ type: "xp", title: `+${xpInfo.totalXp} XP`, description: xpInfo.bonusXp > 0 ? `(${xpInfo.baseXp} Base XP + ${xpInfo.bonusXp} Bonus XP)` : `(${xpInfo.baseXp} Base XP)`, icon: "fa-star", color: "#facc15" });
  return items;
};

export const getStructuredRewardsForLevel = (
  level: QuestLevelJSON,
  levelIndex: number,
  cardPool: CardJSON[] = []
): StructuredRewardItem[] => {
  const items: StructuredRewardItem[] = [];
  items.push(...extractCardRewards(level, cardPool));
  const kw = extractKeywordReward(level);
  if (kw) items.push(kw);
  const spell = extractSpellReward(level, cardPool);
  if (spell) items.push(spell);
  const companion = extractCompanionReward(level, cardPool);
  if (companion) items.push(companion);
  items.push(...extractStatRewards(level, levelIndex));
  return items;
};

export const getQuestInitialHp = (card?: CardJSON | null, levelIdx: number = 0): number => {
  if (!card) return 10;
  const isTowerOfTerror = card.name.toLowerCase().includes("tower of terror");
  const qData = card.questData || (isTowerOfTerror ? defaultTowerOfTerrorQuestData : undefined);
  const levelObj = qData?.levels?.[levelIdx] || qData?.levels?.[0];
  const rawHp = (levelObj as any)?.opponentsQuestHp ??
                (levelObj as any)?.OpponentsQuestHp ??
                (levelObj as any)?.armyQuestHp ??
                (levelObj as any)?.ArmyQuestHp ??
                (levelObj as any)?.opponentsHp ??
                (levelObj as any)?.OpponentsHp ??
                (levelObj as any)?.armyHp ??
                (levelObj as any)?.ArmyHp ??
                (levelObj as any)?.questHp ??
                (levelObj as any)?.questHP ??
                (levelObj as any)?.hp ??
                (levelObj as any)?.army?.questHp ??
                (levelObj as any)?.army?.hp ??
                (levelObj as any)?.opponents?.questHp ??
                (qData as any)?.questHp ??
                (qData as any)?.hp ??
                (card as any)?.questHp ??
                (card as any)?.hp ??
                10;
  const numHp = typeof rawHp === "number" ? rawHp : parseInt(String(rawHp), 10);
  return !isNaN(numHp) && numHp > 0 ? numHp : 10;
};

export const defaultTowerOfTerrorQuestData: QuestDataJSON = {
  id: "default_tower_of_terror_quest",
  cardId: "default_tower_of_terror_quest",
  name: "Tower of Terror Quest",
  levels: [
    {
      sections: ["questDesc", "rewardCards"],
      description: "Visit the ancient ruins of the Tower of Terror (the old mage tower) to learn about the dark arts.",
      questDescription: "Visit the ancient ruins of the Tower of Terror (the old mage tower) to learn about the dark arts.",
      rewardsDescription: "Receive a monster card.",
      opponentsDescription: "",
      rewardCardMode: "preset",
      rewardCards: ["card_1784467664393"],
      unlockCards: [],
      opponents: []
    },
    {
      sections: ["questDesc", "rewardCards", "monsterUnlock", "opponents"],
      description: "Defeat the necromancer and the faul monsters he has summoned.",
      questDescription: "Defeat the necromancer and the faul monsters he has summoned.",
      rewardsDescription: "Unlock all the monsters.",
      opponentsDescription: "Necromancer and his minions.",
      rewardCardMode: "preset",
      rewardCards: ["card_1784467862209"],
      unlockCards: [
        "card_1784467369547",
        "card_1784467664393",
        "card_1784467862209",
        "card_1784468455314"
      ],
      monsterUnlock: true,
      monsterUnlockManaCost: 2,
      opponents: [
        "card_1785165293355",
        "card_1784467369547",
        "card_1784467664393"
      ],
      opponentsPower: 6,
      opponentsManaPool: 6,
      opponentsSpells: 2
    },
    {
      sections: ["questDesc", "rewardCards", "army"],
      description: "Killing that necromancer has released somthing that doesn't belong in our dimension.",
      questDescription: "Killing that necromancer has released somthing that doesn't belong in our dimension.",
      rewardCardMode: "preset",
      rewardCards: ["card_1786532973999"],
      armySubTypes: ["Demon"],
      armyPower: 15,
      armyQuestHp: 15
    },
    {
      sections: ["questDesc", "learnSpell", "army"],
      description: "When you thought you had defeated all the vile deamons even more appears.",
      questDescription: "When you thought you had defeated all the vile deamons even more appears.",
      learnSpellMode: "random",
      learnSpellRandomSubType: "Battle",
      armySubTypes: ["Demon"],
      armyPower: 20,
      armyQuestHp: 20
    },
    {
      sections: ["questDesc", "attributeReward", "companionReward", "opponents"],
      description: "You have to find the portal to the other dimension and close it before it's too late.",
      questDescription: "You have to find the portal to the other dimension and close it before it's too late.",
      opponents: [
        "card_1786194843860",
        "card_1786195038715",
        "card_1786195059267",
        "card_1786194931971",
        "card_1786194762283",
        "card_1786194986995",
        "card_1786194707980",
        "card_1786194986995",
        "card_1786194986995"
      ],
      companionRewardMode: "random",
      companionRewardRandomSubType: "Monster",
      rewardsDescription: "You find the portal to the demonic plane and manage to close it.",
      opponentsPower: 24,
      opponentsQuestHp: 25,
      attributeReward: {
        power: 2,
        toughness: 2
      }
    }
  ]
};

export const knownCardIdMap: Record<string, string> = {
  "card_1782853578674": "Skirk Prospector Goblin",
  "card_1782853757084": "Ogre Sunderer",
  "card_1782853898447": "Magma Rifter Elemental",
  "card_1782853990159": "Hellkite Ancient Dragon",
  "card_1782854293097": "Field Sentry Human",
  "card_1782897244143": "White Knight",
  "card_1782897576632": "Leonin Sun-Stalker",
  "card_1782898399216": "Archon of Grace",
  "card_1782898613530": "Leaf-Crowned Elf Scout",
  "card_1782900241150": "Rootwalla Lizard",
  "card_1782900831688": "Heartwood Dryad",
  "card_1782900996864": "Sylvan Primordial",
  "card_1782901767744": "Festering Bog-Rot Human Zombie",
  "card_1782901879915": "Carrion Crow Swarm",
  "card_1782902069422": "Fen Haunt Spirit",
  "card_1782902146891": "Litch King",
  "card_1784467369547": "Balrog",
  "card_1784467664393": "Nightmare",
  "card_1784467862209": "Forest Golem",
  "card_1784468455314": "Stone Golem",
  "card_1784468209": "Stone Golem",
  "card_1785063998339": "Abyssal Walker",
  "card_1785064215492": "Bone Dragon",
  "card_1785064406277": "Skeleton Archers",
  "card_1785064509658": "Skeleton Unit",
  "card_1785065432536": "Skeleton Warriors",
  "card_1785065573787": "Undead King",
  "card_1785065625887": "Undead Knight",
  "card_1785078021817": "Goblin King",
  "card_1785078265385": "Goblin Berserker",
  "card_1785078401809": "Goblin Warrior",
  "card_1785078554263": "Goblin Spearman",
  "card_1785078626401": "Goblin Greandier",
  "card_1785078712770": "Goblin Wolfrider",
  "card_1785164625358": "Archmage",
  "card_1785164783475": "Grandmaster Mage",
  "card_1785164975702": "Battle Mage",
  "card_1785165079673": "Fireball Archmage",
  "card_1785165194773": "Lightning Archmage",
  "card_1785165293355": "Necromancer",
  "card_1785166958441": "Medusa",
  "card_1785167079925": "Cyclops",
  "card_1785167146985": "Harpy",
  "card_1785167218717": "Minotaur",
  "card_1785167295970": "Manticore",
  "card_1785167414870": "Hydra",
  "card_1785167618937": "Obsidian Grand Wyrm",
  "card_1785167714105": "Bearded Dragon",
  "card_1785167813914": "Frost Hydra",
  "card_1785167944020": "Wyvern",
  "card_1785168087939": "Dragon Whelp",
  "card_1785168153526": "Fire Dragon",
  "card_1785757758773": "Fafnir",
  "card_1785758328916": "Frankensteins Monster",
  "card_1785760313167": "Achilles",
  "card_1785760401710": "Keni Queen",
  "card_1785760465995": "Manhunter",
  "card_1785760531046": "Rick Dragonslayer",
  "card_1785760678681": "Roland",
  "card_1785760862615": "Two Heavens",
  "card_1785768547724": "Freeze",
  "card_1785768641323": "Flying",
  "card_1785768715146": "Disenchant",
  "card_1785768764508": "Strength",
  "card_1785768811757": "Fog",
  "card_1785957711575": "Fear",
  "card_1785957814891": "Heal",
  "card_1785957902142": "Poison",
  "card_1785957947231": "Regenerate",
  "card_1785957993479": "Web",
  "card_1785961024566": "Troll",
  "card_1785961146509": "Mummy",
  "card_1785961209541": "Vampire",
  "card_1785961277257": "Werewulf",
  "card_1786015866699": "Spartacus",
  "card_1786015964738": "Murmillo",
  "card_1786016016582": "Retiarius",
  "card_1786017197580": "Secutor",
  "card_1786110500192": "Bracelet of strength",
  "card_1786110635264": "Poisoned dagger",
  "card_1786110699552": "Ring of power",
  "card_1786110789724": "Ringmail of protection",
  "card_1786110876985": "Scepter of doom",
  "card_1786110962742": "Sword of glory",
  "card_1786114010950": "Planar Portal",
  "card_1786114110227": "Sol Ring",
  "card_1786194707980": "Succubus",
  "card_1786194762283": "Soul reaper",
  "card_1786194843860": "Mammon",
  "card_1786194901459": "Lucifer",
  "card_1786194931971": "Leviathan",
  "card_1786194986995": "Lesser deamon",
  "card_1786195038715": "Flesh spawn",
  "card_1786195059267": "Demonic swarm",
  "card_1786195110401": "Belzebub",
  "card_1786195435887": "Belial",
  "card_1786195486214": "Astaroth",
  "card_1786271177323": "Elven dragon rider",
  "card_1786271308444": "Waywatcher",
  "card_1786271382756": "Elven sage",
  "card_1786271427711": "Elven Archer",
  "card_1786271501039": "Highwayman",
  "card_1786271587754": "Human Archer",
  "card_1786271660396": "Goblin Archer",
  "card_1786271704948": "Lion",
  "card_1786282770667": "Demonic Portal",
  "card_1786532973999": "Battlewand",
  "card_1786533610763": "Boots of luck",
  "card_1786533642657": "Dragonshield",
  "card_1786533684221": "Gauntlet of might",
  "card_1786990056839": "Reanimate",
  "card_1786990253728": "Revive",
  "card_1786990506593": "Reincarnate",
  "card_1787057616182": "Towerguard",
  "card_1787057762927": "Guard Dog",
  "card_1787161083942": "Chariot",
  "card_1787393804735": "Summon Demon",
  "card_1787434757506": "Occultist",
  "card_1787434837623": "Warlock"
};

export const KNOWN_SPELL_METADATA: Record<string, { rulesText: string; customDescription: string; manaCost: string; color: CardJSON["color"]; illustration: string }> = {
  "First Strike": {
    rulesText: "Target friendly creature gains First Strike until end of battle.",
    customDescription: "Target friendly creature gains First Strike until end of battle.",
    manaCost: "{R}",
    color: "red",
    illustration: "First Strike.jpg"
  },
  "Lightning Strike": {
    rulesText: "Deals 2 damage to target.",
    customDescription: "Deals 2 damage to target.",
    manaCost: "{1}{R}",
    color: "red",
    illustration: "Lightning Strike.jpg"
  },
  "Fireball": {
    rulesText: "Deals 3 damage to target during battle.",
    customDescription: "Deals 3 damage to target during battle.",
    manaCost: "{2}{R}",
    color: "red",
    illustration: "Fireball.jpg"
  },
  "Clone": {
    rulesText: "Creates a copy of target creature.",
    customDescription: "Creates a copy of target creature.",
    manaCost: "{3}{U}",
    color: "blue",
    illustration: "Clone.jpg"
  },
  "Freeze": {
    rulesText: "Target creature cannot attack or block for 2 turns.",
    customDescription: "Target creature cannot attack or block for 2 turns.",
    manaCost: "{2}{U}",
    color: "blue",
    illustration: "Freeze.jpg"
  },
  "Disenchant": {
    rulesText: "Remove all enchantments from target creature.",
    customDescription: "Remove all enchantments from target creature.",
    manaCost: "{1}{W}",
    color: "white",
    illustration: "Disenchant.jpg"
  },
  "Strength": {
    rulesText: "Target friendly creature gains +2/+2 until end of battle.",
    customDescription: "Target friendly creature gains +2/+2 until end of battle.",
    manaCost: "{G}{G}",
    color: "green",
    illustration: "Strength.jpg"
  },
  "Fog": {
    rulesText: "Attackers turns end directly.",
    customDescription: "Attackers turns end directly.",
    manaCost: "{G}",
    color: "green",
    illustration: "Fog.jpg"
  },
  "Heal": {
    rulesText: "Heal target creature for 2 damage.",
    customDescription: "Heal target creature for 2 damage.",
    manaCost: "{W}",
    color: "white",
    illustration: "Heal.jpg"
  },
  "Fear": {
    rulesText: "Target creature gets -1/-1 until end of battle.",
    customDescription: "Target creature gets -1/-1 until end of battle.",
    manaCost: "{B}",
    color: "black",
    illustration: "Fear.jpg"
  },
  "Regenerate": {
    rulesText: "Target friendly creature gains Regenerate until end of battle.",
    customDescription: "Target friendly creature gains Regenerate until end of battle.",
    manaCost: "{G}",
    color: "green",
    illustration: "Regenerate.jpg"
  },
  "Poison": {
    rulesText: "Target creature gets poisoned.",
    customDescription: "Target creature gets poisoned.",
    manaCost: "{B}{B}",
    color: "black",
    illustration: "Poison.jpg"
  },
  "Web": {
    rulesText: "Removes target creatures flying ability until end of battle.",
    customDescription: "Removes target creatures flying ability until end of battle.",
    manaCost: "{G}",
    color: "green",
    illustration: "Web.jpg"
  },
  "Summon Demon": {
    rulesText: "Summons a demon to your army.",
    customDescription: "Summons a demon to your army.",
    manaCost: "{2}{B}",
    color: "black",
    illustration: "Summon Demon.jpg"
  },
  "Counterspell": {
    rulesText: "Counters target spell or ability.",
    customDescription: "Counters target spell or ability.",
    manaCost: "{U}{U}",
    color: "blue",
    illustration: "Counterspell.jpg"
  },
  "Counterspell Red": {
    rulesText: "Counters target spell or ability.",
    customDescription: "Counters target spell or ability.",
    manaCost: "{R}{R}",
    color: "red",
    illustration: "Counterspell Red.jpg"
  },
  "Counterspell White": {
    rulesText: "Counters target spell or ability.",
    customDescription: "Counters target spell or ability.",
    manaCost: "{W}{W}",
    color: "white",
    illustration: "Counterspell White.jpg"
  },
  "Counterspell Green": {
    rulesText: "Counters target spell or ability.",
    customDescription: "Counters target spell or ability.",
    manaCost: "{G}{G}",
    color: "green",
    illustration: "Counterspell Green.jpg"
  },
  "Counterspell Black": {
    rulesText: "Counters target spell or ability.",
    customDescription: "Counters target spell or ability.",
    manaCost: "{B}{B}",
    color: "black",
    illustration: "Counterspell Black.jpg"
  }
};

export const adjustQuestOpponentForDifficulty = (card: CardJSON, difficulty: "easy" | "medium" | "hard"): CardJSON => {
  if (difficulty === "medium") return card;
  const modified: CardJSON = JSON.parse(JSON.stringify(card));
  if (modified.power !== undefined) {
    const p = parseInt(modified.power, 10);
    if (!isNaN(p)) {
      const delta = difficulty === "easy" ? -1 : 1;
      modified.power = String(Math.max(1, p + delta));
    }
  }
  if (modified.toughness !== undefined) {
    const t = parseInt(modified.toughness, 10);
    if (!isNaN(t)) {
      const delta = difficulty === "easy" ? -1 : 1;
      modified.toughness = String(Math.max(1, t + delta));
    }
  }
  return modified;
};

export const resolveOpponentCard = (ref: string, allCards: CardJSON[]): CardJSON => {
  const targetName = knownCardIdMap[ref] || (ref.toLowerCase().startsWith("card_") ? "" : ref);
  const found = allCards.find(c => 
    c.id === ref || 
    (c as any).cardId === ref ||
    c.name === ref || 
    c.name.toLowerCase() === ref.toLowerCase() ||
    (targetName && c.name.toLowerCase() === targetName.toLowerCase()) ||
    (targetName && (c as any).cardName && String((c as any).cardName).toLowerCase() === targetName.toLowerCase())
  );
  if (found) {
    const copy = JSON.parse(JSON.stringify(found));
    copy.id = `quest_opp_${Date.now()}_${Math.random()}`;
    if (copy.name && copy.name.toLowerCase().startsWith("card_")) {
      const idStr = copy.name;
      if (knownCardIdMap[idStr]) copy.name = knownCardIdMap[idStr];
      else if (idStr === "card_1785165293355") copy.name = "Necromancer";
      else if (idStr === "card_1784467369547") copy.name = "Balrog";
      else if (idStr === "card_1784467664393") copy.name = "Nightmare";
      else if (idStr === "card_1784467862209") copy.name = "Forest Golem";
      else if (idStr === "card_1784468455314" || idStr === "card_1784468209") copy.name = "Stone Golem";
      else if (copy.customDescription && !copy.customDescription.toLowerCase().startsWith("card_")) {
        copy.name = copy.customDescription;
      } else if (copy.rulesText && !copy.rulesText.toLowerCase().startsWith("card_")) {
        copy.name = copy.rulesText;
      }
    }
    const meta = KNOWN_SPELL_METADATA[copy.name];
    if (meta && (copy.type || "").toLowerCase().includes("spell")) {
      if (!copy.rulesText) copy.rulesText = meta.rulesText;
      if (!copy.customDescription) copy.customDescription = meta.customDescription;
      if (!copy.manaCost) copy.manaCost = meta.manaCost;
      if (!copy.color || copy.color === "gold") copy.color = meta.color;
    }
    if (copy.name === "Grandmaster Mage" || ref.toLowerCase().includes("grandmaster") || ref === "card_1785164783475") {
      if (!copy.spells || copy.spells.length === 0) {
        copy.spells = ["card_1784506003132", "card_1785768715146", "card_1785957814891", "card_1785768547724"];
      }
      if (!copy.companions || copy.companions.length === 0) {
        copy.companions = ["card_1787057762927"];
      }
    } else if (copy.name === "Fireball Archmage" || ref.toLowerCase().includes("fireball archmage") || ref === "card_1785165079673") {
      if (!copy.spells || copy.spells.length === 0) {
        copy.spells = ["card_1784504524412"];
      }
    } else if (copy.name === "Lightning Archmage" || ref.toLowerCase().includes("lightning archmage") || ref === "card_1785165194773") {
      if (!copy.spells || copy.spells.length === 0) {
        copy.spells = ["card_1784504384559"];
      }
    } else if (copy.name === "Archmage" || ref.toLowerCase().includes("archmage") || ref === "card_1785164625358") {
      if (!copy.spells || copy.spells.length === 0) {
        copy.spells = ["card_1784504232346", "card_1785768764508"];
      }
      if (!copy.companions || copy.companions.length === 0) {
        copy.companions = ["card_1787057762927"];
      }
    } else if (copy.name === "Battle Mage" || ref.toLowerCase().includes("battle mage") || ref === "card_1785164975702") {
      if (!copy.spells || copy.spells.length === 0) {
        copy.spells = ["card_1784504384559", "card_1784504524412"];
      }
    } else if (copy.name === "Necromancer" || ref.toLowerCase().includes("necromancer") || ref === "card_1785165293355") {
      if (!copy.spells || copy.spells.length === 0) {
        copy.spells = ["card_1785957711575", "card_1785957947231"];
      }
    } else if (copy.name === "Warlock" || ref.toLowerCase().includes("warlock") || ref === "card_1787434837623") {
      if (!copy.spells || copy.spells.length === 0) {
        copy.spells = ["card_1785957711575"];
      }
    }
    const nameLower = (copy.name || "").toLowerCase();
    const typeLower = (copy.type || "").toLowerCase();
    const subLower = (copy.cardSubType || "").toLowerCase();
    const isWizardOpponent = typeLower === "wizard" || 
      subLower.includes("wizard") || 
      subLower.includes("grandmaster") ||
      nameLower.includes("mage") || 
      nameLower.includes("archmage") || 
      nameLower.includes("warlock") || 
      nameLower.includes("necromancer") || 
      nameLower.includes("wizard");
    if (isWizardOpponent) {
      copy.type = "Creature";
      copy.cardSubType = "Wizard";
    }
    return copy;
  }

  const refLower = ref.toLowerCase();
  let name = knownCardIdMap[ref] || ref;
  let power = "3";
  let toughness = "3";
  let keywords: string[] = [];
  let color: CardJSON["color"] = "gold";
  let illustration = `${name}.jpg`;
  let spells: string[] | undefined;
  let companions: string[] | undefined;
  let activatedAbilities: ActivatedAbility[] | undefined;
  let cardSubType: string | undefined;
  let customDescription = "";
  let rulesText = "";
  let manaCost = "";

  let type = "Creature";
  const knownSpellMap: Record<string, string> = {
    "card_1784504232346": "First Strike",
    "card_1784504384559": "Lightning Strike",
    "card_1784504524412": "Fireball",
    "card_1784506003132": "Clone",
    "card_1785768547724": "Freeze",
    "card_1785768715146": "Disenchant",
    "card_1785768764508": "Strength",
    "card_1785768811757": "Fog",
    "card_1785957814891": "Heal",
    "card_1785957711575": "Fear",
    "card_1785957947231": "Regenerate",
    "card_1785957902142": "Poison",
    "card_1785957993479": "Web",
    "card_1787393804735": "Summon Demon",
    "card_1784541679387": "Counterspell"
  };

  if (knownCardIdMap[ref]) {
    name = knownCardIdMap[ref];
    illustration = `${name}.jpg`;
    color = "gold";
  }

  if (refLower.includes("grandmaster") || ref === "card_1785164783475") {
    name = "Grandmaster Mage";
    power = "2";
    toughness = "2";
    color = "blue";
    cardSubType = "Wizard";
    keywords = ["Grandmaster"];
    illustration = "Grandmaster Mage.jpg";
    spells = ["card_1784506003132", "card_1785768715146", "card_1785957814891", "card_1785768547724"];
    companions = ["card_1787057762927"];
  } else if (refLower.includes("fireball archmage") || ref === "card_1785165079673") {
    name = "Fireball Archmage";
    power = "1";
    toughness = "1";
    color = "red";
    cardSubType = "Wizard";
    illustration = "Fireball Archmage.jpg";
    spells = ["card_1784504524412"];
  } else if (refLower.includes("lightning archmage") || ref === "card_1785165194773") {
    name = "Lightning Archmage";
    power = "1";
    toughness = "1";
    color = "red";
    cardSubType = "Wizard";
    illustration = "Lightning Archmage.jpg";
    spells = ["card_1784504384559"];
  } else if (refLower.includes("archmage") || ref === "card_1785164625358") {
    name = "Archmage";
    power = "2";
    toughness = "2";
    color = "blue";
    cardSubType = "Wizard";
    illustration = "Archmage.jpg";
    spells = ["card_1784504232346", "card_1785768764508"];
    companions = ["card_1787057762927"];
  } else if (refLower.includes("battle mage") || ref === "card_1785164975702") {
    name = "Battle Mage";
    power = "2";
    toughness = "1";
    color = "red";
    cardSubType = "Wizard";
    illustration = "Battle Mage.jpg";
    spells = ["card_1784504384559", "card_1784504524412"];
  } else if (refLower.includes("warlock") || ref === "card_1787434837623") {
    name = "Warlock";
    power = "2";
    toughness = "2";
    color = "black";
    cardSubType = "Wizard";
    illustration = "Warlock.jpg";
    spells = ["card_1785957711575"];
  } else if (refLower.includes("necromancer") || ref === "card_1785165293355") {
    name = "Necromancer";
    power = "2";
    toughness = "2";
    color = "black";
    cardSubType = "Wizard";
    illustration = "Necromancer.jpg";
    spells = ["card_1785957711575", "card_1785957947231"];
  } else if (refLower.includes("towerguard") || ref === "card_1787057616182") {
    name = "Towerguard";
    power = "2";
    toughness = "3";
    color = "white";
    cardSubType = "Human";
    illustration = "Towerguard.jpg";
    keywords = ["Reach"];
  } else if (refLower.includes("guard dog") || ref === "card_1787057762927") {
    name = "Guard Dog";
    power = "1";
    toughness = "2";
    color = "white";
    cardSubType = "Hound";
    illustration = "Guard Dog.jpg";
  } else if (refLower.includes("balrog") || ref === "card_1784467369547") {
    name = "Balrog";
    power = "0";
    toughness = "8";
    keywords = ["Trample"];
    color = "red";
    illustration = "Balrog.jpg";
  } else if (refLower.includes("nightmare") || ref === "card_1784467664393") {
    name = "Nightmare";
    power = "2";
    toughness = "8";
    keywords = ["Trample"];
    color = "black";
    illustration = "Nightmare.jpg";
    activatedAbilities = [{ cost: ["B", "B"], text: "Gain +6/+0" }];
  } else if (refLower.includes("forest golem") || ref === "card_1784467862209") {
    name = "Forest Golem";
    power = "3";
    toughness = "4";
    color = "green";
    illustration = "Forest Golem.jpg";
  } else if (refLower.includes("stone golem") || ref === "card_1784468209" || ref === "card_1784468455314") {
    name = "Stone Golem";
    power = "4";
    toughness = "4";
    color = "artifact";
    illustration = "Stone Golem.jpg";
  } else if (refLower.includes("poisoned dagger") || refLower.includes("poisined dagger") || ref === "card_1786110635264") {
    name = "Poisoned dagger";
    type = "Artifact";
    color = "artifact";
    illustration = "Poisined dagger.jpg";
    keywords = ["Poison"];
  } else if (refLower.includes("battlewand") || ref === "card_1786532973999") {
    name = "Battlewand";
    type = "Artifact";
    color = "artifact";
    illustration = "Battlewand.jpg";
    spells = ["card_1784504384559"];
  } else if (knownSpellMap[ref]) {
    name = knownSpellMap[ref];
    type = "Spell";
    cardSubType = "Battle";
    const meta = KNOWN_SPELL_METADATA[name];
    if (meta) {
      rulesText = meta.rulesText;
      customDescription = meta.customDescription;
      manaCost = meta.manaCost;
      color = meta.color;
      illustration = meta.illustration;
    }
  }

  const spellMeta = KNOWN_SPELL_METADATA[name];
  if (spellMeta) {
    type = "Spell";
    cardSubType = "Battle";
    rulesText = rulesText || spellMeta.rulesText;
    customDescription = customDescription || spellMeta.customDescription;
    manaCost = manaCost || spellMeta.manaCost;
    color = color === "gold" ? spellMeta.color : color;
    illustration = illustration || spellMeta.illustration;
  }

  if (refLower.includes("portal")) {
    type = "Portal";
  } else if (refLower.includes("artifact") || refLower.includes("scepter") || refLower.includes("ring") || refLower.includes("wand") || refLower.includes("dagger") || refLower.includes("boots") || refLower.includes("shield") || refLower.includes("gauntlet") || refLower.includes("bracelet")) {
    type = "Artifact";
    color = "artifact";
  } else if (refLower.includes("hero") || refLower.includes("warrior") || refLower.includes("champion") || refLower.includes("knight") || refLower.includes("paladin")) {
    type = "Hero";
  }

  const nameL = name.toLowerCase();
  const subL = (cardSubType || "").toLowerCase();
  const typeL = (type || "").toLowerCase();
  if (typeL === "wizard" || subL.includes("wizard") || subL.includes("grandmaster") || nameL.includes("mage") || nameL.includes("archmage") || nameL.includes("warlock") || nameL.includes("necromancer") || nameL.includes("wizard")) {
    type = "Creature";
    cardSubType = "Wizard";
  }

  return {
    id: `quest_opp_${Date.now()}_${Math.random()}`,
    name,
    manaCost,
    type,
    cardSubType,
    color,
    illustration: resolveIllustrationPath(type, illustration, name, cardSubType),
    rulesText,
    customDescription: customDescription || (name && !name.toLowerCase().startsWith("card_") ? "" : "Quest Opponent"),
    power,
    toughness,
    keywords,
    spells,
    companions,
    activatedAbilities
  };
};

export const generateQuestOpponents = (levelObj: QuestLevelJSON, cardPool: CardJSON[]): CardJSON[] => {
  if (levelObj.opponents && levelObj.opponents.length > 0) {
    return levelObj.opponents.map((ref: string) => {
      const opp = resolveOpponentCard(ref, cardPool);
      const nameL = (opp.name || "").toLowerCase();
      const typeL = (opp.type || "").toLowerCase();
      const subL = (opp.cardSubType || "").toLowerCase();
      if (typeL === "wizard" || subL.includes("wizard") || subL.includes("grandmaster") || nameL.includes("mage") || nameL.includes("archmage") || nameL.includes("warlock") || nameL.includes("necromancer") || nameL.includes("wizard")) {
        opp.type = "Creature";
        opp.cardSubType = "Wizard";
      }
      return opp;
    });
  }
  
  let subType = "";
  let limit = 0;

  if (levelObj.army) {
    subType = (levelObj.army.subType || "").toLowerCase();
    limit = levelObj.army.power || 0;
  } else if (levelObj.armySubTypes && levelObj.armySubTypes.length > 0) {
    subType = (levelObj.armySubTypes[0] || "").toLowerCase();
    limit = levelObj.armyPower || 0;
  } else {
    return [];
  }

  const isLookingForWizard = subType.includes("wizard") || subType.includes("grandmaster");
  const candidates = cardPool.filter(c => {
    const rawType = (c.type || "").toLowerCase();
    const rawSub = (c.cardSubType || "").toLowerCase();
    const nameLower = (c.name || "").toLowerCase();

    // Never pick player wizard hero cards, towers, spells, lands, quests, or artifacts as quest opponent creatures
    if (rawType === "wizard" || rawType === "hero" || rawType === "tower" || rawType === "spell" || rawType === "land" || rawType === "quest" || rawType === "artifact") {
      return false;
    }

    if (isLookingForWizard) {
      const isWizardCreature = rawSub.includes("wizard") || rawSub.includes("grandmaster") || nameLower.includes("mage") || nameLower.includes("warlock") || nameLower.includes("necromancer") || nameLower.includes("archmage");
      return isWizardCreature && rawType === "creature";
    }

    const matchesSubtype = rawSub.includes(subType);
    if (!matchesSubtype) return false;
    if (rawType !== "creature") return false;
    return true;
  });

  if (candidates.length === 0 && isLookingForWizard) {
    const fallbackWizardRefs = ["Grandmaster Mage", "Archmage", "Battle Mage", "Fireball Archmage", "Lightning Archmage", "Warlock", "Necromancer"];
    fallbackWizardRefs.forEach(ref => {
      const resolved = resolveOpponentCard(ref, cardPool);
      resolved.type = "Creature";
      resolved.cardSubType = "Wizard";
      candidates.push(resolved);
    });
  }

  if (candidates.length === 0) return [];

  const selected: CardJSON[] = [];
  let currentPower = 0;
  let attempts = 0;
  while (currentPower < limit && attempts < 100) {
    attempts++;
    const card = candidates[Math.floor(Math.random() * candidates.length)];
    const p = parseInt(card.power || "0", 10) || 0;
    if (currentPower + p <= limit) {
      const cloned = JSON.parse(JSON.stringify(card));
      if (isLookingForWizard || cloned.cardSubType?.toLowerCase() === "wizard" || cloned.cardSubType?.toLowerCase() === "grandmaster" || cloned.type?.toLowerCase() === "wizard") {
        cloned.type = "Creature";
        cloned.cardSubType = "Wizard";
      }
      selected.push(cloned);
      currentPower += p;
    } else if (!candidates.some(c => (parseInt(c.power || "0", 10) || 0) + currentPower <= limit)) {
      break;
    }
  }
  return selected;
};

export const parseManaCost = (rawManaCost: any): string => {
  if (!rawManaCost) return "";
  if (Array.isArray(rawManaCost)) return rawManaCost.join("");
  return String(rawManaCost);
};

export const parseCardColor = (rawColor: string): CardJSON["color"] => {
  const validColors = ["red", "blue", "green", "black", "white", "gold", "artifact"];
  const lower = (rawColor || "artifact").toLowerCase();
  return validColors.includes(lower) ? (lower as CardJSON["color"]) : "artifact";
};

export const mapCardJson = (c: any, questDataMap?: Record<string, QuestDataJSON>): CardJSON => {
  let name = c.cardName || c.name || "Unnamed Card";
  if (typeof name === "string" && name.toLowerCase().startsWith("card_")) {
    if (knownCardIdMap[name]) name = knownCardIdMap[name];
    else if (name === "card_1785165293355") name = "Necromancer";
    else if (name === "card_1784467369547") name = "Balrog";
    else if (name === "card_1784467664393") name = "Nightmare";
    else if (name === "card_1784467862209") name = "Forest Golem";
    else if (name === "card_1784468455314" || name === "card_1784468209") name = "Stone Golem";
    else if (c.customDescription && !c.customDescription.toLowerCase().startsWith("card_")) name = c.customDescription;
    else if (c.rulesText && !c.rulesText.toLowerCase().startsWith("card_")) name = c.rulesText;
  }
  const type = c.type || c.cardType || "Creature";
  const color = parseCardColor(c.color || c.frameStyle);
  const manaCost = parseManaCost(c.manaCost);
  let cardSubType = c.cardSubType || c.subType || undefined;
  const illustration = resolveIllustrationPath(type, c.illustration || c.artBase64 || "", name, cardSubType);

  let power = c.power !== undefined && c.power !== null ? String(c.power) : undefined;
  let toughness = c.toughness !== undefined && c.toughness !== null ? String(c.toughness) : undefined;

  const isCombatCard = type.toLowerCase().includes("creature") || type.toLowerCase().includes("wizard");
  if (isCombatCard) {
    if (power === undefined) power = "1";
    if (toughness === undefined) toughness = "1";
  }

  let customDescription = c.customDescription || c.customDescriptionText || "";
  let rulesText = c.rulesText || "";

  const isQuest = type.toLowerCase().includes("quest") || name.toLowerCase().includes("quest");
  let questData: QuestDataJSON | undefined = c.questData;
  if (isQuest && !questData) {
    const qKey = c.id || c.cardId || name;
    if (questDataMap && (questDataMap[qKey] || questDataMap[name])) {
      questData = questDataMap[qKey] || questDataMap[name];
    } else if (name === "Tower of Terror Quest" || c.id === "default_tower_of_terror_quest") {
      questData = defaultTowerOfTerrorQuestData;
    }
  }

  let questLevel = c.questLevel !== undefined ? c.questLevel : 0;
  let totalQuestLevels = c.totalQuestLevels;

  if (isQuest && questData && questData.levels && questData.levels.length > 0) {
    totalQuestLevels = questData.levels.length;
    const levelObj = questData.levels[questLevel] || questData.levels[0];
    const questText = buildQuestTextFromLevel(levelObj);
    cardSubType = `Level ${questLevel + 1}/${totalQuestLevels}`;
    customDescription = questText;
    rulesText = "";
  }

  const isActualWizard = (type.toLowerCase() === "wizard" || 
                          type.toLowerCase() === "legendary wizard avatar" || 
                          name.toLowerCase().startsWith("wizard l") || 
                          name.toLowerCase() === "wizard mage" || 
                          name.toLowerCase() === "archmage adept" || 
                          name.toLowerCase() === "grand archmage") && 
                         !name.toLowerCase().endsWith("ability");

  const rawSpells = c.spells || c.spell;
  let spells = rawSpells
    ? Array.isArray(rawSpells)
      ? rawSpells
      : typeof rawSpells === "string"
      ? rawSpells.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [rawSpells]
    : undefined;

  if ((name === "Necromancer" || c.id === "card_1785165293355") && (!spells || spells.length === 0)) {
    spells = ["card_1785957711575", "card_1785957947231"];
  }

  const rawCompanions = c.companions || c.companion || c.campanian || c.Campanian;
  const companions = rawCompanions
    ? Array.isArray(rawCompanions)
      ? rawCompanions
      : typeof rawCompanions === "string"
      ? rawCompanions.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [rawCompanions]
    : undefined;

  return {
    id: c.id || c.cardId || undefined,
    name,
    color,
    manaCost,
    type,
    cardSubType,
    illustration,
    rulesText,
    customDescription,
    power,
    toughness,
    artScale: c.artScale !== undefined ? Number(c.artScale) : undefined,
    artX: c.artX !== undefined ? Number(c.artX) : undefined,
    artY: c.artY !== undefined ? Number(c.artY) : undefined,
    artRotation: c.artRotation !== undefined ? Number(c.artRotation) : undefined,
    keywords: c.keywords || c.keywordAbilities || [],
    activatedAbilities: isActualWizard ? [] : (c.activatedAbilities || []),
    target: c.target || undefined,
    questLevel,
    totalQuestLevels,
    questData,
    completed: c.completed || false,
    spells,
    companions,
  };
};

const preloadedImageCache = new Set<string>();

export const preloadImage = (src: string): Promise<void> => {
  if (!src || preloadedImageCache.has(src)) return Promise.resolve();
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      preloadedImageCache.add(src);
      resolve();
    };
    img.onerror = () => {
      resolve();
    };
    img.src = src;
  });
};

export const preloadAllGameImages = async (cards?: CardJSON[]) => {
  const urlsToPreload = new Set<string>();

  // 1. Preload images mapped in cardNameMap
  Object.entries(cardNameMap).forEach(([name, file]) => {
    if (file) {
      const cardObj = cards?.find((c) => (c.name || "").toLowerCase() === name.toLowerCase());
      const path = resolveIllustrationPath(cardObj?.type || "", file, name, cardObj?.cardSubType);
      if (path) urlsToPreload.add(path);
    }
  });

  // 2. Preload active card illustrations if provided
  if (cards) {
    cards.forEach((card) => {
      if (card.illustration) {
        const resolved = resolveIllustrationPath(card.type, card.illustration, card.name, card.cardSubType);
        if (resolved) urlsToPreload.add(resolved);
      }
    });
  }

  // 3. Preload Map Tiles & Wizards
  const tileTypes = ["Plain", "Forrest", "Mountain", "Swamp", "Wizards Tower"];
  tileTypes.forEach((t) => {
    for (let level = 1; level <= 4; level++) {
      urlsToPreload.add(getAssetUrl(`assets/tiles/${t} L${level}.png`));
    }
  });

  for (let level = 1; level <= 4; level++) {
    urlsToPreload.add(getAssetUrl(`assets/wizards/Wizard L${level}.jpg`));
  }
  urlsToPreload.add(getAssetUrl("assets/wizards/Ultimate Victory.png"));

  // 4. Preload ability, quest, hero and legend images
  const extraAssets = [
    "assets/quests/Tower of Terror Quest.png",
    "assets/quests/Dragons Lair Quest.jpg",
    "assets/quests/Tower of Power Quest.jpg",
    "assets/tiles/Dragons Lair.png",
    "assets/tiles/Tower of Power.png",
    "assets/abilities/Tower Ability.png",
    "assets/abilities/Tower Ability.jpg",
    "assets/abilities/Wizard Ability.png",
    "assets/abilities/Wizard Ability.jpg",
    "assets/heroes/Achilles.jpg",
    "assets/heroes/Keni Queen.jpg",
    "assets/heroes/Manhunter.jpg",
    "assets/heroes/Rick Dragonslayer.jpg",
    "assets/heroes/Roland.jpg",
    "assets/heroes/Two Heavens.jpg",
    "assets/legends/Fafnir.jpg",
    "assets/legends/Frankensteins Monster.jpg",
    "assets/artifacts/Bracelet of strength.jpg",
    "assets/artifacts/Poisined dagger.jpg",
    "assets/artifacts/Ring of power.jpg",
    "assets/artifacts/Ringmail of protection.jpg",
    "assets/artifacts/Scepter of doom.jpg",
    "assets/artifacts/Sword of glory.jpg",
    "assets/portals/Planar Portal.jpg",
    "assets/portals/Sol Ring.jpg",
  ];
  extraAssets.forEach((img) => urlsToPreload.add(getAssetUrl(img)));

  // Execute all preload image requests in parallel
  await Promise.all(Array.from(urlsToPreload).map((url) => preloadImage(url)));
};



export const isQuestOnlyNoCost = (card: CardJSON): boolean => {
  if (!card) return false;
  const cardType = card.type || "";
  const cardName = card.name || "";
  const isQuest = cardType.toLowerCase().includes("quest") || cardName.toLowerCase().includes("quest");
  const hasNoCost = !card.manaCost || card.manaCost.trim() === "";
  return isQuest && hasNoCost;
};

export const findCardsByRawId = (query: string, cardPool: CardJSON[]): CardJSON[] => {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();

  const matches = cardPool.filter((c) => {
    const id = (c.id || "").toLowerCase();
    const cardId = ((c as any).cardId || "").toLowerCase();
    const name = (c.name || "").toLowerCase();
    return id.includes(q) || cardId.includes(q) || name.includes(q);
  });

  if (matches.length > 0) return matches;

  const fallback = resolveOpponentCard(query.trim(), cardPool);
  if (fallback && fallback.name) {
    return [fallback];
  }

  return [];
};

export interface TowerLevelUpRequirement {
  requiredLands: number;
  requiredMinLevel?: number;
  requiredMinLevelCount?: number;
}

export const getTowerLevelUpRequirements = (currentLevel: number): TowerLevelUpRequirement | null => {
  if (currentLevel === 1) return { requiredLands: 20 };
  if (currentLevel === 2) return { requiredLands: 30 };
  if (currentLevel === 3) return { requiredLands: 40 };
  return null;
};

export interface TowerLevelUpCheckResult {
  eligible: boolean;
  totalLands: number;
  minLevelLands: number;
  requiredLands: number;
  requiredMinLevel: number;
  requiredMinLevelCount: number;
  reason: string;
}

export const checkTowerLevelUpEligibility = (
  cells: Array<{ ownerId: number | null; tileId: string }>,
  currentLevel: number,
  playerIndex: number = 0
): TowerLevelUpCheckResult => {
  const reqs = getTowerLevelUpRequirements(currentLevel);
  if (!reqs) {
    return {
      eligible: false,
      totalLands: 0,
      minLevelLands: 0,
      requiredLands: 0,
      requiredMinLevel: 0,
      requiredMinLevelCount: 0,
      reason: "Wizards Tower is already at maximum level (Level 4)!"
    };
  }

  let totalLands = 0;
  cells.forEach((cell) => {
    if (cell.ownerId === playerIndex) {
      totalLands++;
    }
  });

  const eligible = totalLands >= reqs.requiredLands;

  let reason = "";
  if (eligible) {
    reason = "Requirements met!";
  } else {
    reason = `Requires owning ${reqs.requiredLands} lands (currently ${totalLands})`;
  }

  return {
    eligible,
    totalLands,
    minLevelLands: totalLands,
    requiredLands: reqs.requiredLands,
    requiredMinLevel: 0,
    requiredMinLevelCount: 0,
    reason
  };
};

