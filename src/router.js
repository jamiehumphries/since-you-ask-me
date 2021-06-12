const express = require("express");

const data = require("./data");

const router = express.Router();

router.get("/", handleSortQuery, (req, res) => {
  const topic = "what happened in";
  const subject = "Series 9 of John Finnemore’s Souvenir Programme";
  const events = getEvents(() => true, res.locals.sortChronologically);
  res.render("timeline", { topic, subject, events, isHome: true });
});

router.get(
  "/what-happened-in/episode-:number(\\d+)",
  handleSortQuery,
  (req, res, next) => {
    const { number } = req.params;
    const episode = parseInt(number);
    if (episode < 1 || episode > 6) {
      next();
    } else {
      const topic = "what happened in";
      const subject = `Episode ${episode}`;
      const activeTag = `+${episode}`;
      const events = getEvents(
        (event) => event.episode === episode,
        res.locals.sortChronologically
      );
      res.render("timeline", { topic, subject, activeTag, events });
    }
  }
);

router.get(
  "/what-happened-in/episode-:episodeNumber(\\d+)/scene-:sceneNumber(\\d+)",
  handleSortQuery,
  (req, res, next) => {
    const { episodeNumber, sceneNumber } = req.params;
    const episode = parseInt(episodeNumber);
    const scene = parseInt(sceneNumber);
    const topic = "what happened in";
    const subject = `Episode ${episode}, Scene ${scene}`;
    const activeTag = `~`;
    const events = getEvents(
      (event) => event.episode === episode && event.scene === scene,
      false
    );
    if (events.length === 0) {
      next();
    } else {
      res.render("timeline", { topic, subject, activeTag, events });
    }
  }
);

router.get(
  "/for-the-life-history-of/:id([a-z-]+)",
  handleSortQuery,
  (req, res, next) => {
    const { id } = req.params;
    const character = data.characters.find((c) => c.id === id);
    if (!character) {
      next();
    } else {
      const topic = "for the life history of";
      const subject = character.fullName;
      const activeTag = `@${id}`;
      const events = getEvents(
        (event) => event.characters.includes(id),
        res.locals.sortChronologically
      );
      res.render("timeline", { topic, subject, activeTag, events });
    }
  }
);

router.get(
  "/for-a-tale-of/:id([0-9a-z-]+)",
  handleSortQuery,
  (req, res, next) => {
    const { id } = req.params;
    const theme = data.themes.find((t) => t.id === id);
    if (!theme) {
      next();
    } else {
      const topic = "for a tale of";
      const subject = theme.subject;
      const activeTag = `#${id}`;
      const events = getEvents(
        (event) => event.themes.includes(id),
        res.locals.sortChronologically
      );
      res.render("timeline", { topic, subject, activeTag, events });
    }
  }
);

function handleSortQuery(req, res, next) {
  if (req.originalUrl.endsWith("?in-broadcast-order")) {
    res.redirect(req.path);
  } else {
    res.locals.sortChronologically =
      req.query["starting-from-the-beginning"] !== undefined;
    next();
  }
}

function getEvents(predicate, sortChronologically) {
  const events = data.events.filter(predicate).filter((e) => e.episode > 0);
  return sortChronologically ? events.sort(chronologicalOrdering) : events;
}

function chronologicalOrdering(e1, e2) {
  if (e1.year !== e2.year) {
    return e1.year - e2.year;
  } else {
    return e1.inYearSortIndex - e2.inYearSortIndex;
  }
}

module.exports = router;
