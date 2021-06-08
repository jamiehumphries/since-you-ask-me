function notFoundHandler() {
  return (req, res) => {
    res.status(404).render("not-found");
  };
}

function unexpectedErrorHandler(isDev) {
  return (err, req, res, next) => {
    if (res.headersSent) {
      next(err);
      return;
    }
    const options = isDev ? { error: err } : {};
    res.status(500).render("error", options);
  };
}

module.exports = {
  notFoundHandler,
  unexpectedErrorHandler,
};
