function notFoundHandler() {
  return (req, res) => {
    res.status(404).render("404-error");
  };
}

function unexpectedErrorHandler(isDev) {
  return (err, req, res, next) => {
    if (res.headersSent) {
      next(err);
      return;
    }
    const options = isDev ? { error: err } : {};
    res.status(500).render("500-error", options);
  };
}

module.exports = {
  notFoundHandler,
  unexpectedErrorHandler,
};
