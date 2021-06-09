module.exports = (env) => {
  const safe = env.getFilter("safe");

  function pageTitle(subject) {
    return subject
      .replace(/<\/?em>/g, "")
      .replace(/[a-zA-Z]/, (letter) => letter.toUpperCase());
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

  function withLinks(paragraph, activeTag, sortChronologically) {
    return safe(
      paragraph.replace(/\[([^\]]+)\]\(([@#][0-9a-z-]+)\)/g, (_, text, tag) => {
        if (tag === activeTag) {
          return `<span class="active-tag">${text}</span>`;
        } else {
          const link = getLink(tag, sortChronologically);
          return `<a href="${link}">${text}</a>`;
        }
      })
    );
  }

  return {
    pageTitle,
    getLink,
    withLinks,
  };
};
