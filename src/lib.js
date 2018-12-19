const { parser } = require("./inputLib.js");

const {
  getIllegalOptionMessage,
  getIllegalCountMessage,
  getFileErrorMessage,
  getIllegalOffsetMessage,
} = require("./error.js");

const {
  generateHeader,
  isOptionValid,
  splitByLine,
  splitByChar,
  isFileInvalid,  
} = require("./util.js");

/* ======= PRIMARY FUNCTIONS ======= */

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
  return count == 0 || !Number.isInteger(+count); //could be a string match
};

const handleHeadErrors = function (userArgs) {
  const { option, count } = parser(userArgs);
  
  if (!isOptionValid(option)) {
    return getIllegalOptionMessage("head", option);
  }

  if (isOptionValid(option) && isCountInvalid(count)) {
    return getIllegalCountMessage(count, option);
  }

  return false;
};

//add operation as a arg, if head 
const handleTailErrors = function (userArgs) {
  const { option, count } = parser(userArgs);
  
  if (!isOptionValid(option)) {
    return getIllegalOptionMessage("tail", option);
  }

  if (isOptionValid(option) && isCountInvalid(count)) {
    return getIllegalOffsetMessage(count);
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
  readLinesFromTop,
  readCharFromTop,
  handleHeadErrors,
  readLinesFromBottom,
  readCharFromBottom,
  extractFilenames,
  handleTailErrors,
  tail
};