module.exports = {
  overrides: [
    {
      files: "*.njk",
      options: {
        parser: "melody",
      },
    },
  ],
  plugins: ["./node_modules/prettier-plugin-twig-melody"],
  twigMelodyPlugins: ["node_modules/prettier-plugin-twig-enhancements"],
};
