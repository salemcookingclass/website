// Dynamically load all class_*.js
function importAll(r) {
  return r.keys().map(r);
}

const classes = importAll(
  require.context("./classes", false, /^\.\/class_.*\.js$/)
).map((mod) => mod.default);

export default classes;
