/*eslint indent: ["error", 2, { "SwitchCase": 1 }]*/

const { parser } = require("./inputLib.js");

const {
  getIllegalOptionMsgForHead,
  getIllegalOptionMsgForTail,
  getIllegalCountMessage,
  getFileErrorMessage,
  getIllegalOffsetMessage,
} = require("./error.js");

const {
  generateHeader,
  isOptionLine,
  isOptionChar,
  isOptionInvalid,
  splitByLine,
  splitByChar,
  isFileInvalid,  
} = require("./util.js");

/* ======= PRIMARY FUNCTIONS ======= */

const isDefaultChoice = function (firstArg) {
  return firstArg[0] !== "-";
};

const extractCountAndStartingIndex = function (userArgs) {
  let firstArg = userArgs[0];
  let lineCount = 0;
  let charCount = 0;
  let startingIndex = 0;

  if (isDefaultChoice(firstArg)) {//can use !startsWith
    startingIndex = 0;
    lineCount = 10;
    return { lineCount, charCount, startingIndex };
  }

  if (firstArg === "--") {
    startingIndex = 1;
    lineCount = 10;
    return { lineCount, charCount, startingIndex };
  }
   
  if (!isNaN(firstArg)) {
    startingIndex = 1;
    lineCount = firstArg.slice(1); 
    return { lineCount, charCount, startingIndex };
  }

  /*
   * should use better logic to get rid of this switch-case
   */

  switch (firstArg.slice(2).length) { //length of count value if present
    case 0:
      startingIndex = 2;
      if (firstArg[1] === "n") { lineCount = userArgs[1]; }
      if (firstArg[1] === "c") { charCount = userArgs[1]; }
      break;
    default:
      startingIndex = 1;
      if (firstArg[1] === "n") { lineCount = firstArg.slice(2); }
      if (firstArg[1] === "c") { charCount = firstArg.slice(2); }
  }

  return { lineCount, charCount, startingIndex };
};

const extractFilenames = function(userArgs) {
  const { startingIndex } = parser(userArgs);
  let result = [];
  for (let index = startingIndex; index < userArgs.length; index++) {
    let filePath = userArgs[index];
    result.push(filePath);
  }
  return result;
};

/* ========== READ ========== */

const readLinesFromTop = function (filePath, reader, noOfLines) {
  let totalContent = splitByLine(filePath, reader);
  totalContent.push("\n\n");
  return totalContent.slice(0, noOfLines).join("\n");
};

const readCharFromTop = function (filePath, reader, noOfChar) {
  const totalContent = splitByChar(filePath, reader);
  return totalContent.slice(0, noOfChar).join("");
};

const readLinesFromBottom = function (filePath, reader, noOfLines) {
  let totalContent = splitByLine(filePath, reader);
  let sliceFrom = totalContent.length - noOfLines;
  if (sliceFrom < 0) { sliceFrom = 0; }
  return totalContent.slice(sliceFrom).join("\n");
};

const readCharFromBottom = function (filePath, reader, noOfChar) {
  let totalContent = splitByChar(filePath, reader);
  let sliceFrom = totalContent.length - noOfChar;
  if (sliceFrom < 0) { sliceFrom = 0; }
  return totalContent.slice(sliceFrom).join(""); 
};

//put it in a function 
const readingMethods = {
  head: { n: readLinesFromTop, c: readCharFromTop },
  tail: { n: readLinesFromBottom, c: readCharFromBottom }
};

/* =========== ARRANGE ============ */

const getContents = function(userArgs, filePath, reader, operation) {
  const { option, count } = parser(userArgs);
  const chosenMethod = readingMethods[operation][option];
  return chosenMethod(filePath, reader, count);
};

const arrangeContents = function (userArgs, fs, operation) {
  const reader = fs.readFileSync;
  const fileList = extractFilenames(userArgs);
  const noOfFiles = fileList.length;

  return fileList.map( function(filePath){
    if (isFileInvalid(filePath, fs)) {
      return getFileErrorMessage(filePath, operation);
    }
    if (noOfFiles === 1) {
      return getContents(userArgs, filePath, reader, operation);
    }
    return generateHeader(filePath) + "\n" + 
    getContents(userArgs, filePath, reader, operation);
  }).join("\n");
};

/* ====== CREATE ERROR MESSAGE ====== */

const isCountInvalid = function (count) {
  return count < 1 || !Number.isInteger(+count);
};

const handleHeadErrors = function (userArgs) {
  const { lineCount, charCount } = extractCountAndStartingIndex(userArgs);

  if (!isDefaultChoice(userArgs[0])) {//name it better

    if (isOptionInvalid(userArgs[0])) {
      return getIllegalOptionMsgForHead(userArgs[0][1]);
    }

    if (isOptionLine(userArgs[0]) && isCountInvalid(lineCount)) {
      return getIllegalCountMessage(lineCount, "line");
    }

    if (isOptionChar(userArgs[0]) && isCountInvalid(charCount)) {
      return getIllegalCountMessage(charCount, "byte");
    }

  }
  return false;
};

const handleTailErrors = function (userArgs) {
  let illegalCount;
  const { lineCount, charCount } = extractCountAndStartingIndex(userArgs);

  if(!Number.isInteger(+lineCount)) { illegalCount = lineCount; }
  if(!Number.isInteger(+charCount)) { illegalCount = charCount; }

  if (userArgs[0][0] === "-") {

    if (isOptionInvalid(userArgs[0])) {
      return getIllegalOptionMsgForTail(userArgs[0][1]);
    }

    if (!isOptionInvalid(userArgs[0]) && illegalCount !== undefined) {
      return getIllegalOffsetMessage(illegalCount);
    } 
  }
  return false;
};

/* ========= HEAD & TAIL ========= */

const hasHeadError = function(userArgs) {
  return handleHeadErrors(userArgs);
};

const head = function (userArgs, fs) {
  if (hasHeadError(userArgs)) {
    return handleHeadErrors(userArgs);
  }
  return arrangeContents(userArgs, fs, "head");
};

const hasTailErrors = function(userArgs) {
  return handleTailErrors(userArgs);
};

const tail = function (userArgs, fs) {
  if (hasTailErrors(userArgs)) { 
    return handleTailErrors(userArgs);
  }
  return arrangeContents(userArgs, fs, "tail");
};

/* ======== EXPORTS ========= */

module.exports = {
  head,
  getContents,
  arrangeContents,
  extractCountAndStartingIndex,
  readLinesFromTop,
  readCharFromTop,
  handleHeadErrors,
  readLinesFromBottom,
  readCharFromBottom,
  extractFilenames,
  handleTailErrors,
  tail
};