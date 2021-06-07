const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");

const router = require("./router");

const isDev = process.env.NODE_ENV === "development";

const app = express();

nunjucks.configure(path.join(__dirname, "frontend"), {
  express: app,
  noCache: isDev,
  watch: isDev,
});

app.set("view engine", "njk");

app.use(router);
app.use(express.static(path.join(__dirname, "public/static/")));
app.use(express.static(path.join(__dirname, "public/generated/")));

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
