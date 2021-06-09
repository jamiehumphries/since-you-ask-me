const events = [
  {
    episode: 1,
    scene: 1,
    year: 2020,
    inYearSortOrder: 0,
    location: "Online",
    description: [
      "During the [COVID-19 pandemic](#the-covid-19-pandemic), [Deborah](@deborah) and [Jerry](@jerry-wilkinson) coordinate to virtually pull a [Christmas cracker](#christmas-crackers) on a family video call. " +
        "They are helped in their attempt by [Tobi](@tobi) and [Alex](@alex), and lightly teased by [Russ](@russ-golding).",
      "While playing charades, Deborah [calls the rest of the family “spaniels”](#spaniels) for deliberately avoiding the correct guess (even though she had already revealed the answer by accident).",
      "The family each rip up the hat that they get from their cracker, although Alex has to first be reminded to do so.",
      "At one point during the call, Alex [tells Tobi to let their dog, Oswald, out](#letting-dogs-out).",
    ],
  },
  {
    episode: 1,
    scene: 2,
    year: 2018,
    inYearSortOrder: 0,
    location: "Hastings",
    description: [
      "In preparation for [Pier Pressure](#pier-pressure) playing at a [funeral](#funerals), " +
        "[Russ](@russ-golding) phones the bereaved to discussed the setlist.",
      "Russ informs him that they cannot perform <em>Ding-Dong! The Witch is Dead</em> and they have to stick to the original lyrics for <em>Always Look on the Bright Side of Life</em>, " +
        "but can otherwise accommodate his (largely witch-themed) requests.",
    ],
  },
  {
    episode: 1,
    scene: 3,
    year: 2010,
    inYearSortOrder: 0,
    location: "Lanzarote",
    description: [
      "On the beach, [Alex](@alex) asks [Russ](@russ-golding) about a little mark on his shoulder. " +
        "Russ tells him that it is a [tattoo](#russ-tattoo) of the lower jawbone of a crocodile.",
      "He explains that a crocodile has strong muscles for closing its jaw but only weak ones for opening it. " +
        "He claims that the tattoo is to remind him that strength depends on how you measure it.",
    ],
  },
  {
    episode: 1,
    scene: 4,
    year: 2006,
    inYearSortOrder: 0,
    location: "Larmer Tree Festival",
    description: [
      "[Pier Pressure](#pier-pressure), perform their version of [<em>Woof, Woof, Woof</em>](#woof-woof-woof) at the festival.",
      "The song is introduced as being “from the diseased mind of [the drummer](@russ-golding)” and features various dog impressions.",
    ],
  },
  {
    episode: 1,
    scene: 5,
    year: 2004,
    inYearSortOrder: 0,
    location: "Hastings",
    description: [
      "In a band meeting, one of the members of [Pier Pressure](#pier-pressure) suggests they do a cover of <em>A Nightingale Sang in Berkeley Square</em>. " +
        "[Russ](@russ-golding) insists that they should do “the famous bit” and gives a short rendition of [<em>Woof, Woof, Woof</em>](#woof-woof-woof).",
      "After an initial stunned silence, the rest of the band start to laugh at Russ’ insistence that this is how the song goes. " +
        "Their hilarity grows as Russ sings in a high pitched voice and explains that it is the nightingale doing dog impressions.",
      "The lead singer resolves that they are doing the song. " +
        "He dismisses the rest of the band except for Russ, to whom he says: “You and me are writing a song, [Jawbone](#russ-tattoo).”",
    ],
  },
  {
    episode: 1,
    scene: 6,
    year: 2003,
    inYearSortOrder: 0,
    location: "Hastings",
    description: [
      "[Russ](@russ-golding) asks a tattoo artist to give him the smallest possible [animal tattoo](#russ-tattoo) which is still recognisable. " +
        "They decide on a crocodile.",
      "When asked, Russ admits that he is only getting the tattoo because of peer pressure from [his band](#pier-pressure). " +
        "In fact, he reveals, that is literally the name of the band (although they spell it ‘Pier Pressure’ because of Hastings pier).",
      "The tattoo artist lets him change this answer so that she is allowed to give him the tattoo, but tells him that she can stop anytime.",
    ],
  },
  {
    episode: 0,
    scene: 0,
    year: 2021,
    inYearSortOrder: 0,
    location: "Placeholder",
    description: [""],
  },
];

module.exports = events.map((event) => {
  event.characters = event.characters || [];
  event.themes = event.themes || [];
  const matches = event.description
    .join(" ")
    .matchAll(/\[[^\]]+\]\(([@#][0-9a-z-]+)\)/g);
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
