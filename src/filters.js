const { characters, events, themes } = require("./data");

module.exports = (env, isDev) => {
  const safe = env.getFilter("safe");

  function pageTitle(subject) {
    return subject
      .replace(/<\/?em>/g, "")
      .replace(/[a-zA-Z]/, (letter) => letter.toUpperCase());
  }

  function toTimeline(event, activeTag, sortChronologically) {
    const paragraphs = getParagraphs(event, activeTag, sortChronologically);
    const additionalInfo = getAdditionalInfo(
      event,
      activeTag,
      sortChronologically
    );
    let html = `<p>${paragraphs.join("</p><p>")}</p>`;
    if (additionalInfo.length > 0) {
      html += `<ul><li>${additionalInfo.join("</li><li>")}</li></ul>`;
    }
    return safe(html);
  }

  function getParagraphs(event, activeTag, sortChronologically) {
    return event.description
      .trim()
      .split("\n\n")
      .map((paragraph) =>
        paragraph
          .trim()
          .replace(/\[([^\]]+)\]\(([@#][0-9a-z-]+)\)/g, (_, text, tag) =>
            tag === activeTag
              ? `<span class="active-tag">${text}</span>`
              : `<a href="${getLink(tag, sortChronologically)}">${text}</a>`
          )
      );
  }

  function getLink(tag, sortChronologically) {
    const tagType = tag[0];
    const tagId = tag.substring(1);
    let path;
    if (tagType === "@") {
      path = `/for-the-life-history-of/${tagId}`;
      if (isDev && !characters.find((c) => c.id === tagId)) {
        throw new Error(`Unmapped character: ${tag}`);
      }
    } else if (tagType === "#") {
      path = `/for-a-tale-of/${tagId}`;
      if (isDev && !themes.find((t) => t.id === tagId)) {
        throw new Error(`Unmapped theme: ${tag}`);
      }
    } else {
      throw new Error(`Unexpected tag: ${tag}`);
    }
    if (sortChronologically) {
      path += "?starting-from-the-beginning";
    }
    return path;
  }

  function getAdditionalInfo(event, tag, sortChronologically) {
    if (!tag?.startsWith("@")) {
      return [];
    }
    const character = characters.find((c) => c.id === tag.substring(1));
    const ageInfo = getAgeInfo(character, event);
    const relationshipInfo = getRelationshipInfo(
      character,
      event,
      sortChronologically
    );
    return ageInfo.concat(relationshipInfo);
  }

  function getAgeInfo(character, event) {
    if (character.knownAges?.length === 0) {
      return [];
    }
    const deathComparator = getDeathComparator(character, event);
    if (deathComparator < 0) {
      return [];
    }
    const age = getAge(character, event);
    const yearsOld = `${age} year${age !== 1 ? "s" : ""} old`;
    return [
      deathComparator === 0
        ? `${character.shortName} was ${yearsOld} when ${character.pronouns[0]} died`
        : `${character.shortName} is ${yearsOld} in this scene`,
    ];
  }

  function getDeathComparator(character, event) {
    if (!character.death) {
      return +1;
    }
    return (
      character.death.year - event.year ||
      character.death.inYearSortIndex - event.inYearSortIndex
    );
  }

  function getAge(character, event) {
    const eventAge = character.knownAges.find(
      (a) => a.episode === event.episode && a.scene === event.scene
    );
    if (eventAge) {
      return `${eventAge.age}`;
    }
    const knownAge = character.knownAges[0];
    const eventAtKnownAge = events.find(
      (e) => e.episode === knownAge.episode && e.scene === knownAge.scene
    );
    return `about ${event.year - eventAtKnownAge.year + knownAge.age}`;
  }

  function getRelationshipInfo(character, event, sortChronologically) {
    const eventCharacters = event.description
      .match(/@[a-z-]+/g)
      .map((tag) => tag.substring(1));
    const relationships = eventCharacters
      .map((id) => character.relationships.find((r) => r.character === id))
      .filter((r) => !!r);
    return relationships.map((r) => {
      const relation = characters.find((c) => c.id === r.character);
      const characterPossessive = `${character.shortName}’${
        character.shortName.endsWith("s") ? "" : "s"
      }`;
      const relationLink = getLink(`@${relation.id}`, sortChronologically);
      return `<a href="${relationLink}">${relation.shortName}</a> is ${characterPossessive} ${r.relationship}`;
    });
  }

  return {
    pageTitle,
    toTimeline,
  };
};
