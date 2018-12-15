/*eslint-env node*/

const fs = require("fs");

const { tail } = require("./src/lib.js");

const main = function() {
  process.stdout.write(tail(process.argv, fs));
};

main();