/*eslint-env node*/

const fs = require("fs");

const { tail } = require("./src/lib.js");

const main = function() {
  console.log(tail(process.argv, fs));
};

main();