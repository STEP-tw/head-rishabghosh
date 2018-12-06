const fs = require("fs");

const green = "\x1b[32m";
const red = "\x1b[31m";
const reset = "\x1b[0m";

let myHead = fs.readFileSync("./.myHead", "utf8").trim();
let sysHead = fs.readFileSync("./.sysHead", "utf8").trim();
let message = red + "Not Matched" + reset;

if (myHead == sysHead) {
  message = green + "Match Found" + reset;
}

console.log(message);
