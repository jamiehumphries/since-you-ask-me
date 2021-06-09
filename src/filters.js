module.exports = (env) => {
  const safe = env.getFilter("safe");

  function pageTitle(subject) {
    return subject
      .replace(/<\/?em>/g, "")
      .replace(/[a-zA-Z]/, (letter) => letter.toUpperCase());
  }

  function getLink(tagOrUrl, sortChronologically) {
    const tagType = tagOrUrl[0];
    const tagId = tagOrUrl.substring(1);
    let path;
    if (tagType === "@") {
      path = `/for-the-life-history-of/${tagId}`;
    } else if (tagType === "#") {
      path = `/for-a-tale-of/${tagId}`;
    } else {
      return tagOrUrl;
    }
    if (sortChronologically) {
      path += "?starting-from-the-beginning";
    }
    return path;
  }

  function withLinks(paragraph, sortChronologically) {
    return safe(
      paragraph.replace(
        /\[([^\]]+)\]\(([@#][0-9a-z-]+)\)/g,
        (_, text, tagOrUrl) => {
          const link = getLink(tagOrUrl, sortChronologically);
          return `<a href="${link}">${text}</a>`;
        }
      )
    );
  }

  return {
    pageTitle,
    getLink,
    withLinks,
  };
};
