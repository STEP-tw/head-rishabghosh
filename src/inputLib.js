const {
  isOptionValid,
} = require("../src/util.js");

//startingIndex can be filename starting index, or better name?

const createClassifiedInput = function(option, count, startingIndex) {
  return { option, count, startingIndex };
};

//better name
const ifOptionNotDefault = function(userArgs) {
  let firstArg = userArgs[0];
  let option = "n";
  let count = 10;
  let startingIndex = 1;
  
  // for -- file1
  if (firstArg === "--") {
    return createClassifiedInput(option, count, startingIndex);
  }
  
  // for -5 file1
  if (!isNaN(firstArg)) {
    count = Math.abs(firstArg);
    return createClassifiedInput(option, count, startingIndex);
  }
  
  // for -n 5 file1, -c 7 file1
  option = firstArg[1];
  if (isOptionValid(firstArg[1]) && firstArg.length === 2) {
    count = userArgs[1];
    startingIndex = 2;
    return createClassifiedInput(option, count, startingIndex);
  }
  
  //default return  for -n5 file1, -a5 file1
  count = firstArg.slice(2);
  startingIndex = 1;
  return createClassifiedInput(option, count, startingIndex);
};



const parser = function(userArgs) {
  const firstArg = userArgs[0];
  let option = "n";
  let count = 10;
  let startingIndex = 0;
  
  if (firstArg.startsWith("-")) {
    return ifOptionNotDefault(userArgs);
  }
    
  return createClassifiedInput(option, count, startingIndex);
};

module.exports = { parser };