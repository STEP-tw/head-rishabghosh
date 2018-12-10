/*eslint-env node*/

const fs = require("fs");

const { head } = require("./src/lib.js");

const main = function(userInput) {
  return head(userInput, fs);
};

console.log(main(process.argv));

