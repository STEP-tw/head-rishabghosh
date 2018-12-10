const fs = require("fs");

const green = "\x1b[32m";
const red = "\x1b[31m";
const reset = "\x1b[0m";

let usrTail = fs.readFileSync("./.usrTail", "utf8").trim();
let sysTail = fs.readFileSync("./.sysTail", "utf8").trim();
let message = red + "Not Matched" + reset;

if (usrTail == sysTail) {
  message = green + "Match Found" + reset;
}

console.log(message);
