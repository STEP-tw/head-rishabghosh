/*eslint-env node*/

const fs = require("fs");

const { head } = require("./src/lib.js");

const main = function() {
  process.stdout.write(head(process.argv.slice(2), fs));
};

main();
