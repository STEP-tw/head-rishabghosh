/*eslint-env node*/

const reader = require("fs").readFileSync;

const { head } = require("./src/lib.js");

const main = function(userInput) {
  return head(userInput, reader);
};

console.log(main(process.argv));

exports.main = main;