module.exports = (env) => {
  const safe = env.getFilter("safe");

  function pageTitle(subject) {
    return subject.replace(/[a-zA-Z]/, (letter) => letter.toUpperCase());
  }

  function getLink(tag) {
    const type = tag[0];
    const id = tag.substring(1);
    if (type === "@") {
      return `/for-the-life-history-of/${id}`;
    } else if (type === "#") {
      return `/for-a-tale-of/${id}`;
    } else {
      return null;
    }
  }

  function withLinks(paragraph) {
    return safe(
      paragraph.replace(/\[([^\]]+)\]\(([@#][a-z-]+)\)/g, (_, text, tag) => {
        const link = getLink(tag);
        return `<a href="${link}">${text}</a>`;
      })
    );
  }

  return {
    pageTitle,
    getLink,
    withLinks,
  };
};
