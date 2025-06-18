export default {
  input: "src",
  output: "dist",
  components: "src/components",
  pages: "src/pages",
  theme: "src/theme.css",
  build: {
    minify: true,
    purgeUnusedCSS: true,
    enableSlots: true,
    enableConditionals: true
  }
};