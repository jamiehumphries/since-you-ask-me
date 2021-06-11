const { characters, events } = require("./data");

module.exports = (env) => {
  const safe = env.getFilter("safe");

  function pageTitle(subject) {
    return subject
      .replace(/<\/?em>/g, "")
      .replace(/[a-zA-Z]/, (letter) => letter.toUpperCase());
  }

  function toTimeline(event, activeTag, sortChronologically) {
    const paragraphs = getParagraphs(event, activeTag, sortChronologically);
    const additionalInfo = getAdditionalInfo(event, activeTag);
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
        paragraph.replace(/\[([^\]]+)\]\(([@#][0-9a-z-]+)\)/g, (_, text, tag) =>
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
    } else if (tagType === "#") {
      path = `/for-a-tale-of/${tagId}`;
    } else {
      throw new Error(`Unexpected tag: ${tag}`);
    }
    if (sortChronologically) {
      path += "?starting-from-the-beginning";
    }
    return path;
  }

  function getAdditionalInfo(event, tag) {
    if (!tag?.startsWith("@")) {
      return [];
    }
    const character = characters.find((c) => c.id === tag.substring(1));
    const age = getAge(character, event);
    const ageInfo = age
      ? [`${character.shortName} is ${age} years old in this scene`]
      : [];
    const relationships = getRelationships(character, event);
    const relationshipInfo = relationships.map((r) => {
      const relation = characters.find((c) => c.id === r.character);
      const characterPossessive = `${character.shortName}’${
        character.shortName.endsWith("s") ? "" : "s"
      }`;
      return `${relation.shortName} is ${characterPossessive} ${r.relationship}`;
    });
    return ageInfo.concat(relationshipInfo);
  }

  function getAge(character, event) {
    if (character.knownAges?.length === 0) {
      return null;
    }
    const eventAge = character.knownAges.find(
      (a) => a.episode === event.episode && a.scene === event.scene
    );
    if (eventAge) {
      return eventAge.age;
    }
    const knownAge = character.knownAges[0];
    const eventAtKnownAge = events.find(
      (e) => e.episode === knownAge.episode && e.scene === knownAge.scene
    );
    return `about ${event.year - eventAtKnownAge.year + knownAge.age}`;
  }

  function getRelationships(character, event) {
    const eventCharacters = event.description
      .match(/@[a-z-]+/g)
      .map((tag) => tag.substring(1));
    return eventCharacters
      .map((id) => character.relationships.find((r) => r.character === id))
      .filter((r) => !!r);
  }

  return {
    pageTitle,
    toTimeline,
  };
};
