# Starting Wizard Level Matches Wizards Tower Implementation Plan

We will update the game initialization logic so that players (the player and the bot) start with a Wizard avatar whose level matches their starting Wizards Tower land level.

## Proposed Changes

### Game Logic and UI Components

#### [MODIFY] [App.tsx](file:///c:/Users/rikar/OneDrive/Skrivbord/Wizards%20of%20the%20North/src/App.tsx)
- In `initializeGame`, after calling `createPlayer` for both players, query their starting tower cell from the newly hydrated map.
- Assign the starting tower's level to their respective `wizardLevel` property.

### Documentation

#### [MODIFY] [rules.md](file:///c:/Users/rikar/OneDrive/Skrivbord/Wizards%20of%20the%20North/docs/rules.md)
- Update Section 3 (The Archmage Wizard) to document that the starting Wizard Level matches the level of the starting Wizards Tower.

## Verification Plan

### Automated Tests
- Run `npm run build` to verify clean compilation.

### Manual Verification
- Start the game. Verify the player (You) starts with a Level 1 Wizard (matching the Level 1 Wizards Tower on the map).
- Verify the enemy bot (Sauron Bot) starts with a Level 3 Wizard (matching the Level 3 Wizards Tower on the map).
