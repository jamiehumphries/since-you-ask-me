const fs = require("fs");
const glob = require("glob");
const sass = require("node-sass");
const { dirname, join } = require("path");
const rimraf = require("rimraf");
const request = require("supertest");

const buildApp = require("./src/app");
const data = require("./src/data");

const root = "docs";
rimraf.sync(root);

fs.mkdirSync(root);
fs.writeFileSync(join(root, ".nojekyll"), "");
fs.writeFileSync(join(root, "CNAME"), "well.since-you-ask.me");

const staticFiles = glob
  .sync("src/public/static/**/*", { nodir: true })
  .map((path) => path.replace("src/public/static", ""));
for (const file of staticFiles) {
  fs.mkdirSync(join(root, dirname(file)), { recursive: true });
  fs.copyFileSync(join("src/public/static", file), join("docs", file));
}

const { css } = sass.renderSync({
  file: "src/styles/main.scss",
  outputStyle: "compressed",
});
fs.mkdirSync(join(root, "css"), { recursive: true });
fs.writeFileSync(join(root, "css", "main.css"), css);

const episodes = [...new Set(data.events.map(({ episode }) => episode))];
const paths = [
  "/",
  ...data.characters.map(({ id }) => `/for-the-life-history-of/${id}`),
  ...data.themes.map(({ id }) => `/for-a-tale-of/${id}`),
  ...data.events.map(
    ({ episode, scene }) =>
      `/what-happened-in/episode-${episode}/scene-${scene}`
  ),
  ...episodes.map((episode) => `/what-happened-in/episode-${episode}`),
].flatMap((path) => [
  path,
  path === "/"
    ? "/starting-from-the-beginning"
    : `${path}/starting-from-the-beginning`,
]);

const app = buildApp(false, false);

Promise.all(
  paths.map((path) => {
    fs.mkdirSync(join(root, path), { recursive: true });
    return request(app)
      .get(path)
      .then((res) =>
        fs.writeFileSync(join(root, path, "index.html"), res.text)
      );
  })
)
  .then(() =>
    request(app)
      .get("/an/unmapped/route")
      .then((res) => fs.writeFileSync(join(root, "404.html"), res.text))
  )
  .then(() => {
    console.log("Build complete.");
    process.exit();
  });
