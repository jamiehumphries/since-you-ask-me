module.exports = [
  {
    id: "alex",
    fullName: "Alex",
    shortName: "Alex",
    knownAges: [],
    relationships: [
      { character: "russ-golding", relationship: "husband" },
      { character: "toby", relationship: "daughter" },
    ],
  },
  {
    id: "deborah",
    fullName: "Deborah",
    shortName: "Deborah",
    knownAges: [],
    relationships: [],
  },
  {
    id: "jerry-wilkinson",
    fullName: "Jerry Wilkinson",
    shortName: "Jerry",
    knownAges: [],
    relationships: [],
  },
  {
    id: "russ-golding",
    fullName: "Russ Golding",
    shortName: "Russ",
    knownAges: [{ episode: 1, scene: 6, age: 16 }],
    relationships: [
      { character: "alex", relationship: "husband" },
      { character: "deborah", relationship: "mother" },
      { character: "jerry-wilkinson", relationship: "grandfather" },
      { character: "toby", relationship: "daughter" },
    ],
  },
  {
    id: "toby",
    fullName: "Toby",
    shortName: "Toby",
    knownAges: [],
    relationships: [],
  },
];
