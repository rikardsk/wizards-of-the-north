const fs = require('fs');

const deckPath = 'c:\\Users\\rikar\\OneDrive\\Skrivbord\\Wizards of the North\\public\\assets\\decks\\wizards_deck_1.json';

const descriptions = {
  "Skirk Prospector Goblin": "A fierce goblin sentry that gathers resources.",
  "Ogre Sunderer": "Earth shaker and wall breaker.",
  "Magma Rifter Elemental": "A creature born of molten fury.",
  "Hellkite Ancient Dragon": "Scorches the earth from above.",
  "Field Sentry Human": "Guardian of the outer gates.",
  "White Knight": "A champion of light and justice.",
  "Leonin Sun-Stalker": "Hunter of the golden plains.",
  "Archon of Grace": "A divine protector in the skies.",
  "Leaf-Crowned Elf Scout": "Fleet-footed scout of the forests.",
  "Rootwalla Lizard": "Adapts to any forest environment.",
  "Heartwood Dryad": "A tree spirit protector of the woods.",
  "Sylvan Primordial": "Force of nature incarnate.",
  "Festering Bog-Rot Human Zombie": "Born of the swamp rot, seeking flesh.",
  "Carrion Crow Swarm": "A dark cloud over the swamps.",
  "Fen Haunt Spirit": "A restless soul of the marshes.",
  "Litch King": "Lord of the undead host.",
  "Wizard L1": "Practitioner of basic blue spellcraft.",
  "Wizard L2": "A skilled wizard of the tower.",
  "Wizard L3": "A wizard of advanced studies and elemental control.",
  "Wizard L4": "Archmage of the North, master of the ultimate magic."
};

try {
  const raw = fs.readFileSync(deckPath, 'utf8');
  const data = JSON.parse(raw);
  
  data.cards.forEach(c => {
    const name = c.name || c.cardName;
    if (descriptions[name] !== undefined) {
      c.rulesText = descriptions[name];
    } else {
      c.rulesText = "A mysterious entity.";
    }
  });
  
  fs.writeFileSync(deckPath, JSON.stringify(data, null, 2));
  console.log('Successfully populated wizards_deck_1.json rulesText!');
} catch (err) {
  console.error('Error:', err.message);
}
