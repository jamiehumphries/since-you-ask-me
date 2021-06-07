const express = require("express");

const data = require("./data");

const router = express.Router();

router.get("/", (req, res) => {
  const request =
    "what happened in Season 9 of John Finnemore’s Souvenir Programme";
  const events = data.events;
  res.render("events", { request, events });
});

router.get("/what-happened-in/episode-:number(\\d+)", (req, res, next) => {
  const { number } = req.params;
  const episode = parseInt(number);
  if (episode < 1 || episode > 6) {
    next();
  } else {
    const request = `what happened in Episode ${number}`;
    const events = data.events.filter((event) => event.episode === episode);
    res.render("events", { request, events });
  }
});

router.get("/for-the-life-history-of/:id([a-z-]+)", (req, res, next) => {
  const { id } = req.params;
  const character = data.characters.find((c) => c.id === id);
  if (!character) {
    next();
  } else {
    const request = `for the life history of ${character.fullName}`;
    const events = data.events.filter((event) => event.characters.includes(id));
    res.render("events", { request, events });
  }
});

router.get("/for-a-tale-of/:id([a-z-]+)", (req, res, next) => {
  const { id } = req.params;
  const theme = data.themes.find((t) => t.id === id);
  if (!theme) {
    next();
  } else {
    const request = `for a tale of ${theme.text}`;
    const events = data.events.filter((event) => event.themes.includes(id));
    res.render("events", { request, events });
  }
});

module.exports = router;
