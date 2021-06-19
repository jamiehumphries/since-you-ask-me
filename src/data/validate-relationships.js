const characters = require("./characters");
const events = require("./events");

let count = 0;
for (const event of events) {
  for (const id1 of event.characters) {
    const character = characters.find((c) => c.id === id1);
    for (const id2 of event.characters) {
      if (id1 === id2 || character.unmappedRelationships.includes(id2)) {
        continue;
      }
      const relationship = character.relationships.find(
        (r) => r.character === id2
      );
      if (relationship === undefined) {
        count++;
        console.error(`Unaccounted relationship: ${id1} to ${id2}`);
      }
    }
  }
}

console.log(`${count} unaccounted relationship${count === 1 ? "" : "s"}.`);
