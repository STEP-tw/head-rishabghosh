/*eslint-env node*/
const shelljs = require("shelljs");
const { testData } = require("./appTestData.js");

const file1 = process.argv[3];
const file2 = process.argv[4];
const utility = process.argv[2];
const green = "\x1b[32m";
const red = "\x1b[31m";
const reset = "\x1b[0m";

const shellCmd = function(commandLineArg) {
  return shelljs.exec(commandLineArg, {silent:true});
};

const executeShellCmd = function(utility, args) {
  const totalArgs = args.reduce( (acc, value)=> acc + " " + value, utility);
  const shellOut = shellCmd(totalArgs).output;
  return { shellOut, totalArgs };
};

const createSysOut = function(...options) {
  let userArgs = options.slice();
  //add a if to push two files
  userArgs.push(file1);
  const { shellOut, totalArgs } = executeShellCmd(utility, userArgs);
  return { shellOut, totalArgs };
};

const createUserOut = function(...options) {
  let userArgs = options.slice();
  userArgs.push(file1);
  const args = "node " + utility + ".js";
  const { shellOut, totalArgs } = executeShellCmd(args, userArgs);
  return { shellOut, totalArgs };
};

const logStatus = function(){
  let message = red + "Not Matched" + reset;

  for (let index = 0; index < testData.length; index++) {
    const currentArg = testData[index];
    
    const { totalArgs } = createUserOut(currentArg);
    const method = "for " + totalArgs ;
    const sysOut = createSysOut(currentArg).shellOut.trim();
    const userOut = createUserOut(currentArg).shellOut.trim();
    if(sysOut === userOut) {
      message = green + "Match Found" + reset;
    }
    console.log(method + "\n" + message);
  }
};

logStatus();
