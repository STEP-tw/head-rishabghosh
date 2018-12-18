const {
  isOptionValid,
} = require("../src/util.js");

//better name
const ifOptionNotDefault = function(userArgs) {
  let firstArg = userArgs[0];
  
  // for -- file1
  if (firstArg === "--") { 
    return { option: "n", count: 10, startingIndex: 1 };
  }
  
  // for -5 file1
  if (!isNaN(firstArg)) {
    return { option: "n", count: Math.abs(firstArg), startingIndex: 1 };
  }
  
  // for -n 5 file1, -c 7 file1
  if (isOptionValid(firstArg[1]) && firstArg.length === 2) {
    return { option: firstArg[1], count: userArgs[1], startingIndex: 2 };
  }
  
  //default return  for -n5 file1, -a5 file1
  return { option: firstArg[1], count: firstArg.slice(2), startingIndex: 1 };
};



const parser = function(userArgs) {
  const firstArg = userArgs[0];
  
  if (firstArg.startsWith("-")) {
    return ifOptionNotDefault(userArgs);
  }
    
  return { option: "n", count: 10, startingIndex: 0 }; 
};

module.exports = { parser };