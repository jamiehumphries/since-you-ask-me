const events = [
  {
    episode: 1,
    scene: 1,
    year: 2020,
    location: "Online",
    description: [
      "[Jerry](@jerry-wilkinson) and [Deb](@deborah) pull a [cracker](#christmas-crackers) on Zoom.",
    ],
  },
  {
    episode: 1,
    scene: 1,
    year: 2020,
    location: "Online",
    description: [
      "[Jerry](@jerry-wilkinson) and [Deb](@deborah) pull a [cracker](#christmas-crackers) on Zoom.",
    ],
  },
  {
    episode: 1,
    scene: 1,
    year: 2020,
    location: "Online",
    description: [
      "[Jerry](@jerry-wilkinson) and [Deb](@deborah) pull a [cracker](#christmas-crackers) on Zoom.",
    ],
  },
  {
    episode: 1,
    scene: 1,
    year: 2020,
    location: "Online",
    description: [
      "[Jerry](@jerry-wilkinson) and [Deb](@deborah) pull a [cracker](#christmas-crackers) on Zoom.",
    ],
  },
];

module.exports = events.map((event) => {
  event.characters = event.characters || [];
  event.themes = event.themes || [];
  const matches = event.description
    .join(" ")
    .matchAll(/\[[^\]]+\]\(([@#][a-z-]+)\)/g);
  for (const match of matches) {
    const tag = match[1];
    const type = tag[0];
    const id = tag.substring(1);
    if (type === "@") {
      event.characters.push(id);
    } else if (type === "#") {
      event.themes.push(id);
    }
  }
  return event;
});
