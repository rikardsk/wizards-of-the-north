export interface ActivatedAbility {
  cost: string[];
  text: string;
}

export interface CardJSON {
  id?: string;
  name: string;
  manaCost: string;
  type: string;
  color: "red" | "blue" | "green" | "black" | "white" | "gold" | "artifact";
  illustration: string;
  rulesText: string;
  power?: string;
  toughness?: string;
  artScale?: number;
  artX?: number;
  artY?: number;
  artRotation?: number;
  keywords?: string[];
  activatedAbilities?: ActivatedAbility[];
  customDescription?: string;
  cardSubType?: string;
  stackCount?: number;
  ratioText?: string;
  isSetComplete?: boolean;
  completed?: boolean;
  target?: string;
  questLevel?: number;
  totalQuestLevels?: number;
  questData?: any;
  xp?: number;
  artifactBuffs?: string[];
  spells?: any;
  companion?: any;
  companions?: any;
  campanian?: any;
  questArmy?: CardJSON[];
  questHp?: number;
  sourceMedusaId?: string;
  subType?: string;
  [key: string]: any;
}

export interface MapCell {
  col: number;
  row: number;
  tileId: string;
  ownerId: number | null; // Player index owning this cell
  occupant: CardJSON | null; // Card placed on this cell
}

export interface MapDataJSON {
  cols: number;
  rows: number;
  seed: string;
  playerCount: number;
  playerStartCells: Array<{ col: number; row: number } | null>;
  mapData: string[][]; // 2D array of raw tile IDs
}

export interface Player {
  id: number;
  name: string;
  color: string;
  towerHp: number;
  mana: number;
  manaPool?: {
    W: number;
    U: number;
    B: number;
    R: number;
    G: number;
    C: number;
  };
  hand: CardJSON[];
  deck: CardJSON[];
  graveyard: CardJSON[];
  isBot: boolean;
  wizardLevel: number;
  xp?: number;
  wizardManaChoice: "W" | "U" | "B" | "R" | "G" | "C";
  drawPreference?: "creatures" | "spells" | "alternate" | "random" | "next";
  lastDrawnType?: "creature" | "spell";
  deckColors?: string[];
  wizardPowerBuff?: number;
  wizardToughnessBuff?: number;
  wizardSpells?: string[];
  wizardCompanions?: string[];
  wizardKeywords?: string[];
  armyCards?: CardJSON[];
}

export interface ManaHistoryEvent {
  turn: number;
  playerIdx: number;
  playerName: string;
  type: "generation" | "expenditure";
  details: string;
  amounts: { W: number; U: number; B: number; R: number; G: number; C: number };
}

export interface GameState {
  map: MapCell[][]; // Hydrated 2D grid
  cols: number;
  rows: number;
  players: Player[];
  activePlayerIndex: number;
  turnNumber: number;
  phase: "play" | "action" | "cleanup";
  winnerId: number | null;
  logs: string[];
  manaHistory: ManaHistoryEvent[];
}

export interface MockFightCreature {
  id: string;
  card: CardJSON;
  damage: number;
  isAttacking?: boolean;
  blockingId?: string | null;
  activeSpells?: (string | CardJSON | any)[];
  col?: number;
  row?: number;
}
