const express = require("express");
const enforce = require("express-sslify");
const nunjucks = require("nunjucks");
const path = require("path");

const { notFoundHandler, unexpectedErrorHandler } = require("./error-handlers");
const filters = require("./filters");
const router = require("./router");

const isDev = process.env.NODE_ENV === "development";

const app = express();

if (!isDev) {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

const views = path.join(__dirname, "views");
const nunjucksEnv = nunjucks.configure(views, {
  express: app,
  noCache: isDev,
  watch: isDev,
});
Object.entries(filters(nunjucksEnv, isDev)).forEach(([name, filter]) =>
  nunjucksEnv.addFilter(name, filter)
);
app.set("view engine", "njk");

app.use(router);

app.use(express.static(path.join(__dirname, "public/static/")));
app.use(express.static(path.join(__dirname, "public/generated/")));

app.use(notFoundHandler());
app.use(unexpectedErrorHandler(isDev));

if (isDev) {
  const bsConfig = require("../bs-config");
  const proxiedURL = new URL(bsConfig.proxy);
  const proxiedPort = proxiedURL.port;
  app.listen(proxiedPort, () => {
    console.log(`Listening on port ${bsConfig.port} via Browsersync.`);
  });
} else {
  const port = +process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
  });
}
