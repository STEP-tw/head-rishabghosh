/*eslint-env node*/

const fs = require("fs");

const { tail } = require("./src/lib.js");

const main = function(userInput) {
  return tail(userInput, fs);
};

console.log(main(process.argv));



