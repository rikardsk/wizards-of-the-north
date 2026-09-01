# Wizards of the North - Game Rules

Welcome to **Wizards of the North**, a tactical hexagonal board game of magical domination.

---

## 1. Core Objective
Defeat the opposing wizard! Reduce the enemy's **Wizards Tower HP** from **10 to 0** by summoning creatures and positioning them adjacent to the enemy base.

---

## 2. Mana & Territories
Your controlled territories generate specialized mana colors each turn based on their terrain type and level:

*   **Plains (Yellow / W):** Generates **White (W)** mana equal to the tile's level.
*   **Forests (Green / G):** Generates **Green (G)** mana equal to the tile's level.
*   **Mountains (Red / R):** Generates **Red (R)** mana equal to the tile's level.
*   **Swamps (Purple / B):** Generates **Black (B)** mana equal to the tile's level.
*   **Towers (Blue / U):** Generates **Blue (U)** mana equal to the tower's level (Level 1 generates 1, up to Level 4 generating 4).
*   **Other Lands:** Generates **1 Colorless (C)** mana. Deprecated.

### Rules of Mana Management:
*   Mana accumulates and persists across turns.
*   The total pool of mana cannot exceed **10** (any excess gained is discarded).
*   **Mana Conversion:** On your turn, you can convert any of your colored mana (White, Blue, Black, Red, Green) into Colorless (C) mana on a 1-to-1 basis using the converter controls in the **Wizard** tab.

---

## 3. The Archmage Wizard
Your Wizard acts as a direct source of power:
*   Produces mana equal to their **Wizard Level** (starts at a level matching their starting Wizards Tower land, e.g., Level 1 for a Level 1 Tower).
*   You can change the color choice of the wizard's generated mana inside the **Wizard Profile** panel.
*   **Leveling Up:** Costs **6, 12, or 18** generic/colorless mana (for level 2, 3, and 4 respectively).
*   **Level Cap:** The maximum level for a Wizard is **4**.

---

## 4. Summoning Creatures & Hand Rules
Build your army to capture the map and attack the enemy:
*   **Starting Hand:** Both players start the match with **3 random cards** in their hand.
*   **Start-of-Turn Draw:** At the start of each turn, the active player draws **1 random card** matching their available mana colors (the selectable/active colors in the Wizard tab, which are determined by adjacent or owned lands).
*   **Presentation:** Newly drawn cards are presented to the human player via a **Card Gained** modal. Dismissing this modal adds the card to their hand.
*   **Hand Limit:** The maximum hand size is **10 cards**. If a player's hand is full, they do not draw a card at the start of their turn.
*   **Summoning Requirements:**
    *   Select a card from your hand (keys `1` to `5` or clicking them).
    *   Hover over the board and click a valid hex to summon the creature.
    *   You must have enough mana of the required colors in your pool.
    *   The creature must be placed adjacent to a tile you already own or your starting tower.
    *   The target land's level must be equal to or higher than the creature's power (power is the first value in the bottom right corner of the card).

---

## 5. Combat & Attacking
*   When a creature is placed adjacent to the opponent's Wizards Tower, it automatically attacks.
*   It deals damage equal to its **Power** directly to the opponent's Tower HP.

---

## 6. Keyboard Controls & Shortcuts
Use the following shortcuts to navigate and play the game:

| Action | Key / Input |
| :--- | :--- |
| **End Turn** | `E` |
| **Close All Modals / Deselect** | `Esc` |
| **Select Card in Hand** | `1` - `5` |
| **Cycle Bottom Panel Tabs** | `Tab` |
| **Level Up Wizard** | `W` |
| **Toggle Player Profile Panel** | `P` |
| **Toggle Cards & Lands Panel** | `C` |
| **Open Deck List Modal** | `D` |
| **Toggle Game Log Modal** | `L` |
| **Open Mana History Modal** | `H` |
| **Open Game Menu Modal** | `M` |
| **Open Settings Modal** | `S` |
| **Open Game Rules Modal** | `G` |
| **Open Keyboard Shortcuts Modal** | `?` |

---

## 7. Possible Future Rules (Discussion)
*   Should your creatures stack in one land, or should there be a limit of only one creature per land?
*   Should the number of spells you can cast per turn equal your Wizard level or your Tower level?
*   Should players be able to choose their starting lands at the beginning of the match?
*   Should the wizard be present as a unit in every battle? Yes
*   Should creatures retain damage between battles/turns? Good question, I have top think about it.

## 8. Wizards Tower Ability & Upgrades
Your Wizards Tower has an active ability and can be upgraded:
*   **Draw a Card:** Costs **3 Colorless / Generic** mana. Draws a random card matching your active wizard mana colors.
*   **Wizards Tower Upgrades:** The Wizards Tower starts at Level 1 (Wizards Tower L1) and can be upgraded up to Level 4.
    *   **Level 1 → 2:** Costs **6 Colorless** mana.
    *   **Level 2 → 3:** Costs **12 Colorless** mana.
    *   **Level 3 → 4:** Costs **18 Colorless** mana.
    *   Upgrading is done from the **Towers** tab panel. When upgraded, its level classification on the map increases, its Blue (U) mana production increases (Level 1 produces 1, up to Level 4 producing 4), and its card artwork and stats update accordingly.

---

## 9. Battle Arena Modal
You can inspect the active units deployed by both armies top-down:
*   **Fight Buttons:** Located in the header next to "End Turn", and in the right sidebar next to the second "End Turn" button.
*   **Keyboard Shortcut:** Press **F** to toggle the modal open or closed.
*   **Visual Layout:** Compares your deployed creatures with the enemy's deployed creatures in a top-down configuration (Bot's army on top, your army on bottom), showing their respective map coordinates.

---

## Changes made on 2026-07-10
* Players now start with 3 random cards in hand matching available wizard mana colors.
* The maximum hand size is capped at 10 cards.
* At the start of each turn, players draw 1 random card matching their available wizard mana choice colors.
* Newly drawn cards are presented to the human player in a visual modal before being placed in the hand.
* Deprecated legacy hand-filtering logic; all cards in the hand are now fully visible in the bottom hand tab.
* You can only place creatures where the land level is equal or higher to the creature power.
* Added an active ability to the Wizards Tower: Costing 3 colorless mana, players can draw a card matching their available mana colors.
* Added a Battle Arena Face-Off modal in a top-down layout showing deployed creatures (shortcut: F).
* Placed a second "Fight" button next to the sidebar's "End Turn" button.