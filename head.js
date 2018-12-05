/*eslint-env node*/

const reader = require("fs").readFileSync;

const { headFile } = require("./src/lib.js");

const main = function(filename) {
  return headFile(filename, reader);
};

console.log( main(process.argv[2]) );

exports.main = main;

