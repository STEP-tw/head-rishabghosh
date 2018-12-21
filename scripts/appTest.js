const shellCmd = require("child_process").execSync;
const file1 = process.argv[3];
const file2 = process.argv[4];
const utility = process.argv[2];
const green = "\x1b[32m";
const red = "\x1b[31m";
const reset = "\x1b[0m";

const executeShellCmd = function(utility, args) {
  let totalArgs = args.reduce( (acc, value)=> acc + " " + value, utility);
  const shellOut = shellCmd(totalArgs).toString("utf8");
  return { shellOut, totalArgs };
};

const createSysOut = function(...options) {
  let userArgs = options.slice();
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
  const { totalArgs } = createUserOut("");
  const method = "for " + totalArgs ;
  const sysOut = createSysOut("").shellOut.trim();
  const userOut = createUserOut("").shellOut.trim();
  //let method = "for "
  if(sysOut === userOut) {
    message = green + "Match Found" + reset;
  }
  return method + "\n" + message;
};

console.log(logStatus());
